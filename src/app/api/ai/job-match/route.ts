import { NextRequest, NextResponse } from "next/server";
import { matchJobDescription } from "@/lib/gemini";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { jobDescription, userProfile } = body;

    if (!jobDescription || !userProfile) {
      return NextResponse.json({ error: "jobDescription and userProfile are required" }, { status: 400 });
    }

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({ error: "Gemini API key not configured" }, { status: 500 });
    }

    const result = await matchJobDescription(jobDescription, userProfile);
    return NextResponse.json({ success: true, result });
  } catch (err) {
    console.error("[API /ai/job-match]", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Job matching failed" },
      { status: 500 }
    );
  }
}
