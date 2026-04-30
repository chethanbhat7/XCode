"use client";

import React from "react";

interface ProgressBarProps {
  value: number;
  max?: number;
  label?: string;
  showPercent?: boolean;
  color?: "blue" | "green" | "purple" | "amber" | "red";
  height?: string;
}

export function ProgressBar({
  value,
  max = 100,
  label,
  showPercent = true,
  color = "blue",
  height = "8px",
}: ProgressBarProps) {
  const percent = Math.min((value / max) * 100, 100);

  const colorMap: Record<string, string> = {
    blue: "linear-gradient(90deg, #3b82f6, #1d4ed8)",
    green: "linear-gradient(90deg, #22c55e, #16a34a)",
    purple: "linear-gradient(90deg, #a855f7, #7e22ce)",
    amber: "linear-gradient(90deg, #fbbf24, #d97706)",
    red: "linear-gradient(90deg, #ef4444, #dc2626)",
  };

  return (
    <div>
      {(label || showPercent) && (
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "8px",
            fontSize: "0.85rem",
          }}
        >
          {label && <span style={{ color: "#97a6c0", fontWeight: "600" }}>{label}</span>}
          {showPercent && <span style={{ color: "#3b82f6", fontWeight: "700" }}>{percent.toFixed(0)}%</span>}
        </div>
      )}

      <div
        style={{
          width: "100%",
          height: height,
          background: "rgba(255, 255, 255, 0.05)",
          borderRadius: "4px",
          overflow: "hidden",
          border: "1px solid rgba(255, 255, 255, 0.08)",
        }}
      >
        <div
          style={{
            height: "100%",
            width: `${percent}%`,
            background: colorMap[color],
            transition: "width 0.6s cubic-bezier(0.4, 0, 0.2, 1)",
            borderRadius: "4px",
            boxShadow: `0 0 20px ${color === "blue" ? "rgba(59, 130, 246, 0.5)" : "rgba(34, 197, 94, 0.5)"}`,
          }}
        />
      </div>
    </div>
  );
}

export default ProgressBar;
