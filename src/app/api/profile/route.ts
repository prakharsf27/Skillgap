import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import prisma from "@/lib/db";

const JWT_SECRET = process.env.JWT_SECRET || "skillgap-default-secret-key-123456";

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let decoded: any;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch (jwtErr) {
      return NextResponse.json({ error: "Invalid session token" }, { status: 401 });
    }

    const userId = decoded.userId;
    const body = await request.json();
    const { targetTrack, readinessScore } = body;

    // Update user profile in DB
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        ...(targetTrack !== undefined && { targetTrack }),
        ...(readinessScore !== undefined && { readinessScore: Number(readinessScore) }),
      },
    });

    return NextResponse.json({
      success: true,
      user: {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        targetTrack: updatedUser.targetTrack,
        readinessScore: updatedUser.readinessScore,
      },
    });
  } catch (err: any) {
    console.error("[API profile] Error:", err);
    return NextResponse.json({ error: err.message || "Failed to update profile" }, { status: 500 });
  }
}
