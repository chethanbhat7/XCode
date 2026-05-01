"use client";

import React, { useState } from "react";
import { GlassCard } from "@/components/ui/glass-card";
import { Badge } from "@/components/ui/badge-advanced";
import { Task } from "@/lib/dashboard-types";
import { CheckCircle2, Circle, AlertCircle, Zap } from "lucide-react";

interface ProjectTasksListProps {
  tasks: Task[];
  onTaskUpdate?: (taskId: string, updates: Partial<Task>) => void;
}

export default function ProjectTasksList({ tasks, onTaskUpdate }: ProjectTasksListProps) {
  const [filterStatus, setFilterStatus] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<"priority" | "dueDate" | "status">("priority");

  const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
  const statusOrder = { "in-progress": 0, review: 1, todo: 2, completed: 3 };

  let filtered = filterStatus ? tasks.filter((t) => t.status === filterStatus) : tasks;

  filtered = [...filtered].sort((a, b) => {
    if (sortBy === "priority") {
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    } else if (sortBy === "dueDate") {
      return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
    }
    return statusOrder[a.status] - statusOrder[b.status];
  });

  const stats = {
    total: tasks.length,
    completed: tasks.filter((t) => t.status === "completed").length,
    inProgress: tasks.filter((t) => t.status === "in-progress").length,
    todo: tasks.filter((t) => t.status === "todo").length,
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "critical":
        return "#ef4444";
      case "high":
        return "#f97316";
      case "medium":
        return "#eab308";
      case "low":
        return "#22c55e";
      default:
        return "#97a6c0";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle2 size={16} color="#22c55e" />;
      case "in-progress":
        return <Zap size={16} color="#3b82f6" />;
      case "review":
        return <AlertCircle size={16} color="#fbbf24" />;
      default:
        return <Circle size={16} color="#97a6c0" />;
    }
  };

  return (
    <GlassCard>
      {/* Header Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: "8px", marginBottom: "16px" }}>
        <div style={{ padding: "8px 12px", background: "rgba(255,255,255,0.03)", borderRadius: "6px" }}>
          <div style={{ fontSize: "0.7rem", color: "#97a6c0", marginBottom: "4px" }}>TOTAL</div>
          <div style={{ fontSize: "1.3rem", fontWeight: 700, color: "#e5eefc" }}>{stats.total}</div>
        </div>
        <div style={{ padding: "8px 12px", background: "rgba(59, 130, 246, 0.1)", borderRadius: "6px" }}>
          <div style={{ fontSize: "0.7rem", color: "#97a6c0", marginBottom: "4px" }}>IN PROGRESS</div>
          <div style={{ fontSize: "1.3rem", fontWeight: 700, color: "#3b82f6" }}>{stats.inProgress}</div>
        </div>
        <div style={{ padding: "8px 12px", background: "rgba(34, 197, 94, 0.1)", borderRadius: "6px" }}>
          <div style={{ fontSize: "0.7rem", color: "#97a6c0", marginBottom: "4px" }}>COMPLETED</div>
          <div style={{ fontSize: "1.3rem", fontWeight: 700, color: "#22c55e" }}>{stats.completed}</div>
        </div>
        <div style={{ padding: "8px 12px", background: "rgba(255,255,255,0.03)", borderRadius: "6px" }}>
          <div style={{ fontSize: "0.7rem", color: "#97a6c0", marginBottom: "4px" }}>TODO</div>
          <div style={{ fontSize: "1.3rem", fontWeight: 700, color: "#e5eefc" }}>{stats.todo}</div>
        </div>
      </div>

      {/* Filter & Sort */}
      <div style={{ display: "flex", gap: "8px", marginBottom: "12px", flexWrap: "wrap" }}>
        <select
          value={filterStatus || ""}
          onChange={(e: any) => setFilterStatus(e.target.value || null)}
          style={{
            padding: "6px 10px",
            background: "rgba(255, 255, 255, 0.05)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            borderRadius: "4px",
            color: "#e5eefc",
            fontSize: "0.8rem",
            outline: "none",
          }}
        >
          <option value="">All Status</option>
          <option value="todo">To Do</option>
          <option value="in-progress">In Progress</option>
          <option value="review">Review</option>
          <option value="completed">Completed</option>
        </select>

        <select
          value={sortBy}
          onChange={(e: any) => setSortBy(e.target.value as any)}
          style={{
            padding: "6px 10px",
            background: "rgba(255, 255, 255, 0.05)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            borderRadius: "4px",
            color: "#e5eefc",
            fontSize: "0.8rem",
            outline: "none",
          }}
        >
          <option value="priority">Sort by Priority</option>
          <option value="dueDate">Sort by Due Date</option>
          <option value="status">Sort by Status</option>
        </select>
      </div>

      {/* Tasks List */}
      <div style={{ display: "grid", gap: "10px", maxHeight: "500px", overflowY: "auto", paddingRight: "4px" }}>
        {filtered.map((task) => (
          <div
            key={task.id}
            style={{
              padding: "12px",
              background: "rgba(255, 255, 255, 0.02)",
              borderRadius: "8px",
              border: "1px solid rgba(255, 255, 255, 0.06)",
              transition: "all 0.2s",
            }}
            onMouseEnter={(e: any) => {
              e.currentTarget.style.background = "rgba(255, 255, 255, 0.05)";
              e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.12)";
            }}
            onMouseLeave={(e: any) => {
              e.currentTarget.style.background = "rgba(255, 255, 255, 0.02)";
              e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.06)";
            }}
          >
            <div style={{ display: "flex", gap: "10px", alignItems: "flex-start", marginBottom: "8px" }}>
              <div style={{ marginTop: "2px" }}>{getStatusIcon(task.status)}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    fontSize: "0.95rem",
                    fontWeight: "600",
                    color: "#e5eefc",
                    marginBottom: "4px",
                    wordBreak: "break-word",
                  }}
                >
                  {task.title}
                </div>
                <div
                  style={{
                    fontSize: "0.8rem",
                    color: "#97a6c0",
                    marginBottom: "8px",
                    wordBreak: "break-word",
                  }}
                >
                  {task.description}
                </div>
              </div>
            </div>

            {/* Task Meta */}
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", alignItems: "center" }}>
              <Badge
                label={task.status}
                variant={
                  task.status === "completed"
                    ? "success"
                    : task.status === "in-progress"
                      ? "info"
                      : task.status === "review"
                        ? "warning"
                        : "default"
                }
                size="sm"
              />

              <div
                style={{
                  padding: "2px 8px",
                  borderRadius: "4px",
                  fontSize: "0.75rem",
                  fontWeight: "600",
                  color: getPriorityColor(task.priority),
                  background: `${getPriorityColor(task.priority)}20`,
                }}
              >
                {task.priority.toUpperCase()}
              </div>

              <div style={{ fontSize: "0.75rem", color: "#97a6c0" }}>
                Due: {new Date(task.dueDate).toLocaleDateString()}
              </div>

              <div style={{ fontSize: "0.75rem", color: "#97a6c0" }}>{task.assignee.name}</div>

              <div
                style={{
                  marginLeft: "auto",
                  fontSize: "0.75rem",
                  color: "#97a6c0",
                  textAlign: "right",
                }}
              >
                <div>{task.actualHours}h actual / {task.estimatedHours}h est</div>
              </div>
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div style={{ textAlign: "center", color: "#97a6c0", padding: "24px 12px" }}>
            No tasks found
          </div>
        )}
      </div>
    </GlassCard>
  );
}
