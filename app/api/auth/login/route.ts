import { NextRequest, NextResponse } from "next/server";
import { getDatabase } from "@/lib/db";
import { validateEmail, validatePassword } from "@/lib/validation";

import bcrypt from "bcryptjs";
import { SignJWT } from "jose";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    // Validate inputs
    const emailCheck = validateEmail(email);
    if (!emailCheck.valid) {
      return NextResponse.json(
        { ok: false, error: emailCheck.error },
        { status: 400 }
      );
    }

    const passwordCheck = validatePassword(password);
    if (!passwordCheck.valid) {
      return NextResponse.json(
        { ok: false, error: passwordCheck.error },
        { status: 400 }
      );
    }

    // Connect to database
    const db = await getDatabase();
    const usersCollection = db.collection("users");

    // Find user by email
    const user = await usersCollection.findOne({
      email: email.toLowerCase(),
    });

    if (!user) {
      return NextResponse.json(
        { ok: false, error: "Invalid email or password" },
        { status: 401 }
      );
    }

    // Check password securely using bcrypt
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json(
        { ok: false, error: "Invalid email or password" },
        { status: 401 }
      );
    }

    // Generate JWT token
    const secret = new TextEncoder().encode(process.env.JWT_SECRET || "fallback_secret_do_not_use_in_prod");
    const token = await new SignJWT({ 
      id: user._id.toString(), 
      email: user.email, 
      role: user.role 
    })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('24h')
      .sign(secret);

    // Create response and set HttpOnly cookie
    const response = NextResponse.json(
      {
        ok: true,
        user: {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          role: user.role,
        },
      },
      { status: 200 }
    );

    response.cookies.set("xcode.auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24, // 24 hours
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { ok: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
