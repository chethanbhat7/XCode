"use client";

import React, { useState } from "react";
import { GlassCard } from "@/components/ui/glass-card";
import { Badge } from "@/components/ui/badge-advanced";
import { ProgressBar } from "@/components/ui/progress-bar";
import { Project, Task } from "@/lib/dashboard-types";
import { 
  GitBranch, 
  Users, 
  Calendar, 
  TrendingUp,
  CheckCircle2,
  AlertCircle,
  Zap,
  Clock,
  Plus,
  BarChart3
} from "lucide-react";
import TeamMemberDetail from "@/components/dashboard/TeamMemberDetail";
import ProjectTasksList from "@/components/dashboard/ProjectTasksList";
import ProjectChatbot from "@/components/dashboard/ProjectChatbot";
import AddTaskForm from "@/components/dashboard/AddTaskForm";
import AnalyticsDashboard from "@/components/dashboard/AnalyticsDashboard";
import { getBestCandidate } from "@/lib/task-allocation";
import { formatDate } from "@/lib/date-formatter";

interface ProjectDetailViewProps {
  project: Project;
  onClose?: () => void;
}

export function ProjectDetailView({ project, onClose }: ProjectDetailViewProps) {
  const [selectedMemberId, setSelectedMemberId] = useState<string | null>(null);
  const [tasks, setTasks] = useState(project.tasks);
  const [showAddTaskForm, setShowAddTaskForm] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const selectedMember = project.teamMembers.find((m) => m.id === selectedMemberId) ?? null;

  const handleTaskCreate = async (newTask: Partial<Task>) => {
    // Use ML-based allocation to assign task to best candidate
    const bestCandidate = getBestCandidate(newTask as Task, project.teamMembers, tasks);
    
    const task: Task = {
      id: `task-${Date.now()}`,
      title: newTask.title || "New Task",
      description: newTask.description || "",
      status: (newTask.status as any) || "todo",
      priority: (newTask.priority as any) || "medium",
      dueDate: newTask.dueDate || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      assignee: bestCandidate || project.teamMembers[0],
      projectId: project.id,
      estimatedHours: newTask.estimatedHours || 8,
      actualHours: 0,
    };

    try {
      // Persist the task to MongoDB
      const res = await fetch(`/api/projects/${project.id}/tasks`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(task),
      });

      if (res.ok) {
        setTasks((prev) => [...prev, task]);
      } else {
        console.error("Failed to persist task.");
      }
    } catch (err) {
      console.error("Error creating task:", err);
    }
  };
  const daysRemaining = Math.ceil(
    (new Date(project.dueDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
  );

  const completedTasks = project.tasks.filter((t) => t.status === "completed").length;
  const inProgressTasks = project.tasks.filter((t) => t.status === "in-progress").length;

  return (
    <div style={{ width: "100%", padding: "40px 32px", background: "linear-gradient(180deg, #0a1420 0%, #0f1823 50%, #0a1420 100%)" }}>
      {/* Header */}
      <div style={{ marginBottom: "48px" }}>
        <div style={{ marginBottom: "24px", display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "24px" }}>
          <div style={{ flex: 1 }}>
            <Badge 
              label={project.status} 
              variant={project.status === "completed" ? "success" : project.status === "in-progress" ? "info" : "default"}
            />
            <h1
              style={{
                fontSize: "2.8rem",
                fontWeight: "900",
                color: "#e5eefc",
                margin: "16px 0 12px 0",
                letterSpacing: "-0.02em",
                lineHeight: "1.2",
              }}
            >
              {project.name}
            </h1>
            <p style={{ fontSize: "1.1rem", color: "#97a6c0", margin: "0", lineHeight: "1.5", maxWidth: "600px" }}>
              {project.description}
            </p>
          </div>
          <div style={{ display: "flex", gap: "12px", flexShrink: 0 }}>
            <button
              onClick={() => setShowAddTaskForm(true)}
              style={{
                padding: "10px 20px",
                background: "linear-gradient(135deg, #22c55e, #16a34a)",
                border: "none",
                borderRadius: "8px",
                color: "#fff",
                fontWeight: "700",
                cursor: "pointer",
                fontSize: "0.9rem",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                boxShadow: "0 4px 12px rgba(34, 197, 94, 0.3)",
              }}
              onMouseEnter={(e: any) => {
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow = "0 8px 20px rgba(34, 197, 94, 0.4)";
              }}
              onMouseLeave={(e: any) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 4px 12px rgba(34, 197, 94, 0.3)";
              }}
            >
              <Plus size={18} /> Add Task
            </button>
            <button
              onClick={() => setShowAnalytics(!showAnalytics)}
              style={{
                padding: "10px 20px",
                background: showAnalytics ? "linear-gradient(135deg, #3b82f6, #1d4ed8)" : "rgba(255, 255, 255, 0.08)",
                border: "1px solid " + (showAnalytics ? "rgba(59, 130, 246, 0.3)" : "rgba(255, 255, 255, 0.15)"),
                borderRadius: "8px",
                color: "#e5eefc",
                fontWeight: "700",
                cursor: "pointer",
                fontSize: "0.9rem",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
              }}
              onMouseEnter={(e: any) => {
                if (!showAnalytics) {
                  e.currentTarget.style.background = "rgba(255, 255, 255, 0.12)";
                  e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.25)";
                }
                e.currentTarget.style.transform = "translateY(-2px)";
              }}
              onMouseLeave={(e: any) => {
                if (!showAnalytics) {
                  e.currentTarget.style.background = "rgba(255, 255, 255, 0.08)";
                  e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.15)";
                }
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              <BarChart3 size={18} /> Analytics
            </button>
          </div>
        </div>
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
            {formatDate(project.startDate)} - {formatDate(project.dueDate)}
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

      {/* Analytics Dashboard - Conditional */}
      {showAnalytics && (
        <div style={{ marginBottom: "32px" }}>
          <AnalyticsDashboard project={{ ...project, tasks }} />
        </div>
      )}

      {/* Main Content: 3-Column Layout */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 360px",
          gap: "24px",
        }}
      >
        {/* Left Column: Tasks List */}
        <ProjectTasksList tasks={tasks} />

        {/* Middle Column: Team & Repository */}
        <div style={{ display: "grid", gap: "24px" }}>
          {/* Team Members */}
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
            <div style={{ display: "grid", gridTemplateColumns: "1fr 140px", gap: "12px" }}>
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

        {/* Right Column: Chatbot */}
        <ProjectChatbot project={{ ...project, tasks }} onTaskCreate={handleTaskCreate} />
      </div>

      {/* Add Task Form Modal */}
      {showAddTaskForm && (
        <AddTaskForm 
          onClose={() => setShowAddTaskForm(false)}
          onSubmit={handleTaskCreate}
          teamMembers={project.teamMembers}
        />
      )}
    </div>
  );
}

export default ProjectDetailView;
