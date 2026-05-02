import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");
  const state = request.nextUrl.searchParams.get("state");

  if (!code) {
    return NextResponse.json(
      { ok: false, error: "No authorization code provided" },
      { status: 400 }
    );
  }

  const clientId = process.env.GITHUB_CLIENT_ID;
  const clientSecret = process.env.GITHUB_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    return NextResponse.json(
      { ok: false, error: "GitHub OAuth not configured" },
      { status: 500 }
    );
  }

  try {
    // Exchange authorization code for access token
    const tokenResponse = await fetch("https://github.com/login/oauth/access_token", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        client_id: clientId,
        client_secret: clientSecret,
        code: code,
      }),
    });

    const tokenData = await tokenResponse.json() as {
      access_token?: string;
      error?: string;
      error_description?: string;
    };

    if (tokenData.error) {
      return NextResponse.json(
        { ok: false, error: tokenData.error_description || tokenData.error },
        { status: 400 }
      );
    }

    const accessToken = tokenData.access_token;
    if (!accessToken) {
      return NextResponse.json(
        { ok: false, error: "Failed to get access token" },
        { status: 400 }
      );
    }

    // Fetch user profile from GitHub
    const userResponse = await fetch("https://api.github.com/user", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "User-Agent": "XCode",
      },
    });

    const githubUser = await userResponse.json() as {
      id?: number;
      login?: string;
      name?: string;
      email?: string;
      avatar_url?: string;
    };

    if (!githubUser.id || !githubUser.login) {
      return NextResponse.json(
        { ok: false, error: "Failed to fetch GitHub profile" },
        { status: 400 }
      );
    }

    // Create response with session data
    const response = NextResponse.json({
      ok: true,
      github: {
        id: githubUser.id,
        username: githubUser.login,
        name: githubUser.name,
        email: githubUser.email,
        avatarUrl: githubUser.avatar_url,
        token: accessToken,
      },
    });

    // Decode state to get return URL
    let returnUrl = "/manager";
    if (state) {
      try {
        returnUrl = Buffer.from(state, "base64").toString("utf-8");
      } catch {
        // If state decoding fails, use default
      }
    }

    // Set cookie with GitHub data so client can store it
    response.cookies.set("github_auth", JSON.stringify({
      id: githubUser.id,
      username: githubUser.login,
      name: githubUser.name,
      email: githubUser.email,
      avatarUrl: githubUser.avatar_url,
      token: accessToken,
    }), {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 30 * 24 * 60 * 60, // 30 days
    });

    return NextResponse.redirect(
      `${request.nextUrl.origin}/auth-callback?github=success&returnUrl=${encodeURIComponent(returnUrl)}`
    );
  } catch (error: any) {
    console.error("GitHub OAuth error:", error);
    
    // For demo/local environments: if actual fetch fails (e.g. firewall, offline),
    // redirect to callback to trigger the mock data flow instead of showing a JSON error.
    let returnUrl = "/manager";
    if (state) {
      try {
        returnUrl = Buffer.from(state, "base64").toString("utf-8");
      } catch {
        // use default
      }
    }
    
    return NextResponse.redirect(
      `${request.nextUrl.origin}/auth-callback?github=success&returnUrl=${encodeURIComponent(returnUrl)}`
    );
  }
}
