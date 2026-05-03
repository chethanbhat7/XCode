import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { getDatabase } from "@/lib/db";
import { getBestCandidate } from "@/lib/task-allocation";
import { Task, TeamMember } from "@/lib/dashboard-types";
import { ObjectId } from "mongodb";

export async function POST(req: NextRequest) {
  try {
    const { goal, projectId } = await req.json();
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json({ error: "Gemini API Key missing" }, { status: 500 });
    }

    const db = await getDatabase();
    
    // Fetch team members and existing tasks for allocation engine
    const teamMembers = await db.collection("team_members").find({}).toArray() as unknown as TeamMember[];
    const projectTasks = await db.collection("tasks").find({ projectId }).toArray() as unknown as Task[];

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const prompt = `
      You are an engineering manager. Break down the following project goal into 3-5 specific developer tasks.
      Return ONLY a JSON array of objects with the following keys:
      - "title": short task title
      - "description": detailed description
      - "estimatedHours": integer between 2 and 16
      - "priority": "high", "medium", or "low"

      Goal: ${goal}
    `;

    const result = await model.generateContent(prompt);
    const text = result.response.text();
    
    // Extract JSON array from response
    const jsonMatch = text.match(/\[[\s\S]*\]/);
    if (!jsonMatch) {
      throw new Error("Failed to parse JSON from AI response");
    }

    const parsedTasks = JSON.parse(jsonMatch[0]);
    const finalTasks: Task[] = [];

    for (const pt of parsedTasks) {
      // Build a preliminary task object to run allocation
      const tempTask: any = {
        id: new ObjectId().toString(),
        title: pt.title,
        description: pt.description,
        status: "todo",
        priority: pt.priority || "medium",
        estimatedHours: pt.estimatedHours || 8,
        actualHours: 0,
        projectId: projectId || "global",
        createdAt: new Date(),
      };

      // Allocate task using the engine
      const bestDev = getBestCandidate(tempTask, teamMembers, projectTasks);
      
      tempTask.assignee = bestDev || teamMembers[0];
      finalTasks.push(tempTask);
    }

    // Save tasks to MongoDB
    if (finalTasks.length > 0) {
      await db.collection("tasks").insertMany(finalTasks);
      
      // Update AI Usage
      await db.collection("ai_usage").updateOne(
        {}, 
        { 
          $inc: { tokensUsed: text.length / 4, promptsUsed: 1 },
          $set: { lastUsed: new Date().toISOString() }
        },
        { upsert: true }
      );
    }

    return NextResponse.json({ tasks: finalTasks });
  } catch (error: any) {
    console.error("Generate tasks error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
