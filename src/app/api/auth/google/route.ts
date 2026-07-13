import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import prisma from "@/lib/db";

const JWT_SECRET = process.env.JWT_SECRET || "skillgap-default-secret-key-123456";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { credential } = body;

    if (!credential) {
      return NextResponse.json({ error: "Google credential is required" }, { status: 400 });
    }

    // Verify token using Google's tokeninfo API
    const googleRes = await fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${credential}`);
    if (!googleRes.ok) {
      return NextResponse.json({ error: "Invalid Google credential" }, { status: 400 });
    }

    const payload = await googleRes.json();
    const { email, name } = payload;

    if (!email) {
      return NextResponse.json({ error: "Email not provided by Google account" }, { status: 400 });
    }

    // Check if user already exists
    let user = await prisma.user.findUnique({
      where: { email },
    });

    let isNew = false;

    if (!user) {
      isNew = true;
      // Generate a secure random password for Google-authenticated users
      const randomPassword = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
      const hashedPassword = await bcrypt.hash(randomPassword, 10);

      // Create new user
      user = await prisma.user.create({
        data: {
          name: name || email.split("@")[0],
          email,
          password: hashedPassword,
        },
      });
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: "7d" });

    // Set cookie
    const cookieStore = await cookies();
    cookieStore.set("auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
      sameSite: "lax",
    });

    return NextResponse.json({
      success: true,
      isNew,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        targetTrack: user.targetTrack,
        readinessScore: user.readinessScore,
      },
    });
  } catch (err: any) {
    console.error("[API auth/google] Error:", err);
    return NextResponse.json({ error: err.message || "Google authentication failed" }, { status: 500 });
  }
}
