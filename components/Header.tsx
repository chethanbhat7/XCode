"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { readSession, clearSession } from "@/lib/session";

export function Header() {
  const router = useRouter();
  const session = readSession();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleLogout() {
    clearSession();
    router.push("/");
  }

  function handleGitHubConnect() {
    // Placeholder for GitHub OAuth
    alert("GitHub OAuth integration coming soon!");
    setDropdownOpen(false);
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
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <div
          style={{
            width: "40px",
            height: "40px",
            borderRadius: "10px",
            background: "linear-gradient(145deg, #56d0ff, #7c5cff)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "white",
            fontWeight: "800",
            fontSize: "1rem",
            boxShadow: "0 12px 24px rgba(86, 208, 255, 0.12)",
          }}
        >
          X
        </div>
        <div>
          <div style={{ fontWeight: "700", fontSize: "1rem", margin: "0" }}>X Code</div>
          <div style={{ fontSize: "0.75rem", color: "#97a6c0", margin: "0" }}>
            {session?.role === "manager" ? "Manager" : "Developer"}
          </div>
        </div>
      </div>

      {/* Right: Profile dropdown */}
      <div style={{ position: "relative" }} ref={dropdownRef}>
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
          {session?.name.charAt(0).toUpperCase()}
        </button>

        {/* Dropdown Menu */}
        {dropdownOpen && (
          <div
            style={{
              position: "absolute",
              top: "56px",
              right: "0",
              background: "linear-gradient(180deg, rgba(15,23,42,0.94), rgba(10,15,31,0.92))",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: "14px",
              boxShadow: "0 12px 40px rgba(0, 0, 0, 0.6)",
              minWidth: "240px",
              zIndex: 1000,
              overflow: "hidden",
            }}
          >
            {/* User info section */}
            <div style={{ padding: "14px 16px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
              <div style={{ fontSize: "0.88rem", fontWeight: "700", marginBottom: "4px" }}>
                {session?.name}
              </div>
              <div style={{ fontSize: "0.78rem", color: "#97a6c0", wordBreak: "break-word" }}>
                {session?.email}
              </div>
            </div>

            {/* GitHub Connect */}
            <button
              onClick={handleGitHubConnect}
              style={{
                width: "100%",
                padding: "12px 16px",
                background: "transparent",
                border: "none",
                color: "#e5eefc",
                textAlign: "left",
                cursor: "pointer",
                fontSize: "0.88rem",
                fontWeight: "600",
                transition: "background 160ms ease",
                borderBottom: "1px solid rgba(255,255,255,0.06)",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.04)")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
            >
              🔗 Connect GitHub
            </button>

            {/* Logout */}
            <button
              onClick={handleLogout}
              style={{
                width: "100%",
                padding: "12px 16px",
                background: "transparent",
                border: "none",
                color: "#fecdd3",
                textAlign: "left",
                cursor: "pointer",
                fontSize: "0.88rem",
                fontWeight: "600",
                transition: "background 160ms ease",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(251,113,133,0.12)")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
            >
              🚪 Logout
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
