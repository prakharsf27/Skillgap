import { NextRequest, NextResponse } from "next/server";
import { analyzeResume } from "@/lib/gemini";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { resumeText } = body;

    if (!resumeText || resumeText.trim().length === 0) {
      return NextResponse.json({ error: "resumeText is required" }, { status: 400 });
    }

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({ error: "Gemini API key not configured" }, { status: 500 });
    }

    const analysis = await analyzeResume(resumeText);
    return NextResponse.json({ success: true, analysis });
  } catch (err) {
    console.error("[API /ai/resume-analyze]", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Resume analysis failed" },
      { status: 500 }
    );
  }
}
