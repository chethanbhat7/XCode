import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";
import { getDatabase } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const { message, history, projectId } = await req.json();
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: "Gemini API Key is not configured." },
        { status: 500 }
      );
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    // Gemini requires the first message to be from 'user'. 
    // If the history starts with 'model', we remove it.
    let sanitizedHistory = history || [];
    if (sanitizedHistory.length > 0 && sanitizedHistory[0].role === "model") {
      sanitizedHistory = sanitizedHistory.slice(1);
    }

    const chat = model.startChat({
      history: sanitizedHistory,
    });

    const result = await chat.sendMessage(message);
    const response = await result.response;
    const text = response.text();

    // Persist to MongoDB
    const db = await getDatabase();
    await db.collection("ai_chat_logs").insertOne({
      projectId: projectId || "global",
      message,
      response: text,
      timestamp: new Date(),
    });

    // Increment AI Usage
    await db.collection("ai_usage").updateOne(
      {}, 
      { 
        $inc: { tokensUsed: text.length / 4 + message.length / 4, promptsUsed: 1 },
        $set: { lastUsed: new Date().toISOString() }
      },
      { upsert: true }
    );

    return NextResponse.json({ text });
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to generate AI response." },
      { status: 500 }
    );
  }
}
