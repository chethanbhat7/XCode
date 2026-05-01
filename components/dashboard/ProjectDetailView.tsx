"use client";

import React, { useState } from "react";
import { GlassCard } from "@/components/ui/glass-card";
import { Badge } from "@/components/ui/badge-advanced";
import { ProgressBar } from "@/components/ui/progress-bar";
import { Project } from "@/lib/dashboard-types";
import { 
  GitBranch, 
  Users, 
  Calendar, 
  TrendingUp,
  CheckCircle2,
  AlertCircle,
  Zap,
  Clock
} from "lucide-react";
import TeamMemberDetail from "@/components/dashboard/TeamMemberDetail";

interface ProjectDetailViewProps {
  project: Project;
  onClose?: () => void;
}

export function ProjectDetailView({ project, onClose }: ProjectDetailViewProps) {
  const [selectedMemberId, setSelectedMemberId] = useState<string | null>(null);
  const selectedMember = project.teamMembers.find((m) => m.id === selectedMemberId) ?? null;
  const daysRemaining = Math.ceil(
    (new Date(project.dueDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
  );

  const completedTasks = project.tasks.filter((t) => t.status === "completed").length;
  const inProgressTasks = project.tasks.filter((t) => t.status === "in-progress").length;

  return (
    <div style={{ maxWidth: "900px" }}>
      {/* Header */}
      <div style={{ marginBottom: "32px" }}>
        <div style={{ marginBottom: "16px" }}>
          <Badge 
            label={project.status} 
            variant={project.status === "completed" ? "success" : project.status === "in-progress" ? "info" : "default"}
          />
        </div>
        <h1
          style={{
            fontSize: "2.2rem",
            fontWeight: "800",
            color: "#e5eefc",
            margin: "0 0 12px 0",
          }}
        >
          {project.name}
        </h1>
        <p style={{ fontSize: "1.05rem", color: "#97a6c0", margin: "0" }}>
          {project.description}
        </p>
      </div>

      {/* Phase Tracker: Planning -> Development -> Testing -> Feedback */}
      <div style={{ marginBottom: "20px" }}>
        {(() => {
          const phases = ["Planning", "Development", "Testing", "Feedback"];
          // Map project.status to phase index: planning -> 0, in-progress -> 1, review -> 2, completed -> 3
          const mapStatusToIndex: Record<string, number> = {
            planning: 0,
            "in-progress": 1,
            review: 2,
            completed: 3,
          };
          const activeIndex = mapStatusToIndex[project.status] ?? 0;

          return (
            <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
              {phases.map((label, i) => (
                <div key={label} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <div
                    style={{
                      width: "34px",
                      height: "34px",
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      background: i <= activeIndex ? "linear-gradient(135deg,#22c55e,#16a34a)" : "rgba(255,255,255,0.03)",
                      color: i <= activeIndex ? "white" : "#97a6c0",
                      fontWeight: 700,
                    }}
                  >
                    {i + 1}
                  </div>
                  <div style={{ fontSize: "0.9rem", color: i <= activeIndex ? "#e5eefc" : "#97a6c0" }}>{label}</div>
                  {i < phases.length - 1 && (
                    <div style={{ width: "36px", height: "2px", background: i < activeIndex ? "#22c55e" : "rgba(255,255,255,0.05)", marginLeft: "8px", marginRight: "8px" }} />
                  )}
                </div>
              ))}
            </div>
          );
        })()}
      </div>

      {/* Quick Stats */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          gap: "16px",
          marginBottom: "32px",
        }}
      >
        <GlassCard>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              marginBottom: "12px",
            }}
          >
            <div
              style={{
                fontSize: "1.5rem",
                background: "rgba(59, 130, 246, 0.2)",
                width: "40px",
                height: "40px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: "8px",
              }}
            >
              📅
            </div>
            <div>
              <div
                style={{
                  fontSize: "0.75rem",
                  color: "#97a6c0",
                  textTransform: "uppercase",
                  fontWeight: "600",
                }}
              >
                Timeline
              </div>
              <div
                style={{
                  fontSize: "0.95rem",
                  color: "#e5eefc",
                  fontWeight: "600",
                }}
              >
                {daysRemaining > 0 ? `${daysRemaining}d left` : "Overdue"}
              </div>
            </div>
          </div>
          <div style={{ fontSize: "0.75rem", color: "#97a6c0" }}>
            {new Date(project.startDate).toLocaleDateString()} -{" "}
            {new Date(project.dueDate).toLocaleDateString()}
          </div>
        </GlassCard>

        <GlassCard>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              marginBottom: "12px",
            }}
          >
            <div
              style={{
                fontSize: "1.5rem",
                background: "rgba(34, 197, 94, 0.2)",
                width: "40px",
                height: "40px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: "8px",
              }}
            >
              ✓
            </div>
            <div>
              <div
                style={{
                  fontSize: "0.75rem",
                  color: "#97a6c0",
                  textTransform: "uppercase",
                  fontWeight: "600",
                }}
              >
                Progress
              </div>
              <div
                style={{
                  fontSize: "0.95rem",
                  color: "#e5eefc",
                  fontWeight: "600",
                }}
              >
                {project.progress}%
              </div>
            </div>
          </div>
          <ProgressBar
            value={project.progress}
            max={100}
            showPercent={false}
            color="green"
            height="4px"
          />
        </GlassCard>

        <GlassCard>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              marginBottom: "12px",
            }}
          >
            <div
              style={{
                fontSize: "1.5rem",
                background: "rgba(147, 51, 234, 0.2)",
                width: "40px",
                height: "40px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: "8px",
              }}
            >
              👥
            </div>
            <div>
              <div
                style={{
                  fontSize: "0.75rem",
                  color: "#97a6c0",
                  textTransform: "uppercase",
                  fontWeight: "600",
                }}
              >
                Team Size
              </div>
              <div
                style={{
                  fontSize: "0.95rem",
                  color: "#e5eefc",
                  fontWeight: "600",
                }}
              >
                {project.teamMembers.length}
              </div>
            </div>
          </div>
          <div style={{ fontSize: "0.75rem", color: "#97a6c0" }}>
            Active members
          </div>
        </GlassCard>
      </div>

      {/* Main Content */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "2fr 1fr",
          gap: "24px",
        }}
      >
        {/* Left Column */}
        <div style={{ display: "grid", gap: "24px" }}>
          {/* Tasks Section */}
          <GlassCard>
            <h3
              style={{
                fontSize: "1.05rem",
                fontWeight: "700",
                color: "#e5eefc",
                margin: "0 0 16px 0",
              }}
            >
              Tasks
            </h3>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "12px",
                marginBottom: "16px",
              }}
            >
              <div
                style={{
                  padding: "12px",
                  background: "rgba(34, 197, 94, 0.1)",
                  borderRadius: "8px",
                  border: "1px solid rgba(34, 197, 94, 0.2)",
                }}
              >
                <div
                  style={{
                    fontSize: "0.8rem",
                    color: "#97a6c0",
                    marginBottom: "4px",
                  }}
                >
                  Completed
                </div>
                <div
                  style={{
                    fontSize: "1.5rem",
                    fontWeight: "700",
                    color: "#22c55e",
                  }}
                >
                  {completedTasks}/{project.tasks.length}
                </div>
              </div>
              <div
                style={{
                  padding: "12px",
                  background: "rgba(59, 130, 246, 0.1)",
                  borderRadius: "8px",
                  border: "1px solid rgba(59, 130, 246, 0.2)",
                }}
              >
                <div
                  style={{
                    fontSize: "0.8rem",
                    color: "#97a6c0",
                    marginBottom: "4px",
                  }}
                >
                  In Progress
                </div>
                <div
                  style={{
                    fontSize: "1.5rem",
                    fontWeight: "700",
                    color: "#3b82f6",
                  }}
                >
                  {inProgressTasks}
                </div>
              </div>
            </div>
            <div
              style={{
                display: "grid",
                gap: "8px",
                maxHeight: "400px",
                overflowY: "auto",
              }}
            >
              {project.tasks.map((task) => (
                <div
                  key={task.id}
                  style={{
                    padding: "12px",
                    background: "rgba(255, 255, 255, 0.02)",
                    borderRadius: "8px",
                    border: "1px solid rgba(255, 255, 255, 0.06)",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: "8px",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "0.9rem",
                        fontWeight: "600",
                        color: "#e5eefc",
                      }}
                    >
                      {task.title}
                    </span>
                    <Badge
                      label={task.status}
                      variant={
                        task.status === "completed"
                          ? "success"
                          : task.status === "in-progress"
                            ? "info"
                            : "default"
                      }
                      size="sm"
                    />
                  </div>
                  <div
                    style={{
                      fontSize: "0.75rem",
                      color: "#97a6c0",
                    }}
                  >
                    Assigned to {task.assignee.name}
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>

          {/* Repository Stats */}
          {project.repository && (
            <GlassCard>
              <h3
                style={{
                  fontSize: "1.05rem",
                  fontWeight: "700",
                  color: "#e5eefc",
                  margin: "0 0 16px 0",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                <GitBranch size={18} /> Repository
              </h3>
              <div
                style={{
                  padding: "12px",
                  background: "rgba(255, 255, 255, 0.02)",
                  borderRadius: "8px",
                  border: "1px solid rgba(255, 255, 255, 0.06)",
                  marginBottom: "12px",
                }}
              >
                <a
                  href={project.repository}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    color: "#3b82f6",
                    textDecoration: "none",
                    fontSize: "0.9rem",
                    fontWeight: "600",
                  }}
                >
                  {project.repository}
                </a>
              </div>
              {project.commits !== undefined && (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    padding: "12px",
                    background: "rgba(59, 130, 246, 0.1)",
                    borderRadius: "8px",
                    border: "1px solid rgba(59, 130, 246, 0.2)",
                  }}
                >
                  <div style={{ fontSize: "1.5rem" }}>📊</div>
                  <div>
                    <div
                      style={{
                        fontSize: "0.8rem",
                        color: "#97a6c0",
                      }}
                    >
                      Total Commits
                    </div>
                    <div
                      style={{
                        fontSize: "1.5rem",
                        fontWeight: "700",
                        color: "#3b82f6",
                      }}
                    >
                      {project.commits}
                    </div>
                  </div>
                </div>
              )}
            </GlassCard>
          )}
        </div>

        {/* Right Column */}
        <div>
          {/* Team Members + Detail Panel */}
          <GlassCard>
            <h3
              style={{
                fontSize: "1.05rem",
                fontWeight: "700",
                color: "#e5eefc",
                margin: "0 0 16px 0",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <Users size={18} /> Team Members
            </h3>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: "12px" }}>
              <div style={{ display: "grid", gap: "12px" }}>
                {project.teamMembers.map((member) => {
                  const isSelected = member.id === selectedMemberId;
                  return (
                    <div
                      key={member.id}
                      onClick={() => setSelectedMemberId(member.id === selectedMemberId ? null : member.id)}
                      style={{
                        padding: "12px",
                        background: isSelected ? "rgba(59,130,246,0.08)" : "rgba(255, 255, 255, 0.02)",
                        borderRadius: "8px",
                        border: isSelected ? "1px solid rgba(59,130,246,0.2)" : "1px solid rgba(255, 255, 255, 0.06)",
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                        cursor: "pointer",
                      }}
                    >
                      <div
                        style={{
                          width: "40px",
                          height: "40px",
                          borderRadius: "8px",
                          background: "linear-gradient(135deg, #3b82f6, #1d4ed8)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: "1rem",
                          fontWeight: "700",
                          flexShrink: 0,
                        }}
                      >
                        {member.avatar || member.name.charAt(0)}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div
                          style={{
                            fontSize: "0.9rem",
                            fontWeight: "600",
                            color: "#e5eefc",
                          }}
                        >
                          {member.name}
                        </div>
                        <div
                          style={{
                            fontSize: "0.75rem",
                            color: "#97a6c0",
                            wordBreak: "break-word",
                          }}
                        >
                          {member.role}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div>
                <TeamMemberDetail member={selectedMember} />
              </div>
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}

export default ProjectDetailView;
