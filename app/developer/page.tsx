"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/Header";
import { readSession } from "@/lib/session";

export default function DeveloperPage() {
  const router = useRouter();
  const session = readSession();

  useEffect(() => {
    if (!session) {
      router.replace("/");
    }
  }, [router, session]);

  if (!session) return null;

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: "linear-gradient(180deg, #071027 0%, #0a1530 40%, #071023 100%)", color: "#e5eefc" }}>
      <Header />
      
      <main style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "40px 24px" }}>
        <div style={{ textAlign: "center", maxWidth: "640px" }}>
          <h1 style={{ fontSize: "2.6rem", fontWeight: "800", letterSpacing: "-0.03em", margin: "0 0 16px" }}>
            Welcome, {session.name}
          </h1>
          <p style={{ fontSize: "1.1rem", color: "#97a6c0", lineHeight: "1.6", margin: "0 0 32px" }}>
            You are signed in as a Developer. Your workspace dashboard will be available here soon.
          </p>
          
          <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "16px", padding: "24px", marginTop: "32px" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", textAlign: "left" }}>
              <div>
                <div style={{ fontSize: "0.85rem", color: "#97a6c0", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "8px" }}>
                  Role
                </div>
                <div style={{ fontSize: "1rem", fontWeight: "700", textTransform: "capitalize" }}>
                  {session.role}
                </div>
              </div>
              <div>
                <div style={{ fontSize: "0.85rem", color: "#97a6c0", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "8px" }}>
                  Email
                </div>
                <div style={{ fontSize: "1rem", fontWeight: "700", wordBreak: "break-word" }}>
                  {session.email}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}