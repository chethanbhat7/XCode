"use client";

import React from "react";
import { GlassCard } from "@/components/ui/glass-card";
import { Badge } from "@/components/ui/badge-advanced";
import { RiskAlert } from "@/lib/dashboard-types";
import { AlertTriangle, AlertCircle, AlertOctagon, Clock } from "lucide-react";

interface RiskAlertsProps {
  alerts: RiskAlert[];
  limit?: number;
}

export function RiskAlerts({ alerts, limit = 4 }: RiskAlertsProps) {
  const displayAlerts = alerts.slice(0, limit);

  const severityIcons: Record<string, React.ReactNode> = {
    low: <Clock size={16} color="#94a3b8" />,
    medium: <AlertCircle size={16} color="#fbbf24" />,
    high: <AlertTriangle size={16} color="#ff6b6b" />,
    critical: <AlertOctagon size={16} color="#dc2626" />,
  };

  const severityVariant: Record<string, "info" | "warning" | "danger" | "default"> = {
    low: "default",
    medium: "warning",
    high: "danger",
    critical: "danger",
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
          <AlertOctagon size={18} color="#ef4444" /> Risk Alerts
        </h3>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        {displayAlerts.length === 0 ? (
          <div
            style={{
              color: "#22c55e",
              fontSize: "0.9rem",
              textAlign: "center",
              padding: "20px",
              fontWeight: "600",
            }}
          >
            All clear! No active risks.
          </div>
        ) : (
          displayAlerts.map((alert) => (
            <div
              key={alert.id}
              style={{
                padding: "12px",
                background:
                  alert.severity === "critical"
                    ? "rgba(239, 68, 68, 0.08)"
                    : "rgba(255, 255, 255, 0.02)",
                borderRadius: "8px",
                border:
                  alert.severity === "critical"
                    ? "1px solid rgba(239, 68, 68, 0.3)"
                    : "1px solid rgba(255, 255, 255, 0.06)",
                borderLeft:
                  alert.severity === "critical"
                    ? "3px solid #ef4444"
                    : alert.severity === "high"
                      ? "3px solid #ff6b6b"
                      : "3px solid #fbbf24",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "start",
                  gap: "8px",
                  marginBottom: "8px",
                }}
              >
                <div style={{ display: "flex", alignItems: "start", gap: "8px", flex: 1 }}>
                  <div style={{ marginTop: "2px", flexShrink: 0 }}>
                    {severityIcons[alert.severity]}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p
                      style={{
                        fontSize: "0.9rem",
                        fontWeight: "600",
                        color: "#e5eefc",
                        margin: "0 0 4px 0",
                        wordBreak: "break-word",
                      }}
                    >
                      {alert.message}
                    </p>
                    <div
                      style={{
                        fontSize: "0.75rem",
                        color: "#97a6c0",
                      }}
                    >
                      {new Date(alert.timestamp).toLocaleString()}
                    </div>
                  </div>
                </div>
                <Badge
                  label={alert.severity}
                  variant={severityVariant[alert.severity] as any}
                  size="sm"
                />
              </div>
            </div>
          ))
        )}
      </div>
    </GlassCard>
  );
}

export default RiskAlerts;
