import { NextRequest, NextResponse } from "next/server";
import { evaluateCodingAnswer } from "@/lib/groq";
import { evaluateScenarioAnswer } from "@/lib/gemini";

export async function POST(request: NextRequest) {
  try {
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
