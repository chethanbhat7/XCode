"use client";

import React from "react";

interface StatCardProps {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  accent?: "blue" | "green" | "purple" | "amber";
  onClick?: () => void;
}

export function StatCard({ label, value, icon, trend, accent = "blue", onClick }: StatCardProps) {
  const accentColors: Record<string, { bg: string; border: string; text: string }> = {
    blue: { bg: "rgba(59, 130, 246, 0.1)", border: "rgba(59, 130, 246, 0.2)", text: "text-blue-400" },
    green: { bg: "rgba(34, 197, 94, 0.1)", border: "rgba(34, 197, 94, 0.2)", text: "text-green-400" },
    purple: { bg: "rgba(147, 51, 234, 0.1)", border: "rgba(147, 51, 234, 0.2)", text: "text-purple-400" },
    amber: { bg: "rgba(245, 158, 11, 0.1)", border: "rgba(245, 158, 11, 0.2)", text: "text-amber-400" },
  };

  const colors = accentColors[accent];

  return (
    <div
      onClick={onClick}
      style={{
        background: colors.bg,
        border: `1px solid ${colors.border}`,
        borderRadius: "16px",
        padding: "24px",
        backdropFilter: "blur(10px)",
        cursor: onClick ? "pointer" : "default",
        transition: "all 0.3s ease",
        transform: onClick ? "translateY(0px)" : undefined,
      }}
      onMouseEnter={(e: any) => {
        if (onClick) {
          const el = e.currentTarget as HTMLElement;
          el.style.transform = "translateY(-4px)";
          el.style.boxShadow = `0 20px 40px ${colors.bg}`;
        }
      }}
      onMouseLeave={(e: any) => {
        if (onClick) {
          const el = e.currentTarget as HTMLElement;
          el.style.transform = "translateY(0px)";
          el.style.boxShadow = "none";
        }
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px" }}>
        <div style={{ fontSize: "1.5rem" }}>{icon}</div>
        {trend && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "4px",
              fontSize: "0.85rem",
              color: trend.isPositive ? "#22c55e" : "#ef4444",
              fontWeight: "600",
            }}
          >
            {trend.isPositive ? "↑" : "↓"} {trend.value}%
          </div>
        )}
      </div>

      <div style={{ marginBottom: "8px" }}>
        <div
          style={{
            fontSize: "0.85rem",
            color: "#97a6c0",
            fontWeight: "600",
            textTransform: "uppercase",
            letterSpacing: "0.05em",
            marginBottom: "4px",
          }}
        >
          {label}
        </div>
        <div
          style={{
            fontSize: "1.75rem",
            fontWeight: "700",
            color: "#e5eefc",
            letterSpacing: "-0.01em",
          }}
        >
          {value}
        </div>
      </div>
    </div>
  );
}

export default StatCard;
