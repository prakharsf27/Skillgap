import { NextRequest, NextResponse } from "next/server";
import { checkSyntax } from "@/lib/groq";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { code, language } = body;

    if (!code || !language) {
      return NextResponse.json({ error: "code and language are required" }, { status: 400 });
    }

    if (!process.env.GROQ_API_KEY) {
      return NextResponse.json({ error: "Groq API key not configured" }, { status: 500 });
    }

    const result = await checkSyntax(code, language);
    return NextResponse.json({ success: true, result });
  } catch (err) {
    console.error("[API /ai/syntax-check]", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Syntax check failed" },
      { status: 500 }
    );
  }
}
