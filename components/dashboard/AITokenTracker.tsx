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
  const tokenPercent = (usage.tokensUsed / usage.tokensLimit) * 100;
  const promptPercent = (usage.promptsUsed / usage.promptsLimit) * 100;

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
          Last used: {new Date(usage.lastUsed).toLocaleString()}
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
              label={`${usage.tokensUsed.toLocaleString()} / ${usage.tokensLimit.toLocaleString()}`}
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
              label={`${usage.promptsUsed} / ${usage.promptsLimit}`}
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
            padding: "12px",
            background: "rgba(59, 130, 246, 0.1)",
            borderRadius: "8px",
            border: "1px solid rgba(59, 130, 246, 0.2)",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <TrendingUp size={16} color="#3b82f6" />
          <div>
            <div style={{ fontSize: "0.9rem", fontWeight: "600", color: "#e5eefc" }}>
              {usage.assistantSessions}
            </div>
            <div style={{ fontSize: "0.75rem", color: "#97a6c0" }}>
              AI Assistant Sessions
            </div>
          </div>
        </div>
      </div>
    </GlassCard>
  );
}

export default AITokenTracker;
