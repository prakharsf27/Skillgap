import { NextRequest, NextResponse } from "next/server";
import { evaluateProjectInterview } from "@/lib/gemini";
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
    const { projectInfo, chatLogs } = body;

    if (!projectInfo || !chatLogs) {
      return NextResponse.json({ error: "Missing evaluation parameters" }, { status: 400 });
    }

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({ error: "Gemini API key not configured" }, { status: 500 });
    }

    const report = await evaluateProjectInterview(projectInfo, chatLogs);

    // Save to DB if authenticated
    if (userId) {
      try {
        await prisma.assessment.create({
          data: {
            userId,
            category: "Project",
            title: `Project: ${projectInfo.name}`,
            difficulty: "Medium",
            score: report.overallScore || 0,
            feedback: report.summary || "",
            submittedCode: null,
          },
        });

        // Update overall readiness score in User model
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
      } catch (dbErr) {
        console.error("Failed to save project assessment to DB:", dbErr);
      }
    }

    return NextResponse.json({
      success: true,
      report,
    });
  } catch (err) {
    console.error("[API /ai/project-evaluate]", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Project evaluation failed" },
      { status: 500 }
    );
  }
}
