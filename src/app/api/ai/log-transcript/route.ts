import { NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { projectId, projectName, questionText, sttTranscript, aiResponse, isFollowUp } = body;

    if (!questionText || !sttTranscript || !aiResponse) {
      return NextResponse.json(
        { error: "Missing required fields for transcript logging" },
        { status: 400 }
      );
    }

    // Persist interview turn transcript into Neon PostgreSQL
    const log = await prisma.interviewLog.create({
      data: {
        projectId: projectId || null,
        projectName: projectName || null,
        questionText,
        sttTranscript,
        aiResponse,
        isFollowUp: !!isFollowUp,
      },
    });

    console.log(`[Interview STT Collector] Logged turn ${log.id} for project "${projectName || "General"}"`);

    return NextResponse.json({ success: true, logId: log.id });
  } catch (error: any) {
    console.error("[Interview STT Collector Error]:", error);
    return NextResponse.json(
      { error: "Failed to log transcript", details: error.message },
      { status: 500 }
    );
  }
}
