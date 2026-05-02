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
  progress?: number;
  subtitle?: string;
  accent?: "blue" | "green" | "purple" | "amber";
  onClick?: () => void;
}

export function StatCard({ label, value, icon, trend, progress, subtitle, accent = "blue", onClick }: StatCardProps) {
  const accentColors: Record<string, { bg: string; border: string; bar: string }> = {
    blue: { bg: "rgba(59, 130, 246, 0.08)", border: "rgba(59, 130, 246, 0.15)", bar: "#3b82f6" },
    green: { bg: "rgba(34, 197, 94, 0.08)", border: "rgba(34, 197, 94, 0.15)", bar: "#22c55e" },
    purple: { bg: "rgba(147, 51, 234, 0.08)", border: "rgba(147, 51, 234, 0.15)", bar: "#9333ea" },
    amber: { bg: "rgba(245, 158, 11, 0.08)", border: "rgba(245, 158, 11, 0.15)", bar: "#f59e0b" },
  };

  const colors = accentColors[accent];

  return (
    <div
      onClick={onClick}
      style={{
        background: `linear-gradient(145deg, ${colors.bg}, rgba(255,255,255,0.01))`,
        border: `1px solid ${colors.border}`,
        borderRadius: "18px",
        padding: "24px",
        backdropFilter: "blur(12px)",
        cursor: onClick ? "pointer" : "default",
        transition: "all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
        position: "relative",
        overflow: "hidden",
      }}
      onMouseEnter={(e: any) => {
        if (onClick) {
          const el = e.currentTarget as HTMLElement;
          el.style.transform = "translateY(-6px)";
          el.style.boxShadow = `0 24px 48px -12px ${colors.bar}33`;
          el.style.borderColor = colors.bar + "66";
        }
      }}
      onMouseLeave={(e: any) => {
        if (onClick) {
          const el = e.currentTarget as HTMLElement;
          el.style.transform = "translateY(0px)";
          el.style.boxShadow = "none";
          el.style.borderColor = colors.border;
        }
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "16px" }}>
        <div style={{ 
          fontSize: "1.6rem", 
          width: "44px", 
          height: "44px", 
          display: "flex", 
          alignItems: "center", 
          justifyContent: "center",
          background: "rgba(255,255,255,0.03)",
          borderRadius: "12px",
          border: "1px solid rgba(255,255,255,0.05)"
        }}>
          {icon}
        </div>
        {trend && (
          <div
            style={{
              padding: "4px 8px",
              borderRadius: "8px",
              background: trend.isPositive ? "rgba(34, 197, 94, 0.1)" : "rgba(239, 68, 68, 0.1)",
              display: "flex",
              alignItems: "center",
              gap: "4px",
              fontSize: "0.8rem",
              color: trend.isPositive ? "#4ade80" : "#f87171",
              fontWeight: "700",
            }}
          >
            {trend.isPositive ? "↑" : "↓"} {trend.value}%
          </div>
        )}
      </div>

      <div style={{ marginBottom: progress !== undefined ? "16px" : "0" }}>
        <div
          style={{
            fontSize: "0.8rem",
            color: "#97a6c0",
            fontWeight: "700",
            textTransform: "uppercase",
            letterSpacing: "0.06em",
            marginBottom: "6px",
            opacity: 0.8
          }}
        >
          {label}
        </div>
        <div
          style={{
            fontSize: "2rem",
            fontWeight: "800",
            color: "#fff",
            letterSpacing: "-0.02em",
            marginBottom: subtitle ? "4px" : "0"
          }}
        >
          {value}
        </div>
        {subtitle && (
          <div style={{ fontSize: "0.8rem", color: "#60a5fa", fontWeight: "500" }}>
            {subtitle}
          </div>
        )}
      </div>

      {progress !== undefined && (
        <div style={{ width: "100%", height: "6px", background: "rgba(255,255,255,0.05)", borderRadius: "3px", overflow: "hidden" }}>
          <div 
            style={{ 
              width: `${progress}%`, 
              height: "100%", 
              background: colors.bar, 
              borderRadius: "3px",
              transition: "width 1s ease-out" 
            }} 
          />
        </div>
      )}
    </div>
  );
}

export default StatCard;
