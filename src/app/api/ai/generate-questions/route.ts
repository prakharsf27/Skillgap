import { NextRequest, NextResponse } from "next/server";
import { generateDsaQuestions } from "@/lib/groq";
import { generateScenarioQuestions } from "@/lib/gemini";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { language = "javascript", targetRole } = body;

    if (!process.env.GROQ_API_KEY) {
      return NextResponse.json({ error: "Groq API key not configured" }, { status: 500 });
    }
    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({ error: "Gemini API key not configured" }, { status: 500 });
    }

    // Generate DSA questions using Groq, and Scenario questions using Gemini in parallel
    const [dsaQuestions, scenarioQuestions] = await Promise.all([
      generateDsaQuestions(language),
      generateScenarioQuestions(targetRole),
    ]);

    return NextResponse.json({
      success: true,
      dsaQuestions,
      scenarioQuestions,
      generatedAt: new Date().toISOString(),
    });
  } catch (err) {
    console.error("[API /ai/generate-questions]", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Question generation failed" },
      { status: 500 }
    );
  }
}
