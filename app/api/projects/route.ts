import { NextRequest, NextResponse } from "next/server";
import { getDatabase } from "@/lib/db";
import { ObjectId } from "mongodb";

export async function GET(request: NextRequest) {
  try {
    const db = await getDatabase();
    const projects = await db.collection("projects").find({}).toArray();
    
    return NextResponse.json(projects);
  } catch (error: any) {
    console.error("GET projects error:", error);
    return NextResponse.json({ error: "Failed to fetch projects" }, { status: 500 });
  }
}

import { mockTeamMembers } from "@/lib/mock-data";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const db = await getDatabase();
    
    // Fetch team members from DB, fallback to mock if DB is empty
    let teamMembers = body.teamMembers || [];
    if (teamMembers.length === 0) {
      const dbTeamMembers = await db.collection("team_members").find({}).toArray();
      teamMembers = dbTeamMembers.length ? dbTeamMembers : mockTeamMembers;
    }

    // Add default fields if not present
    const newProject = {
      ...body,
      id: body.id || new ObjectId().toString(),
      status: body.status || "planning",
      progress: body.progress || 0,
      createdAt: new Date(),
      teamMembers: teamMembers,
      tasks: body.tasks || [],
    };

    const result = await db.collection("projects").insertOne(newProject);
    return NextResponse.json({ ok: true, project: newProject }, { status: 201 });
  } catch (error: any) {
    console.error("POST project error:", error);
    return NextResponse.json({ error: "Failed to create project" }, { status: 500 });
  }
}
