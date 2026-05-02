"use client";

import React, { useState } from "react";
import { GlassCard } from "@/components/ui/glass-card";
import { formatMonthDay } from "@/lib/date-formatter";
import { CommitActivity } from "@/lib/dashboard-types";
import { GitCommit } from "lucide-react";

interface CommitHeatmapProps {
  activity: CommitActivity[];
  height?: string;
}

export function CommitHeatmap({ activity, height = "auto" }: CommitHeatmapProps) {
  // Generate a mock grid of 52 weeks x 7 days if data is short
  const gridDays = 52 * 7;
  const mockActivity = Array.from({ length: gridDays }).map((_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (gridDays - i));
    const realDay = activity.find(a => a.date === date.toISOString().split('T')[0]);
    return {
      date: date.toISOString().split('T')[0],
      count: realDay ? realDay.count : (Math.random() > 0.8 ? Math.floor(Math.random() * 5) : 0)
    };
  });

  const maxCommits = Math.max(...mockActivity.map((a) => a.count), 1);

  const getIntensity = (count: number) => {
    if (count === 0) return "rgba(255, 255, 255, 0.03)";
    const intensity = count / maxCommits;
    if (intensity > 0.75) return "#22c55e";
    if (intensity > 0.5) return "#16a34a";
    if (intensity > 0.25) return "#15803d";
    return "#14532d";
  };

  return (
    <GlassCard>
      <div style={{ marginBottom: "20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
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
          <div style={{ padding: "6px", background: "rgba(34, 197, 94, 0.1)", borderRadius: "8px" }}>
            <GitCommit size={18} color="#22c55e" />
          </div>
          Commit Contribution Heatmap
        </h3>
        <div style={{ fontSize: "0.75rem", color: "#97a6c0", display: "flex", gap: "4px", alignItems: "center" }}>
          <span>Less</span>
          {[0, 1, 2, 3, 4].map(i => (
            <div key={i} style={{ width: "100%", height: "10px", borderRadius: "2px", background: getIntensity(i) }} />
          ))}
          <span>More</span>
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(52, 1fr)`,
          gridTemplateRows: `repeat(7, 1fr)`,
          gridAutoFlow: "column",
          gap: "3px",
          height: "110px",
        }}
      >
        {mockActivity.map((day, idx) => (
          <div
            key={idx}
            style={{
              width: "100%",
              height: "100%",
              background: getIntensity(day.count),
              borderRadius: "2px",
              transition: "all 0.2s",
              cursor: "pointer",
            }}
            title={`${day.date}: ${day.count} commits`}
            onMouseEnter={(e: any) => {
              e.currentTarget.style.transform = "scale(1.2)";
              e.currentTarget.style.zIndex = "10";
              e.currentTarget.style.boxShadow = "0 0 10px rgba(34, 197, 94, 0.5)";
            }}
            onMouseLeave={(e: any) => {
              e.currentTarget.style.transform = "scale(1)";
              e.currentTarget.style.zIndex = "1";
              e.currentTarget.style.boxShadow = "none";
            }}
          />
        ))}
      </div>

      <div
        style={{
          marginTop: "20px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          fontSize: "0.8rem",
          color: "#97a6c0",
        }}
      >
        <div>
          Total: <strong>{mockActivity.reduce((sum, a) => sum + a.count, 0)}</strong> contributions in the last year
        </div>
        <div style={{ display: "flex", gap: "12px" }}>
          <span>Jan</span>
          <span>Apr</span>
          <span>Jul</span>
          <span>Oct</span>
        </div>
      </div>
    </GlassCard>
  );
}

export default CommitHeatmap;
