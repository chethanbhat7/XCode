"use client";

import React, { useState } from "react";
import { GlassCard } from "@/components/ui/glass-card";
import { Badge } from "@/components/ui/badge-advanced";
import { TeamMember } from "@/lib/dashboard-types";
import { ProgressBar } from "@/components/ui/progress-bar";
import { Users, TrendingUp, Clock, Target, ChevronRight } from "lucide-react";

interface TeamGridProps {
  members: TeamMember[];
  onMemberClick: (member: TeamMember) => void;
  limit?: number;
}

export function TeamGrid({ members, onMemberClick, limit }: TeamGridProps) {
  const displayMembers = limit ? members.slice(0, limit) : members;

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
        gap: "16px",
      }}
    >
      {displayMembers.map((member) => (
        <div key={member.id}>
          <GlassCard
            interactive
            onClick={() => onMemberClick(member)}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "start",
                marginBottom: "16px",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <div
                  style={{
                    width: "48px",
                    height: "48px",
                    borderRadius: "12px",
                    background: "linear-gradient(135deg, #3b82f6, #1d4ed8)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "1.5rem",
                    fontWeight: "700",
                  }}
                >
                  {member.avatar || member.name.charAt(0)}
                </div>
                <div>
                  <h4
                    style={{
                      fontSize: "0.95rem",
                      fontWeight: "700",
                      color: "#e5eefc",
                      margin: "0 0 2px 0",
                    }}
                  >
                    {member.name}
                  </h4>
                  <p
                    style={{
                      fontSize: "0.75rem",
                      color: "#97a6c0",
                      margin: "0",
                    }}
                  >
                    {member.role}
                  </p>
                </div>
              </div>
              <ChevronRight size={18} color="#3b82f6" />
            </div>

            <div style={{ display: "grid", gap: "12px", marginBottom: "16px" }}>
              {/* Productivity */}
              <div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "6px",
                    fontSize: "0.8rem",
                  }}
                >
                  <span style={{ color: "#97a6c0", fontWeight: "600" }}>
                    Productivity
                  </span>
                  <span style={{ color: "#22c55e", fontWeight: "700" }}>
                    {member.departmentProductivity.toFixed(0)}%
                  </span>
                </div>
                <div
                  style={{
                    width: "100%",
                    height: "6px",
                    background: "rgba(255, 255, 255, 0.05)",
                    borderRadius: "3px",
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      height: "100%",
                      width: `${member.departmentProductivity}%`,
                      background: "linear-gradient(90deg, #22c55e, #16a34a)",
                    }}
                  />
                </div>
              </div>

              {/* Deadline Met */}
              <div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "6px",
                    fontSize: "0.8rem",
                  }}
                >
                  <span style={{ color: "#97a6c0", fontWeight: "600" }}>
                    Deadlines Met
                  </span>
                  <span
                    style={{
                      color:
                        member.deadline_met_percentage > 90
                          ? "#22c55e"
                          : "#fbbf24",
                      fontWeight: "700",
                    }}
                  >
                    {member.deadline_met_percentage.toFixed(0)}%
                  </span>
                </div>
                <div
                  style={{
                    width: "100%",
                    height: "6px",
                    background: "rgba(255, 255, 255, 0.05)",
                    borderRadius: "3px",
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      height: "100%",
                      width: `${member.deadline_met_percentage}%`,
                      background:
                        member.deadline_met_percentage > 90
                          ? "linear-gradient(90deg, #22c55e, #16a34a)"
                          : "linear-gradient(90deg, #fbbf24, #d97706)",
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Info Badges */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "8px",
                borderTop: "1px solid rgba(255, 255, 255, 0.06)",
                paddingTop: "12px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  fontSize: "0.8rem",
                  color: "#97a6c0",
                }}
              >
                <Target size={14} />
                <span>{member.active_projects} projects</span>
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  fontSize: "0.8rem",
                  color: "#97a6c0",
                }}
              >
                <Clock size={14} />
                <span>{member.pending_tasks} tasks</span>
              </div>
            </div>
          </GlassCard>
        </div>
      ))}
    </div>
  );
}

export default TeamGrid;
