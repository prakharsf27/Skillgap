import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import prisma from "@/lib/db";

const JWT_SECRET = process.env.JWT_SECRET || "skillgap-default-secret-key-123456";

export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Verify token
    let decoded: any;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch (jwtErr) {
      return NextResponse.json({ error: "Invalid session token" }, { status: 401 });
    }

    const userId = decoded.userId;

    // Fetch user details with related profiles
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        resumes: {
          orderBy: { createdAt: "desc" },
          take: 1,
        },
        assessments: {
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        targetTrack: user.targetTrack,
        readinessScore: user.readinessScore,
        resumes: user.resumes,
        assessments: user.assessments,
      },
    });
  } catch (err: any) {
    console.error("[API auth/me] Error:", err);
    return NextResponse.json({ error: err.message || "Failed to fetch session" }, { status: 500 });
  }
}
