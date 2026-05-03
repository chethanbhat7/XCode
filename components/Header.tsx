"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { clearSession, readSession, saveSession, type SessionUser } from "@/lib/session";

export function Header() {
  const router = useRouter();
  const [session, setSession] = useState<SessionUser | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [dropdownRef, setDropdownRef] = useState<HTMLDivElement | null>(null);

  useEffect(() => {
    setSession(readSession());
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef && !dropdownRef.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [dropdownRef]);

  function handleLogout() {
    clearSession();
    router.push("/");
  }

  function handleGitHubConnect() {
    setDropdownOpen(false);
    // Redirect to GitHub OAuth flow
    window.location.href = `/api/auth/github-init?returnUrl=${encodeURIComponent(window.location.pathname)}`;
  }



  return (
    <header
      style={{
        height: "70px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        paddingLeft: "28px",
        paddingRight: "28px",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
        background: "linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0.01))",
        backdropFilter: "blur(10px) saturate(110%)",
      }}
    >
      {/* Left: App name */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "12px",
          cursor: "pointer"
        }}
        onClick={() => router.push(session?.role === "developer" ? "/developer" : "/manager")}
      >
        <div
          style={{
            width: "42px",
            height: "42px",
            borderRadius: "12px",
            background: "linear-gradient(135deg, #00c6ff, #0072ff, #7c5cff)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "white",
            fontWeight: "900",
            fontSize: "1.2rem",
            boxShadow: "0 8px 20px rgba(0, 114, 255, 0.3), inset 0 2px 4px rgba(255,255,255,0.3)",
            position: "relative",
            overflow: "hidden"
          }}
        >
          <div style={{
            position: "absolute",
            top: "-50%",
            left: "-50%",
            width: "200%",
            height: "200%",
            background: "radial-gradient(circle, rgba(255,255,255,0.2) 0%, transparent 70%)",
            pointerEvents: "none"
          }} />
          X
        </div>
        <div>
          <div style={{
            fontWeight: "800",
            fontSize: "1.1rem",
            margin: "0",
            background: "linear-gradient(to right, #fff, #97a6c0)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            letterSpacing: "-0.01em"
          }}>
            PulseBoard
          </div>
          <div style={{ fontSize: "0.7rem", color: "#60a5fa", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.05em", opacity: 0.8 }}>
            {session ? (session.role === "manager" ? "Command Center" : "Developer Suite") : "X Code"}
          </div>
        </div>
      </div>

      {/* Right: Profile dropdown */}
      <div style={{ position: "relative" }} ref={setDropdownRef}>
        <button
          onClick={() => setDropdownOpen(!dropdownOpen)}
          style={{
            width: "44px",
            height: "44px",
            borderRadius: "50%",
            background: "linear-gradient(145deg, #56d0ff, #7c5cff)",
            border: "none",
            color: "white",
            fontWeight: "800",
            fontSize: "1.1rem",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 10px 30px rgba(86, 208, 255, 0.12)",
            transition: "transform 160ms ease",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
          onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
        >
          {session?.name.charAt(0).toUpperCase() ?? ""}
        </button>

        {/* Dropdown Menu */}
        {dropdownOpen && (
          <div
            style={{
              position: "absolute",
              top: "60px",
              right: "0",
              background: "rgba(15, 23, 42, 0.95)",
              backdropFilter: "blur(20px) saturate(180%)",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              borderRadius: "16px",
              boxShadow: "0 20px 50px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255,255,255,0.05)",
              minWidth: "260px",
              zIndex: 1000,
              overflow: "hidden",
              animation: "dropdownFadeIn 0.2s ease-out",
            }}
          >
            {/* User info section */}
            <div style={{ padding: "14px 16px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
              <div style={{ fontSize: "0.88rem", fontWeight: "700", marginBottom: "4px" }}>
                {session?.name ?? ""}
              </div>
              <div style={{ fontSize: "0.78rem", color: "#97a6c0", wordBreak: "break-word" }}>
                {session?.email ?? ""}
              </div>
            </div>

            {/* GitHub Connect */}
            <div style={{ padding: "8px 12px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
              <button
                onClick={session?.githubUsername ? undefined : handleGitHubConnect}
                disabled={!!session?.githubUsername}
                style={{
                  width: "100%",
                  padding: "10px 14px",
                  borderRadius: "10px",
                  background: session?.githubUsername
                    ? "rgba(34, 197, 94, 0.1)"
                    : "rgba(255, 255, 255, 0.03)",
                  border: session?.githubUsername
                    ? "1px solid rgba(34, 197, 94, 0.3)"
                    : "1px solid rgba(255, 255, 255, 0.08)",
                  color: session?.githubUsername ? "#4ade80" : "#e5eefc",
                  textAlign: "left",
                  cursor: session?.githubUsername ? "default" : "pointer",
                  fontSize: "0.85rem",
                  fontWeight: "600",
                  transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                }}
                onMouseEnter={(e) => {
                  if (!session?.githubUsername) {
                    e.currentTarget.style.background = "rgba(255, 255, 255, 0.08)";
                    e.currentTarget.style.transform = "translateY(-1px)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!session?.githubUsername) {
                    e.currentTarget.style.background = "rgba(255, 255, 255, 0.03)";
                    e.currentTarget.style.transform = "translateY(0)";
                  }
                }}
              >
                {session?.githubUsername ? (
                  <>
                    <div
                      style={{
                        width: "24px",
                        height: "24px",
                        borderRadius: "50%",
                        background: "linear-gradient(135deg, #22c55e, #16a34a)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "0.8rem",
                        flexShrink: 0,
                        color: "white",
                        boxShadow: "0 0 10px rgba(34, 197, 94, 0.4)"
                      }}
                    >
                      ✓
                    </div>
                    <div>
                      <div style={{ color: "#fff", fontSize: "0.8rem" }}>GitHub Linked</div>
                      <div style={{ fontSize: "0.7rem", color: "#4ade80", opacity: 0.9 }}>
                        @{session.githubUsername}
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <span style={{ fontSize: "1.1rem" }}>🐙</span>
                    Connect GitHub
                  </>
                )}
              </button>


            </div>

            {/* Logout */}
            <div style={{ padding: "10px 12px 14px 12px" }}>
              <button
                onClick={handleLogout}
                style={{
                  width: "100%",
                  padding: "10px 14px",
                  borderRadius: "10px",
                  background: "transparent",
                  border: "none",
                  color: "#fda4af",
                  textAlign: "left",
                  cursor: "pointer",
                  fontSize: "0.85rem",
                  fontWeight: "600",
                  transition: "all 0.2s",
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "rgba(225, 29, 72, 0.1)";
                }}
                onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
              >
                <span style={{ fontSize: "1.1rem" }}>🚪</span>
                Sign Out
              </button>
            </div>
          </div>
        )}
      </div>
      {/* Animations */}
      <style>{`
        @keyframes dropdownFadeIn {
          from { opacity: 0; transform: translateY(-10px) scale(0.95); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </header>
  );
}
