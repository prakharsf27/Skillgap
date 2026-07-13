import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import prisma from "@/lib/db";

const JWT_SECRET = process.env.JWT_SECRET || "skillgap-default-secret-key-123456";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { accessToken } = body;

    if (!accessToken) {
      return NextResponse.json({ error: "Access token is required" }, { status: 400 });
    }

    // Fetch user profile from Google UserInfo endpoint
    const googleRes = await fetch(`https://www.googleapis.com/oauth2/v3/userinfo?access_token=${accessToken}`);
    if (!googleRes.ok) {
      return NextResponse.json({ error: "Invalid Google access token" }, { status: 400 });
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
      // Generate a secure random password for Google users
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
    console.error("[API auth/google-token] Error:", err);
    return NextResponse.json({ error: err.message || "Google login failed" }, { status: 500 });
  }
}
