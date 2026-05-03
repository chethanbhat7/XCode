import { NextResponse } from "next/server";
import { getDatabase } from "@/lib/db";

export async function GET() {
  try {
    const db = await getDatabase();
    const usage = await db.collection("ai_usage").findOne({});
    return NextResponse.json(usage || { 
      tokensUsed: 0, 
      tokensLimit: 50000, 
      promptsUsed: 0, 
      promptsLimit: 1000, 
      assistantSessions: 0, 
      lastUsed: new Date().toISOString() 
    });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch usage" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { tokens, prompts } = await req.json();
    const db = await getDatabase();
    
    const updateDoc = {
      $inc: {
        tokensUsed: tokens || 0,
        promptsUsed: prompts || 0,
      },
      $set: {
        lastUsed: new Date().toISOString(),
      }
    };
    
    await db.collection("ai_usage").updateOne({}, updateDoc, { upsert: true });
    const newUsage = await db.collection("ai_usage").findOne({});
    
    return NextResponse.json(newUsage);
  } catch (error) {
    return NextResponse.json({ error: "Failed to update usage" }, { status: 500 });
  }
}
