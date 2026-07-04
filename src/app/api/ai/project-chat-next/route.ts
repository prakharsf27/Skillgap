import { NextRequest, NextResponse } from "next/server";
import { generateProjectFollowUp } from "@/lib/gemini";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { projectInfo, question, answer, chatHistory } = body;

    if (!projectInfo || !question || !answer || !chatHistory) {
      return NextResponse.json({ error: "Missing interview context" }, { status: 400 });
    }

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({ error: "Gemini API key not configured" }, { status: 500 });
    }

    const followUp = await generateProjectFollowUp(
      projectInfo,
      question,
      answer,
      chatHistory
    );

    return NextResponse.json({
      success: true,
      followUp,
    });
  } catch (err) {
    console.error("[API /ai/project-chat-next]", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to generate follow up question" },
      { status: 500 }
    );
  }
}
