import { NextRequest, NextResponse } from "next/server";
import { evaluateCodingAnswer } from "@/lib/groq";
import { evaluateScenarioAnswer } from "@/lib/gemini";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import prisma from "@/lib/db";

const JWT_SECRET = process.env.JWT_SECRET || "skillgap-default-secret-key-123456";

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;
    let userId: string | null = null;

    if (token) {
      try {
        const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
        userId = decoded.userId;
      } catch {}
    }

    const body = await request.json();
    const { submissions, questions } = body as {
      submissions: Array<{
        questionId: string;
        code: string;
        language: string;
        category: "DSA" | "Scenario";
      }>;
      questions: Array<{
        id: string;
        title: string;
        description: string;
        difficulty: string;
        category: "DSA" | "Scenario";
      }>;
    };

    if (!submissions?.length || !questions?.length) {
      return NextResponse.json({ error: "submissions and questions are required" }, { status: 400 });
    }

    if (!process.env.GROQ_API_KEY || !process.env.GEMINI_API_KEY) {
      return NextResponse.json({ error: "API keys are not fully configured" }, { status: 500 });
    }

    // Evaluate each submission: DSA goes to Groq, Scenario goes to Gemini
    const evaluations = await Promise.all(
      submissions.map(async (sub) => {
        const question = questions.find((q) => q.id === sub.questionId);
        if (!question) return null;

        const evaluation =
          question.category === "DSA"
            ? await evaluateCodingAnswer(question, sub.code, sub.language)
            : await evaluateScenarioAnswer(question, sub.code);

        // Save to DB if user is authenticated
        if (userId) {
          try {
            await prisma.assessment.create({
              data: {
                userId,
                category: question.category,
                title: question.title,
                difficulty: question.difficulty,
                score: evaluation.finalScore || evaluation.correctness || 0,
                feedback: evaluation.feedback,
                submittedCode: question.category === "DSA" ? sub.code : null,
              },
            });
          } catch (dbErr) {
            console.error("Failed to save assessment to DB:", dbErr);
          }
        }

        return {
          questionId: sub.questionId,
          category: question.category,
          metrics: {
            correctness: evaluation.correctness,
            readability: evaluation.readability,
            optimization: evaluation.optimization,
            reasoning: evaluation.reasoning,
          },
          finalScore: evaluation.finalScore,
          feedback: evaluation.feedback,
          strongPoints: evaluation.strongPoints,
          improvements: evaluation.improvements,
          ...(question.category === "DSA"
            ? {
                timeComplexity: (evaluation as { timeComplexity?: string }).timeComplexity,
                spaceComplexity: (evaluation as { spaceComplexity?: string }).spaceComplexity,
                isCorrect: (evaluation as { isCorrect?: boolean }).isCorrect,
              }
            : {}),
        };
      })
    );

    const validEvals = evaluations.filter(Boolean);

    // Compute aggregated scores by category
    const dsaEvals = validEvals.filter((e) => e?.category === "DSA");
    const scenarioEvals = validEvals.filter((e) => e?.category === "Scenario");

    const avgScore = (arr: typeof validEvals) => {
      if (!arr.length) return 0;
      return Math.round(arr.reduce((sum, e) => sum + (e?.finalScore ?? 0), 0) / arr.length);
    };

    const summary = {
      dsaAvg: avgScore(dsaEvals),
      scenarioAvg: avgScore(scenarioEvals),
      overallAvg: avgScore(validEvals),
      totalQuestions: validEvals.length,
      answeredCount: submissions.filter((s) => s.code?.length > 20).length,
    };

    if (userId) {
      try {
        const allUserAssessments = await prisma.assessment.findMany({
          where: { userId },
          select: { score: true },
        });
        if (allUserAssessments.length > 0) {
          const totalScore = allUserAssessments.reduce((sum: number, a) => sum + a.score, 0);
          const newAvg = Math.round(totalScore / allUserAssessments.length);
          await prisma.user.update({
            where: { id: userId },
            data: { readinessScore: newAvg },
          });
        }
      } catch (err) {
        console.error("Failed to update user readiness score in DB:", err);
      }
    }

    return NextResponse.json({
      success: true,
      evaluations: validEvals,
      summary,
      status: "pending_admin_review",
      evaluatedAt: new Date().toISOString(),
    });
  } catch (err) {
    console.error("[API /ai/evaluate]", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Evaluation failed" },
      { status: 500 }
    );
  }
}
