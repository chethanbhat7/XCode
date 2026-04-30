"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { readSession } from "@/lib/session";
import { Header } from "@/components/Header";
import { StatCard } from "@/components/ui/stat-card";
import { TaskList } from "@/components/dashboard/TaskList";
import { ProjectCard } from "@/components/dashboard/ProjectCard";
import { CommitHeatmap } from "@/components/dashboard/CommitHeatmap";
import { AITokenTracker } from "@/components/dashboard/AITokenTracker";
import { ProductivityChart } from "@/components/dashboard/ProductivityChart";
import { ActivityFeedComponent } from "@/components/dashboard/ActivityFeedComponent";
import { TaskDetailSide } from "@/components/dashboard/TaskDetailSide";
import {
  mockTasks,
  mockProjects,
  mockCommitActivity,
  mockAIUsage,
  mockProductivityMetrics,
  mockTeamChat,
  mockDevelopers,
} from "@/lib/mock-data";
import { Task, Project } from "@/lib/dashboard-types";
import {
  CheckCircle2,
  Clock,
  Zap,
  GitBranch,
  TrendingUp,
  Code2,
  AlertCircle,
  Calendar,
} from "lucide-react";
import { useEffect } from "react";

export default function DeveloperDashboard() {
  const router = useRouter();
  const session = readSession();
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [taskFilter, setTaskFilter] = useState<"all" | "todo" | "in-progress" | "review" | "completed">("all");

  useEffect(() => {
    if (!session) {
      router.replace("/");
    }
  }, [router, session]);

  if (!session) return null;

  const inProgressTasks = mockTasks.filter((t) => t.status === "in-progress");
  const completedTasks = mockTasks.filter((t) => t.status === "completed");
  const dueSoonTasks = mockTasks.filter((t) => {
    const daysUntilDue =
      (new Date(t.dueDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24);
    return daysUntilDue > 0 && daysUntilDue <= 3;
  });

  const totalCommits = mockCommitActivity.reduce((sum, a) => sum + a.count, 0);
  const avgProductivity =
    mockProductivityMetrics.reduce((sum, m) => sum + m.taskCompleted, 0) /
    mockProductivityMetrics.length;

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(180deg, #071027 0%, #0a1530 40%, #071023 100%)",
        color: "#e5eefc",
      }}
    >
      <Header />

      <main style={{ padding: "40px 24px", maxWidth: "1600px", margin: "0 auto" }}>
        {/* Welcome Section */}
        <div style={{ marginBottom: "40px" }}>
          <h1
            style={{
              fontSize: "2.2rem",
              fontWeight: "800",
              margin: "0 0 8px 0",
              letterSpacing: "-0.02em",
            }}
          >
            Welcome back, {session.name}
          </h1>
          <p style={{ fontSize: "1rem", color: "#97a6c0", margin: "0" }}>
            Here's your development dashboard for today
          </p>
        </div>

        {/* Top Stats */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
            gap: "20px",
            marginBottom: "40px",
          }}
        >
          <StatCard
            label="Tasks In Progress"
            value={inProgressTasks.length}
            icon="📋"
            trend={{ value: 12, isPositive: true }}
            accent="blue"
            onClick={() => setTaskFilter("in-progress")}
          />
          <StatCard
            label="Completed This Week"
            value={completedTasks.length}
            icon="✅"
            trend={{ value: 8, isPositive: true }}
            accent="green"
          />
          <StatCard
            label="Total Commits"
            value={totalCommits}
            icon="🔗"
            trend={{ value: 15, isPositive: true }}
            accent="purple"
          />
          <StatCard
            label="AI Prompts Used"
            value={`${mockAIUsage.promptsUsed}/${mockAIUsage.promptsLimit}`}
            icon="⚡"
            trend={{ value: 5, isPositive: false }}
            accent="amber"
          />
        </div>

        {/* Main Content Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "24px",
            marginBottom: "40px",
          }}
        >
          {/* Tasks Section */}
          <div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "20px",
              }}
            >
              <h2
                style={{
                  fontSize: "1.25rem",
                  fontWeight: "700",
                  margin: "0",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                <Clock size={20} color="#3b82f6" /> My Tasks
              </h2>
              <div style={{ display: "flex", gap: "8px" }}>
                {["all", "todo", "in-progress", "review", "completed"].map((filter) => (
                  <button
                    key={filter}
                    onClick={() =>
                      setTaskFilter(
                        filter as "all" | "todo" | "in-progress" | "review" | "completed"
                      )
                    }
                    style={{
                      padding: "6px 12px",
                      borderRadius: "6px",
                      fontSize: "0.75rem",
                      fontWeight: "600",
                      border:
                        taskFilter === filter
                          ? "1px solid #3b82f6"
                          : "1px solid rgba(255, 255, 255, 0.1)",
                      background:
                        taskFilter === filter
                          ? "rgba(59, 130, 246, 0.15)"
                          : "rgba(255, 255, 255, 0.02)",
                      color: taskFilter === filter ? "#3b82f6" : "#97a6c0",
                      cursor: "pointer",
                      transition: "all 0.2s",
                      textTransform: "capitalize",
                    }}
                  >
                    {filter}
                  </button>
                ))}
              </div>
            </div>
            <TaskList
              tasks={mockTasks}
              filter={taskFilter}
              onTaskClick={setSelectedTask}
            />
          </div>

          {/* Projects Section */}
          <div>
            <h2
              style={{
                fontSize: "1.25rem",
                fontWeight: "700",
                margin: "0 0 20px 0",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <Code2 size={20} color="#22c55e" /> Assigned Projects
            </h2>
            <div style={{ display: "grid", gap: "16px" }}>
              {mockProjects.slice(0, 2).map((project) => (
                <div key={project.id}>
                  <ProjectCard
                    project={project}
                    onProjectClick={setSelectedProject}
                    developerView
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Analytics Row */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "24px",
            marginBottom: "40px",
          }}
        >
          <CommitHeatmap activity={mockCommitActivity} />
          <AITokenTracker usage={mockAIUsage} />
        </div>

        {/* Bottom Row */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "24px",
          }}
        >
          <ProductivityChart metrics={mockProductivityMetrics} />
          <ActivityFeedComponent activities={mockTeamChat} limit={5} />
        </div>
      </main>

      {/* Task Detail Sidebar */}
      {selectedTask && (
        <TaskDetailSide task={selectedTask} onClose={() => setSelectedTask(null)} />
      )}

      {/* Animations */}
      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        main > div {
          animation: fadeIn 0.5s ease;
        }
      `}</style>
    </div>
  );
}
