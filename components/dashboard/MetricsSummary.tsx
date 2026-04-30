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
        gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
        gap: "16px",
      }}
    >
      {/* Total Projects */}
      <GlassCard>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "start",
            marginBottom: "12px",
          }}
        >
          <div>
            <div
              style={{
                fontSize: "0.75rem",
                color: "#97a6c0",
                textTransform: "uppercase",
                fontWeight: "600",
                marginBottom: "4px",
              }}
            >
              Total Projects
            </div>
            <div style={{ fontSize: "1.75rem", fontWeight: "700", color: "#e5eefc" }}>
              {metrics.totalProjects}
            </div>
          </div>
          <div
            style={{
              fontSize: "1.5rem",
              background: "rgba(59, 130, 246, 0.2)",
              width: "48px",
              height: "48px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: "12px",
            }}
          >
            📊
          </div>
        </div>
        <Badge label={`${metrics.activeProjects} active`} variant="info" size="sm" />
      </GlassCard>

      {/* Team Size */}
      <GlassCard>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "start",
            marginBottom: "12px",
          }}
        >
          <div>
            <div
              style={{
                fontSize: "0.75rem",
                color: "#97a6c0",
                textTransform: "uppercase",
                fontWeight: "600",
                marginBottom: "4px",
              }}
            >
              Team Size
            </div>
            <div style={{ fontSize: "1.75rem", fontWeight: "700", color: "#e5eefc" }}>
              {metrics.teamSize}
            </div>
          </div>
          <div
            style={{
              fontSize: "1.5rem",
              background: "rgba(34, 197, 94, 0.2)",
              width: "48px",
              height: "48px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: "12px",
            }}
          >
            👥
          </div>
        </div>
        <div style={{ fontSize: "0.8rem", color: "#97a6c0" }}>
          Across {metrics.totalProjects} projects
        </div>
      </GlassCard>

      {/* Avg Productivity */}
      <GlassCard>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "start",
            marginBottom: "12px",
          }}
        >
          <div>
            <div
              style={{
                fontSize: "0.75rem",
                color: "#97a6c0",
                textTransform: "uppercase",
                fontWeight: "600",
                marginBottom: "4px",
              }}
            >
              Avg Productivity
            </div>
            <div style={{ fontSize: "1.75rem", fontWeight: "700", color: "#e5eefc" }}>
              {metrics.averageProductivity.toFixed(0)}%
            </div>
          </div>
          <div
            style={{
              fontSize: "1.5rem",
              background: "rgba(147, 51, 234, 0.2)",
              width: "48px",
              height: "48px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: "12px",
            }}
          >
            ⚡
          </div>
        </div>
        <ProgressBar
          value={metrics.averageProductivity}
          label="Team average"
          showPercent={false}
          color="purple"
          height="4px"
        />
      </GlassCard>

      {/* Deadline Metrics */}
      <GlassCard>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "start",
            marginBottom: "12px",
          }}
        >
          <div>
            <div
              style={{
                fontSize: "0.75rem",
                color: "#97a6c0",
                textTransform: "uppercase",
                fontWeight: "600",
                marginBottom: "4px",
              }}
            >
              Deadlines Met
            </div>
            <div style={{ fontSize: "1.75rem", fontWeight: "700", color: "#e5eefc" }}>
              {metrics.avgDeadlineMet.toFixed(0)}%
            </div>
          </div>
          <div
            style={{
              fontSize: "1.5rem",
              background: "rgba(245, 158, 11, 0.2)",
              width: "48px",
              height: "48px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: "12px",
            }}
          >
            ✓
          </div>
        </div>
        <ProgressBar
          value={metrics.avgDeadlineMet}
          label="On-time delivery"
          showPercent={false}
          color="amber"
          height="4px"
        />
      </GlassCard>
    </div>
  );
}

export default MetricsSummary;
