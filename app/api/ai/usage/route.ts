import { NextResponse } from "next/server";

// Mock database for AI usage
let mockUsage = {
  tokensUsed: 12540,
  tokensLimit: 50000,
  promptsUsed: 142,
  promptsLimit: 1000,
  assistantSessions: 24,
  lastUsed: new Date().toISOString(),
};

export async function GET() {
  return NextResponse.json(mockUsage);
}

export async function POST(req: Request) {
  try {
    const { tokens, prompts } = await req.json();
    
    if (tokens) mockUsage.tokensUsed += tokens;
    if (prompts) mockUsage.promptsUsed += prompts;
    mockUsage.lastUsed = new Date().toISOString();
    
    return NextResponse.json(mockUsage);
  } catch (error) {
    return NextResponse.json({ error: "Failed to update usage" }, { status: 500 });
  }
}
