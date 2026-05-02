import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const clientId = process.env.GITHUB_CLIENT_ID;
  if (!clientId) {
    return NextResponse.json(
      { ok: false, error: "GitHub OAuth not configured" },
      { status: 500 }
    );
  }

  // Get the return URL from query params (where to redirect after auth)
  const returnUrl = request.nextUrl.searchParams.get("returnUrl") || "/manager";

  // Construct GitHub authorization URL
  const authUrl = new URL("https://github.com/login/oauth/authorize");
  authUrl.searchParams.append("client_id", clientId);
  authUrl.searchParams.append("scope", "user:email repo");
  authUrl.searchParams.append("redirect_uri", `${process.env.GITHUB_OAUTH_CALLBACK_URL}`);
  authUrl.searchParams.append("state", Buffer.from(returnUrl).toString("base64"));

  return NextResponse.redirect(authUrl.toString());
}
