"use client";

import React from "react";
import { GlassCard } from "@/components/ui/glass-card";
import { Badge } from "@/components/ui/badge-advanced";
import { AIUsage } from "@/lib/dashboard-types";
import { Zap, TrendingUp } from "lucide-react";

interface AITokenTrackerProps {
  usage: AIUsage;
}

export function AITokenTracker({ usage }: AITokenTrackerProps) {
  const safeUsage = usage || {
    tokensUsed: 0,
    tokensLimit: 50000,
    promptsUsed: 0,
    promptsLimit: 1000,
    assistantSessions: 0,
    lastUsed: new Date().toISOString()
  };
  
  const tokensLimit = safeUsage.tokensLimit || 50000;
  const promptsLimit = safeUsage.promptsLimit || 1000;
  
  const tokenPercent = ((safeUsage.tokensUsed || 0) / tokensLimit) * 100;
  const promptPercent = ((safeUsage.promptsUsed || 0) / promptsLimit) * 100;

  return (
    <GlassCard>
      <div style={{ marginBottom: "20px" }}>
        <h3
          style={{
            fontSize: "1rem",
            fontWeight: "700",
            color: "#e5eefc",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            margin: "0 0 8px 0",
          }}
        >
          <Zap size={18} color="#fbbf24" /> AI Usage Dashboard
        </h3>
        <p style={{ fontSize: "0.85rem", color: "#97a6c0", margin: "0" }}>
          Last used: {new Date(safeUsage.lastUsed || Date.now()).toLocaleString()}
        </p>
      </div>

      <div style={{ display: "grid", gap: "16px" }}>
        {/* Tokens */}
        <div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "8px",
            }}
          >
            <span style={{ fontSize: "0.9rem", fontWeight: "600", color: "#e5eefc" }}>
              Tokens Used
            </span>
            <Badge
              label={`${(safeUsage.tokensUsed || 0).toLocaleString()} / ${tokensLimit.toLocaleString()}`}
              variant={tokenPercent > 80 ? "danger" : tokenPercent > 60 ? "warning" : "info"}
              size="sm"
            />
          </div>
          <div
            style={{
              width: "100%",
              height: "8px",
              background: "rgba(255, 255, 255, 0.05)",
              borderRadius: "4px",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                height: "100%",
                width: `${tokenPercent}%`,
                background:
                  tokenPercent > 80
                    ? "linear-gradient(90deg, #ef4444, #dc2626)"
                    : tokenPercent > 60
                      ? "linear-gradient(90deg, #fbbf24, #d97706)"
                      : "linear-gradient(90deg, #3b82f6, #1d4ed8)",
                transition: "width 0.6s ease",
              }}
            />
          </div>
        </div>

        {/* Prompts */}
        <div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "8px",
            }}
          >
            <span style={{ fontSize: "0.9rem", fontWeight: "600", color: "#e5eefc" }}>
              Prompts Used
            </span>
            <Badge
              label={`${safeUsage.promptsUsed || 0} / ${promptsLimit}`}
              variant={promptPercent > 80 ? "danger" : promptPercent > 60 ? "warning" : "success"}
              size="sm"
            />
          </div>
          <div
            style={{
              width: "100%",
              height: "8px",
              background: "rgba(255, 255, 255, 0.05)",
              borderRadius: "4px",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                height: "100%",
                width: `${promptPercent}%`,
                background:
                  promptPercent > 80
                    ? "linear-gradient(90deg, #ef4444, #dc2626)"
                    : promptPercent > 60
                      ? "linear-gradient(90deg, #fbbf24, #d97706)"
                      : "linear-gradient(90deg, #22c55e, #16a34a)",
                transition: "width 0.6s ease",
              }}
            />
          </div>
        </div>

        {/* Sessions */}
        <div
          style={{
            padding: "16px",
            background: "linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(59, 130, 246, 0.02))",
            borderRadius: "12px",
            border: "1px solid rgba(59, 130, 246, 0.15)",
            display: "flex",
            alignItems: "center",
            gap: "12px",
          }}
        >
          <div style={{ padding: "8px", background: "rgba(59, 130, 246, 0.2)", borderRadius: "8px" }}>
            <TrendingUp size={18} color="#60a5fa" />
          </div>
          <div>
            <div style={{ fontSize: "1.1rem", fontWeight: "700", color: "#fff" }}>
              {safeUsage.assistantSessions || 0}
            </div>
            <div style={{ fontSize: "0.8rem", color: "#97a6c0", fontWeight: "500" }}>
              AI Assistant Sessions
            </div>
          </div>
        </div>

        {/* Top AI Tasks List */}
        <div style={{ marginTop: "8px" }}>
          <div style={{ fontSize: "0.8rem", fontWeight: "700", color: "#97a6c0", textTransform: "uppercase", marginBottom: "12px", letterSpacing: "0.05em" }}>
            Top AI-Driven Tasks
          </div>
          <div style={{ display: "grid", gap: "10px" }}>
            {[
              { name: "Code Review Automation", savings: "1.2h" },
              { name: "Unit Test Generation", savings: "0.8h" },
              { name: "Documentation Sync", savings: "0.5h" }
            ].map((task, i) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 12px", background: "rgba(255,255,255,0.02)", borderRadius: "8px", fontSize: "0.85rem" }}>
                <span style={{ color: "#e5eefc" }}>{task.name}</span>
                <span style={{ color: "#22c55e", fontWeight: "600" }}>+{task.savings}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </GlassCard>
  );
}

export default AITokenTracker;
