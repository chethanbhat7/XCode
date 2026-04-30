"use client";

import React from "react";
import { GlassCard } from "@/components/ui/glass-card";
import { ProgressBar } from "@/components/ui/progress-bar";
import { ProductivityMetric } from "@/lib/dashboard-types";
import { TrendingUp, Activity } from "lucide-react";

interface ProductivityChartProps {
  metrics: ProductivityMetric[];
}

export function ProductivityChart({ metrics }: ProductivityChartProps) {
  const maxHours = Math.max(...metrics.map((m) => m.hoursWorked));
  const avgQuality =
    metrics.reduce((sum, m) => sum + m.codeQuality, 0) / metrics.length;

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
          <Activity size={18} color="#22c55e" /> Weekly Productivity
        </h3>
        <p style={{ fontSize: "0.85rem", color: "#97a6c0", margin: "0" }}>
          Last 7 days performance
        </p>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${metrics.length}, 1fr)`,
          gap: "8px",
          marginBottom: "16px",
          minHeight: "150px",
        }}
      >
        {metrics.map((metric, idx) => (
          <div
            key={idx}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "flex-end",
              gap: "8px",
              padding: "8px",
              background: "rgba(255, 255, 255, 0.02)",
              borderRadius: "8px",
              cursor: "pointer",
              transition: "all 0.2s",
            }}
            onMouseEnter={(e: any) => {
              (e.currentTarget as HTMLElement).style.background =
                "rgba(34, 197, 94, 0.1)";
            }}
            onMouseLeave={(e: any) => {
              (e.currentTarget as HTMLElement).style.background =
                "rgba(255, 255, 255, 0.02)";
            }}
          >
            {/* Bar */}
            <div
              style={{
                width: "100%",
                height: `${(metric.hoursWorked / maxHours) * 100}px`,
                background: "linear-gradient(180deg, #22c55e, #16a34a)",
                borderRadius: "4px",
                transition: "all 0.2s",
                boxShadow: "0 0 20px rgba(34, 197, 94, 0.3)",
              }}
              title={`${metric.hoursWorked}h worked`}
            />

            {/* Label */}
            <span
              style={{
                fontSize: "0.7rem",
                color: "#97a6c0",
                textAlign: "center",
              }}
            >
              {new Date(metric.date).toLocaleDateString("en-US", {
                weekday: "short",
              })}
            </span>

            {/* Stats */}
            <div
              style={{
                fontSize: "0.65rem",
                color: "#3b82f6",
                fontWeight: "700",
                textAlign: "center",
              }}
            >
              <div>{metric.taskCompleted} tasks</div>
              <div>{metric.commits} commits</div>
            </div>
          </div>
        ))}
      </div>

      <div
        style={{
          padding: "12px",
          background: "rgba(34, 197, 94, 0.1)",
          borderRadius: "8px",
          border: "1px solid rgba(34, 197, 94, 0.2)",
          display: "flex",
          alignItems: "center",
          gap: "12px",
        }}
      >
        <TrendingUp size={16} color="#22c55e" />
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: "0.9rem", fontWeight: "600", color: "#e5eefc" }}>
            Avg Code Quality: <strong>{avgQuality.toFixed(1)}%</strong>
          </div>
          <div style={{ fontSize: "0.75rem", color: "#97a6c0" }}>
            Total: {metrics.reduce((sum, m) => sum + m.taskCompleted, 0)} tasks
            completed
          </div>
        </div>
      </div>
    </GlassCard>
  );
}

export default ProductivityChart;
