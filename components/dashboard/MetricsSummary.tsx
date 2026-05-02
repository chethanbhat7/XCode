"use client";

import React from "react";
import { GlassCard } from "@/components/ui/glass-card";
import { Badge } from "@/components/ui/badge-advanced";
import { DepartmentMetrics } from "@/lib/dashboard-types";
import { ProgressBar } from "@/components/ui/progress-bar";
import { Users, TrendingUp, CheckCircle2, Zap } from "lucide-react";

interface MetricsSummaryProps {
  metrics: DepartmentMetrics;
}

export function MetricsSummary({ metrics }: MetricsSummaryProps) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
        gap: "20px",
      }}
    >
      {/* Total Projects */}
      <GlassCard>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "start",
            marginBottom: "16px",
          }}
        >
          <div>
            <div
              style={{
                fontSize: "0.75rem",
                color: "#97a6c0",
                textTransform: "uppercase",
                fontWeight: "700",
                letterSpacing: "0.05em",
                marginBottom: "6px",
              }}
            >
              Organization Pipeline
            </div>
            <div style={{ fontSize: "2rem", fontWeight: "800", color: "#e5eefc", letterSpacing: "-0.02em" }}>
              {metrics.totalProjects}
            </div>
          </div>
          <div
            style={{
              fontSize: "1.5rem",
              background: "linear-gradient(135deg, rgba(59, 130, 246, 0.2), rgba(59, 130, 246, 0.05))",
              width: "56px",
              height: "56px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: "16px",
              boxShadow: "0 8px 16px rgba(59, 130, 246, 0.1)",
              border: "1px solid rgba(59, 130, 246, 0.2)"
            }}
          >
            📊
          </div>
        </div>
        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
          <Badge label={`${metrics.activeProjects} Active`} variant="info" size="sm" />
          <Badge label={`${metrics.completedProjects} Done`} variant="success" size="sm" />
        </div>
      </GlassCard>

      {/* Team Size */}
      <GlassCard>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "start",
            marginBottom: "16px",
          }}
        >
          <div>
            <div
              style={{
                fontSize: "0.75rem",
                color: "#97a6c0",
                textTransform: "uppercase",
                fontWeight: "700",
                letterSpacing: "0.05em",
                marginBottom: "6px",
              }}
            >
              Engineering Talent
            </div>
            <div style={{ fontSize: "2rem", fontWeight: "800", color: "#e5eefc", letterSpacing: "-0.02em" }}>
              {metrics.teamSize}
            </div>
          </div>
          <div
            style={{
              fontSize: "1.5rem",
              background: "linear-gradient(135deg, rgba(34, 197, 94, 0.2), rgba(34, 197, 94, 0.05))",
              width: "56px",
              height: "56px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: "16px",
              boxShadow: "0 8px 16px rgba(34, 197, 94, 0.1)",
              border: "1px solid rgba(34, 197, 94, 0.2)"
            }}
          >
            👥
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "0.85rem", color: "#97a6c0" }}>
          <TrendingUp size={14} color="#22c55e" />
          <span>+2 members this month</span>
        </div>
      </GlassCard>

      {/* Avg Productivity */}
      <GlassCard>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "start",
            marginBottom: "16px",
          }}
        >
          <div>
            <div
              style={{
                fontSize: "0.75rem",
                color: "#97a6c0",
                textTransform: "uppercase",
                fontWeight: "700",
                letterSpacing: "0.05em",
                marginBottom: "6px",
              }}
            >
              Efficiency Rating
            </div>
            <div style={{ fontSize: "2rem", fontWeight: "800", color: "#e5eefc", letterSpacing: "-0.02em" }}>
              {metrics.averageProductivity.toFixed(0)}%
            </div>
          </div>
          <div
            style={{
              fontSize: "1.5rem",
              background: "linear-gradient(135deg, rgba(147, 51, 234, 0.2), rgba(147, 51, 234, 0.05))",
              width: "56px",
              height: "56px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: "16px",
              boxShadow: "0 8px 16px rgba(147, 51, 234, 0.1)",
              border: "1px solid rgba(147, 51, 234, 0.2)"
            }}
          >
            ⚡
          </div>
        </div>
        <ProgressBar
          value={metrics.averageProductivity}
          label="Target: 95%"
          showPercent={false}
          color="purple"
          height="6px"
        />
        <div style={{ fontSize: "0.7rem", color: "#97a6c0", marginTop: "6px", textAlign: "right" }}>
          Top decile performance
        </div>
      </GlassCard>

      {/* AI Contribution */}
      <GlassCard>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "start",
            marginBottom: "16px",
          }}
        >
          <div>
            <div
              style={{
                fontSize: "0.75rem",
                color: "#97a6c0",
                textTransform: "uppercase",
                fontWeight: "700",
                letterSpacing: "0.05em",
                marginBottom: "6px",
              }}
            >
              AI Contribution
            </div>
            <div style={{ fontSize: "2rem", fontWeight: "800", color: "#e5eefc", letterSpacing: "-0.02em" }}>
              {((metrics.totalTokensUsed / 200000) * 100).toFixed(1)}%
            </div>
          </div>
          <div
            style={{
              fontSize: "1.5rem",
              background: "linear-gradient(135deg, rgba(245, 158, 11, 0.2), rgba(245, 158, 11, 0.05))",
              width: "56px",
              height: "56px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: "16px",
              boxShadow: "0 8px 16px rgba(245, 158, 11, 0.1)",
              border: "1px solid rgba(245, 158, 11, 0.2)"
            }}
          >
            🤖
          </div>
        </div>
        <ProgressBar
          value={(metrics.totalTokensUsed / 200000) * 100}
          label={`${(metrics.totalTokensUsed / 1000).toFixed(0)}k tokens used`}
          showPercent={false}
          color="amber"
          height="6px"
        />
        <div style={{ fontSize: "0.7rem", color: "#97a6c0", marginTop: "6px", textAlign: "right" }}>
          AI automated 12% of commits
        </div>
      </GlassCard>
    </div>
  );
}

export default MetricsSummary;
