"use client";

import React, { useState } from "react";
import { GlassCard } from "@/components/ui/glass-card";
import { CommitActivity } from "@/lib/dashboard-types";
import { GitCommit } from "lucide-react";

interface CommitHeatmapProps {
  activity: CommitActivity[];
  height?: string;
}

export function CommitHeatmap({ activity, height = "200px" }: CommitHeatmapProps) {
  const maxCommits = Math.max(...activity.map((a) => a.count), 1);

  const getIntensity = (count: number) => {
    if (count === 0) return "rgba(255, 255, 255, 0.02)";
    const intensity = count / maxCommits;
    if (intensity > 0.75) return "rgba(34, 197, 94, 0.8)";
    if (intensity > 0.5) return "rgba(34, 197, 94, 0.6)";
    if (intensity > 0.25) return "rgba(34, 197, 94, 0.4)";
    return "rgba(34, 197, 94, 0.2)";
  };

  return (
    <GlassCard>
      <div style={{ marginBottom: "16px" }}>
        <h3
          style={{
            fontSize: "1rem",
            fontWeight: "700",
            color: "#e5eefc",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            margin: "0",
          }}
        >
          <GitCommit size={18} /> Commit Activity
        </h3>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${Math.min(activity.length, 7)}, 1fr)`,
          gap: "6px",
          height: height,
          alignItems: "flex-end",
        }}
      >
        {activity.map((day, idx) => (
          <div
            key={idx}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "4px",
              cursor: "pointer",
              transition: "all 0.2s",
            }}
            title={`${day.date}: ${day.count} commits`}
          >
            <div
              style={{
                width: "100%",
                height: `${Math.max(20, (day.count / maxCommits) * 100)}px`,
                background: getIntensity(day.count),
                borderRadius: "4px",
                border: "1px solid rgba(34, 197, 94, 0.2)",
                transition: "all 0.3s",
                cursor: "pointer",
              }}
              onMouseEnter={(e: any) => {
                (e.currentTarget as HTMLElement).style.transform = "scale(1.05)";
              }}
              onMouseLeave={(e: any) => {
                (e.currentTarget as HTMLElement).style.transform = "scale(1)";
              }}
            />
            <span
              style={{
                fontSize: "0.65rem",
                color: "#97a6c0",
                textAlign: "center",
                width: "100%",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {new Date(day.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
            </span>
            <span
              style={{
                fontSize: "0.7rem",
                color: "#3b82f6",
                fontWeight: "700",
              }}
            >
              {day.count}
            </span>
          </div>
        ))}
      </div>

      <div
        style={{
          marginTop: "16px",
          padding: "12px",
          background: "rgba(255, 255, 255, 0.02)",
          borderRadius: "8px",
          fontSize: "0.8rem",
          color: "#97a6c0",
        }}
      >
        <strong>{activity.reduce((sum, a) => sum + a.count, 0)}</strong> commits in the last{" "}
        <strong>{activity.length}</strong> days
      </div>
    </GlassCard>
  );
}

export default CommitHeatmap;
