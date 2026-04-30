"use client";

import React from "react";

interface BadgeProps {
  label: string;
  variant?: "success" | "warning" | "danger" | "info" | "default";
  size?: "sm" | "md";
  icon?: React.ReactNode;
  style?: Record<string, string | number | undefined>;
}

export function Badge({ label, variant = "default", size = "md", icon, style }: BadgeProps) {
  const variantStyles: Record<string, { bg: string; text: string }> = {
    success: { bg: "rgba(34, 197, 94, 0.15)", text: "#22c55e" },
    warning: { bg: "rgba(245, 158, 11, 0.15)", text: "#fbbf24" },
    danger: { bg: "rgba(239, 68, 68, 0.15)", text: "#ff6b6b" },
    info: { bg: "rgba(59, 130, 246, 0.15)", text: "#3b82f6" },
    default: { bg: "rgba(148, 163, 184, 0.15)", text: "#94a3b8" },
  };

  const badgeStyle = variantStyles[variant];
  const fontSize = size === "sm" ? "0.75rem" : "0.85rem";
  const padding = size === "sm" ? "4px 8px" : "6px 12px";

  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "6px",
        background: badgeStyle.bg,
        color: badgeStyle.text,
        padding: padding,
        borderRadius: "6px",
        fontSize: fontSize,
        fontWeight: "600",
        textTransform: "capitalize",
        whiteSpace: "nowrap",
        ...style,
      }}
    >
      {icon}
      {label}
    </div>
  );
}

export default Badge;
