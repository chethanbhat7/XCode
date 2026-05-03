import { NextRequest, NextResponse } from "next/server";
import { getDatabase } from "@/lib/db";
import { validateRegistration } from "@/lib/validation";

import bcrypt from "bcryptjs";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, password, role } = body;

    // Validate inputs
    const validation = validateRegistration(name, email, password, role);
    if (!validation.valid) {
      return NextResponse.json(
        { ok: false, errors: validation.errors },
        { status: 400 }
      );
    }

    // Connect to database
    const db = await getDatabase();
    const usersCollection = db.collection("users");

    // Check if user already exists
    const existingUser = await usersCollection.findOne({
      email: email.toLowerCase(),
    });

    if (existingUser) {
      return NextResponse.json(
        { ok: false, error: "Email already registered" },
        { status: 409 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = {
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      role,
      createdAt: new Date(),
    };

    const result = await usersCollection.insertOne(newUser);

    return NextResponse.json(
      {
        ok: true,
        user: {
          id: result.insertedId.toString(),
          name,
          email: newUser.email,
          role,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { ok: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
