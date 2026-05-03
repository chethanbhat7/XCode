import { NextRequest, NextResponse } from "next/server";
import { getDatabase } from "@/lib/db";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: projectId } = await params;
    const body = await request.json();
    const db = await getDatabase();
    
    // The body should be the Task object
    const task = {
      ...body,
      createdAt: new Date(),
    };

    // Add to project's tasks array
    await db.collection("projects").updateOne(
      { id: projectId },
      { $push: { tasks: task } }
    );
    
    // Also insert into global tasks collection for easier queries elsewhere
    await db.collection("tasks").insertOne({
      ...task,
      projectId: projectId
    });

    return NextResponse.json({ ok: true, task }, { status: 201 });
  } catch (error: any) {
    console.error("POST task error:", error);
    return NextResponse.json({ error: "Failed to add task" }, { status: 500 });
  }
}
