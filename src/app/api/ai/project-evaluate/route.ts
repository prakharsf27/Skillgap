import { NextRequest, NextResponse } from "next/server";
import { evaluateProjectInterview } from "@/lib/gemini";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { projectInfo, chatLogs } = body;

    if (!projectInfo || !chatLogs) {
      return NextResponse.json({ error: "Missing evaluation parameters" }, { status: 400 });
    }

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({ error: "Gemini API key not configured" }, { status: 500 });
    }

    const report = await evaluateProjectInterview(projectInfo, chatLogs);

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
