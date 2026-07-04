import { NextRequest, NextResponse } from "next/server";
import { verifyCertification } from "@/lib/groq";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, provider, year, skillsLearned } = body;

    if (!title || !provider || !year) {
      return NextResponse.json({ error: "Missing certification details" }, { status: 400 });
    }

    if (!process.env.GROQ_API_KEY) {
      return NextResponse.json({ error: "Groq API key not configured" }, { status: 500 });
    }

    const verificationResult = await verifyCertification(
      title,
      provider,
      year,
      skillsLearned
    );

    return NextResponse.json({
      success: true,
      verification: verificationResult,
    });
  } catch (err) {
    console.error("[API /ai/verify-certification]", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Certification verification failed" },
      { status: 500 }
    );
  }
}
