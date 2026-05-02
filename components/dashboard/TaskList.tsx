"use client";

import React, { useState } from "react";
import { GlassCard } from "@/components/ui/glass-card";
import { Badge } from "@/components/ui/badge-advanced";
import { Task } from "@/lib/dashboard-types";
import {
  CheckCircle2,
  Circle,
  AlertCircle,
  Clock,
  Flag,
  ChevronRight,
} from "lucide-react";
import { formatDate } from "@/lib/date-formatter";

interface TaskListProps {
  tasks: Task[];
  onTaskClick: (task: Task) => void;
  filter?: "all" | "todo" | "in-progress" | "review" | "completed";
  limit?: number;
}

export function TaskList({ tasks, onTaskClick, filter = "all", limit }: TaskListProps) {
  const filteredTasks = filter === "all" ? tasks : tasks.filter((t) => t.status === filter);
  const displayTasks = limit ? filteredTasks.slice(0, limit) : filteredTasks;

  const statusIcons: Record<string, React.ReactNode> = {
    todo: <Circle size={18} color="#94a3b8" />,
    "in-progress": <Clock size={18} color="#3b82f6" />,
    review: <AlertCircle size={18} color="#fbbf24" />,
    completed: <CheckCircle2 size={18} color="#22c55e" />,
  };

  const statusColors: Record<string, "info" | "warning" | "success" | "default"> = {
    todo: "default",
    "in-progress": "info",
    review: "warning",
    completed: "success",
  };

  const priorityIcons: Record<string, React.ReactNode> = {
    low: <Flag size={14} color="#94a3b8" />,
    medium: <Flag size={14} color="#fbbf24" />,
    high: <Flag size={14} color="#ff6b6b" />,
    critical: <Flag size={14} color="#dc2626" />,
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
      {displayTasks.length === 0 ? (
        <GlassCard>
          <div style={{ textAlign: "center", color: "#97a6c0", padding: "20px" }}>
            No tasks found in this category
          </div>
        </GlassCard>
      ) : (
        displayTasks.map((task) => (
          <div key={task.id}>
            <GlassCard
              interactive
              onClick={() => onTaskClick(task)}
              style={{ cursor: "pointer" }}
            >
              <div style={{ display: "flex", gap: "16px", alignItems: "flex-start" }}>
                <div style={{ marginTop: "4px", flexShrink: 0 }}>
                  {statusIcons[task.status]}
                </div>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "start",
                      gap: "12px",
                      marginBottom: "8px",
                    }}
                  >
                    <div>
                      <h4
                        style={{
                          fontSize: "1rem",
                          fontWeight: "700",
                          color: "#e5eefc",
                          margin: "0 0 4px 0",
                          wordBreak: "break-word",
                        }}
                      >
                        {task.title}
                      </h4>
                      <p
                        style={{
                          fontSize: "0.85rem",
                          color: "#97a6c0",
                          margin: "0",
                          wordBreak: "break-word",
                        }}
                      >
                        {task.description}
                      </p>
                    </div>
                    <ChevronRight
                      size={20}
                      color="#3b82f6"
                      style={{ flexShrink: 0, marginTop: "2px" }}
                    />
                  </div>

                  <div
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: "8px",
                      marginTop: "12px",
                    }}
                  >
                    <Badge label={task.status} variant={statusColors[task.status]} size="sm" />
                    <Badge
                      label={task.priority}
                      variant={
                        task.priority === "critical"
                          ? "danger"
                          : task.priority === "high"
                            ? "warning"
                            : task.priority === "medium"
                              ? "info"
                              : "default"
                      }
                      size="sm"
                      icon={priorityIcons[task.priority]}
                    />
                    <span
                      style={{
                        fontSize: "0.75rem",
                        color: "#97a6c0",
                        padding: "4px 0",
                      }}
                    >
                      Due: {formatDate(task.dueDate)}
                    </span>
                  </div>
                </div>
              </div>
            </GlassCard>
          </div>
        ))
      )}
    </div>
  );
}

export default TaskList;
