import { NextRequest, NextResponse } from "next/server";
import { analyzeResume } from "@/lib/gemini";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import prisma from "@/lib/db";
const pdf = require("pdf-parse/lib/pdf-parse.js");

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

    let resumeText = "";
    const contentType = request.headers.get("content-type") || "";

    if (contentType.includes("multipart/form-data")) {
      const formData = await request.formData();
      const file = formData.get("file") as File;
      if (!file) {
        return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
      }

      const fileBuffer = Buffer.from(await file.arrayBuffer());

      if (file.name.endsWith(".pdf")) {
        const parsed = await pdf(fileBuffer);
        resumeText = parsed.text;
      } else if (file.name.endsWith(".txt")) {
        resumeText = fileBuffer.toString("utf-8");
      } else {
        return NextResponse.json({ error: "Unsupported file format. Only PDF and TXT are supported." }, { status: 400 });
      }
    } else {
      const body = await request.json();
      resumeText = body.resumeText;
    }

    if (!resumeText || resumeText.trim().length === 0) {
      return NextResponse.json({ error: "resumeText is required" }, { status: 400 });
    }

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({ error: "Gemini API key not configured" }, { status: 500 });
    }

    const analysis = await analyzeResume(resumeText);

    // Save to DB if authenticated
    if (userId) {
      try {
        await prisma.resume.create({
          data: {
            userId,
            skills: JSON.stringify(analysis.skills || []),
            experience: JSON.stringify(analysis.experience || []),
            projects: JSON.stringify(analysis.projects || []),
            education: JSON.stringify(analysis.education || []),
            atsScore: analysis.atsScore || 0,
            feedback: analysis.feedback || "",
            missingKeywords: JSON.stringify(analysis.missingKeywords || []),
          },
        });
      } catch (dbErr) {
        console.error("Failed to save resume analysis to DB:", dbErr);
      }
    }

    return NextResponse.json({ success: true, analysis, resumeText });
  } catch (err) {
    console.error("[API /ai/resume-analyze]", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Resume analysis failed" },
      { status: 500 }
    );
  }
}
