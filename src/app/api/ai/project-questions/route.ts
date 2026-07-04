import { NextRequest, NextResponse } from "next/server";
import { generateProjectQuestions } from "@/lib/gemini";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, desc, github, live, tech, challenges } = body;

    if (!name || !desc || !github || !tech) {
      return NextResponse.json({ error: "Missing required project details" }, { status: 400 });
    }

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({ error: "Gemini API key not configured" }, { status: 500 });
    }

    const questions = await generateProjectQuestions({
      name,
      desc,
      github,
      live,
      tech,
      challenges,
    });

    return NextResponse.json({
      success: true,
      questions,
    });
  } catch (err) {
    console.error("[API /ai/project-questions]", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to generate project questions" },
      { status: 500 }
    );
  }
}
