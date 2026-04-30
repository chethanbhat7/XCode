"use client";

import React from "react";

interface GlassCardProps {
  children?: React.ReactNode;
  interactive?: boolean;
  onClick?: () => void;
  className?: string;
  style?: Record<string, string | number | undefined>;
}

export function GlassCard({ children, interactive = false, onClick, className, style }: GlassCardProps) {
  const [isHovered, setIsHovered] = React.useState(false);

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        background: "rgba(255, 255, 255, 0.02)",
        border: "1px solid rgba(255, 255, 255, 0.06)",
        borderRadius: "16px",
        padding: "24px",
        backdropFilter: "blur(10px)",
        cursor: interactive ? "pointer" : "default",
        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        transform: interactive && isHovered ? "translateY(-4px) scale(1.01)" : "translateY(0) scale(1)",
        boxShadow:
          interactive && isHovered
            ? "0 20px 40px rgba(59, 130, 246, 0.1)"
            : "0 10px 20px rgba(0, 0, 0, 0.2)",
        ...style,
      }}
      className={className}
    >
      {children}
    </div>
  );
}

export default GlassCard;
