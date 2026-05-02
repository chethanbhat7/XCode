"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { readSession, saveSession } from "@/lib/session";

export default function AuthCallback() {
  const router = useRouter();

  useEffect(() => {
    // Get search params from URL
    const params = new URLSearchParams(window.location.search);
    const githubSuccess = params.get("github");
    const returnUrl = params.get("returnUrl") || "/manager";

    if (githubSuccess === "success") {
      // Get current session
      const session = readSession();
      
      if (!session) {
        // No session, redirect to login
        router.push("/");
        return;
      }

      // Get GitHub data from cookie
      const cookies = document.cookie.split("; ");
      const githubCookie = cookies.find((c) => c.startsWith("github_auth="));

      let githubData = null;
      if (githubCookie) {
        try {
          githubData = JSON.parse(decodeURIComponent(githubCookie.split("=")[1]));
          // Clear the GitHub auth cookie
          document.cookie = "github_auth=; Max-Age=-99999999; path=/";
        } catch (error) {
          console.error("Failed to process GitHub auth cookie:", error);
        }
      }

      // Fallback to mock data if it's a simulated connection (cookie missing)
      if (!githubData) {
        githubData = {
          id: "demo-" + Math.floor(Math.random() * 100000),
          username: session.name.toLowerCase().replace(/\\s+/g, '') + "_demo",
          token: "mock-token-12345",
          avatarUrl: "",
        };
      }

      // Merge GitHub data into session
      const updatedSession = {
        ...session,
        githubId: githubData.id?.toString(),
        githubUsername: githubData.username,
        githubToken: githubData.token,
        githubAvatarUrl: githubData.avatarUrl,
        name: githubData.name || session.name,
      };
      
      saveSession(updatedSession);
      
      // Redirect to return URL
      router.push(returnUrl);
    } else {
      router.push("/");
    }
  }, [router]);

  return (
    <div style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      height: "100vh",
      background: "linear-gradient(135deg, #0a0f1f 0%, #1a1f3a 100%)",
      color: "#e5eefc",
    }}>
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: "1.5rem", marginBottom: "10px" }}>Connecting GitHub...</div>
        <div style={{ fontSize: "0.9rem", color: "#97a6c0" }}>Please wait...</div>
      </div>
    </div>
  );
}
