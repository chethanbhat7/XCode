import { NextRequest, NextResponse } from "next/server";
import { getDatabase } from "@/lib/db";
import { ObjectId } from "mongodb";

export async function GET(request: NextRequest) {
  try {
    const db = await getDatabase();
    const tasks = await db.collection("tasks").find({}).toArray();
    
    return NextResponse.json(tasks);
  } catch (error: any) {
    console.error("GET tasks error:", error);
    return NextResponse.json({ error: "Failed to fetch tasks" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const db = await getDatabase();
    
    // Add default fields if not present
    const newTask = {
      ...body,
      id: body.id || new ObjectId().toString(),
      status: body.status || "todo",
      priority: body.priority || "medium",
      createdAt: new Date(),
    };

    const result = await db.collection("tasks").insertOne(newTask);
    return NextResponse.json({ ok: true, task: newTask }, { status: 201 });
  } catch (error: any) {
    console.error("POST task error:", error);
    return NextResponse.json({ error: "Failed to create task" }, { status: 500 });
  }
}
