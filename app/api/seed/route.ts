import { NextResponse } from "next/server";
import { getDatabase } from "@/lib/db";
import {
  mockProjects,
  mockTasks,
  mockDevelopers,
  mockTeamMembers,
  mockAIUsage,
  mockProductivityMetrics,
  mockCommitActivity
} from "@/lib/mock-data";

export async function GET() {
  try {
    const db = await getDatabase();

    // Check if projects already exist to avoid duplicate seeding
    const projectsCount = await db.collection("projects").countDocuments();
    if (projectsCount > 0) {
      return NextResponse.json({ message: "Database already seeded." });
    }

    // Insert mock data into collections
    await db.collection("projects").insertMany(mockProjects);
    await db.collection("tasks").insertMany(mockTasks);
    await db.collection("developers").insertMany(mockDevelopers);
    await db.collection("team_members").insertMany(mockTeamMembers);
    await db.collection("ai_usage").insertOne(mockAIUsage);
    await db.collection("productivity_metrics").insertMany(mockProductivityMetrics);
    await db.collection("commit_activity").insertMany(mockCommitActivity);

    return NextResponse.json({ message: "Database seeded successfully!" });
  } catch (error: any) {
    console.error("Seed error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
