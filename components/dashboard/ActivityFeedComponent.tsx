"use client";

import React from "react";
import { GlassCard } from "@/components/ui/glass-card";
import { TeamChat } from "@/lib/dashboard-types";
import { MessageSquare, Send } from "lucide-react";

interface ActivityFeedComponentProps {
  activities: TeamChat[];
  limit?: number;
}

export function ActivityFeedComponent({ activities, limit = 5 }: ActivityFeedComponentProps) {
  const displayActivities = activities.slice(0, limit);

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
          <MessageSquare size={18} /> Recent Activity
        </h3>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        {displayActivities.length === 0 ? (
          <div style={{ color: "#97a6c0", fontSize: "0.9rem", textAlign: "center", padding: "20px" }}>
            No recent activity
          </div>
        ) : (
          displayActivities.map((activity) => (
            <div
              key={activity.id}
              style={{
                padding: "12px",
                background: "rgba(255, 255, 255, 0.02)",
                borderRadius: "8px",
                border: "1px solid rgba(255, 255, 255, 0.06)",
                borderLeft: "3px solid #3b82f6",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "start",
                  marginBottom: "8px",
                }}
              >
                <div>
                  <div
                    style={{
                      fontSize: "0.9rem",
                      fontWeight: "700",
                      color: "#e5eefc",
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                    }}
                  >
                    <span>{activity.from.avatar || activity.from.name.charAt(0)}</span>
                    {activity.from.name}
                  </div>
                  <div
                    style={{
                      fontSize: "0.75rem",
                      color: "#97a6c0",
                    }}
                  >
                    {activity.channel}
                  </div>
                </div>
                <div
                  style={{
                    fontSize: "0.75rem",
                    color: "#97a6c0",
                  }}
                >
                  {new Date(activity.timestamp).toLocaleTimeString("en-US", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
              </div>
              <p
                style={{
                  fontSize: "0.85rem",
                  color: "#c5d5ec",
                  margin: "0",
                  lineHeight: "1.4",
                }}
              >
                {activity.message}
              </p>
            </div>
          ))
        )}
      </div>

      <button
        style={{
          width: "100%",
          marginTop: "16px",
          padding: "10px",
          background: "rgba(59, 130, 246, 0.1)",
          border: "1px solid rgba(59, 130, 246, 0.2)",
          color: "#3b82f6",
          borderRadius: "8px",
          fontSize: "0.85rem",
          fontWeight: "600",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "6px",
          transition: "all 0.2s",
        }}
        onMouseEnter={(e: any) => {
          const el = e.currentTarget as HTMLElement;
          el.style.background = "rgba(59, 130, 246, 0.2)";
        }}
        onMouseLeave={(e: any) => {
          const el = e.currentTarget as HTMLElement;
          el.style.background = "rgba(59, 130, 246, 0.1)";
        }}
      >
        <Send size={14} /> View All Activity
      </button>
    </GlassCard>
  );
}

export default ActivityFeedComponent;
