import { NextResponse } from "next/server";
import { getDatabase } from "@/lib/db";
import { 
  mockCommitActivity, 
  mockProductivityMetrics, 
  mockDevelopers, 
  mockTeamMembers 
} from "@/lib/mock-data";

export async function GET() {
  try {
    const db = await getDatabase();
    
    // Fetch real data from MongoDB
    const projects = await db.collection("projects").find({}).toArray();
    const tasks = await db.collection("tasks").find({}).toArray();
    const aiUsage = await db.collection("ai_usage").findOne({}) || {
      tokensUsed: 0,
      tokensLimit: 50000,
      promptsUsed: 0,
      promptsLimit: 1000,
      assistantSessions: 0,
      lastUsed: new Date().toISOString(),
    };
    
    // Fetch these from DB if they exist, otherwise fallback to mock for now
    const developers = await db.collection("developers").find({}).toArray();
    const teamMembers = await db.collection("team_members").find({}).toArray();
    const commitActivity = await db.collection("commit_activity").find({}).toArray();
    const productivityMetrics = await db.collection("productivity_metrics").find({}).toArray();

    return NextResponse.json({
      projects: projects.length ? projects : [],
      tasks: tasks.length ? tasks : [],
      aiUsage,
      developers: developers.length ? developers : mockDevelopers,
      teamMembers: teamMembers.length ? teamMembers : mockTeamMembers,
      commitActivity: commitActivity.length ? commitActivity : mockCommitActivity,
      productivityMetrics: productivityMetrics.length ? productivityMetrics : mockProductivityMetrics,
    });
  } catch (error: any) {
    console.error("Dashboard data fetch error:", error);
    return NextResponse.json({ error: "Failed to fetch dashboard data" }, { status: 500 });
  }
}
