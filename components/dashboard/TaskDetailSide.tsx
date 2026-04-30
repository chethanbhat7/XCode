"use client";

import React, { useState } from "react";
import { Task } from "@/lib/dashboard-types";
import { Badge } from "@/components/ui/badge-advanced";
import { X, MessageSquare, FileText, Clock, AlertCircle } from "lucide-react";

interface TaskDetailSideProps {
  task: Task;
  onClose: () => void;
}

export function TaskDetailSide({ task, onClose }: TaskDetailSideProps) {
  const [isOpen, setIsOpen] = useState(true);

  const handleClose = () => {
    setIsOpen(false);
    onClose();
  };

  const statusColors: Record<string, "info" | "warning" | "success" | "default"> = {
    todo: "default",
    "in-progress": "info",
    review: "warning",
    completed: "success",
  };

  const priorityVariant: Record<string, "info" | "warning" | "danger" | "default"> = {
    low: "default",
    medium: "info",
    high: "danger",
    critical: "danger",
  };

  const daysRemaining = Math.ceil(
    (new Date(task.dueDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
  );

  return (
    <>
      {isOpen && (
        <>
          {/* Overlay */}
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: "rgba(0, 0, 0, 0.5)",
              backdropFilter: "blur(4px)",
              zIndex: 998,
            }}
            onClick={handleClose}
          />

          {/* Side Panel */}
          <div
            style={{
              position: "fixed",
              right: 0,
              top: 0,
              bottom: 0,
              width: "100%",
              maxWidth: "450px",
              background: "linear-gradient(135deg, #071027 0%, #0a1530 100%)",
              borderLeft: "1px solid rgba(255, 255, 255, 0.06)",
              boxShadow: "-20px 0 60px rgba(0, 0, 0, 0.4)",
              zIndex: 999,
              display: "flex",
              flexDirection: "column",
              animation: "slideIn 0.3s ease",
            }}
          >
            {/* Header */}
            <div
              style={{
                padding: "24px",
                borderBottom: "1px solid rgba(255, 255, 255, 0.06)",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <h2
                style={{
                  fontSize: "1.25rem",
                  fontWeight: "700",
                  color: "#e5eefc",
                  margin: "0",
                }}
              >
                Task Details
              </h2>
              <button
                onClick={handleClose}
                style={{
                  background: "rgba(255, 255, 255, 0.1)",
                  border: "none",
                  borderRadius: "8px",
                  padding: "8px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#e5eefc",
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e: any) => {
                  (e.currentTarget as HTMLElement).style.background =
                    "rgba(255, 255, 255, 0.15)";
                }}
                onMouseLeave={(e: any) => {
                  (e.currentTarget as HTMLElement).style.background =
                    "rgba(255, 255, 255, 0.1)";
                }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Content */}
            <div
              style={{
                flex: 1,
                overflowY: "auto",
                padding: "24px",
              }}
            >
              {/* Title */}
              <h3
                style={{
                  fontSize: "1.375rem",
                  fontWeight: "700",
                  color: "#e5eefc",
                  margin: "0 0 16px 0",
                  lineHeight: "1.4",
                }}
              >
                {task.title}
              </h3>

              {/* Description */}
              <p
                style={{
                  fontSize: "0.95rem",
                  color: "#97a6c0",
                  margin: "0 0 24px 0",
                  lineHeight: "1.6",
                }}
              >
                {task.description}
              </p>

              {/* Status Badges */}
              <div
                style={{
                  display: "flex",
                  gap: "8px",
                  flexWrap: "wrap",
                  marginBottom: "24px",
                }}
              >
                <Badge
                  label={task.status}
                  variant={statusColors[task.status] as any}
                />
                <Badge
                  label={task.priority}
                  variant={priorityVariant[task.priority] as any}
                />
              </div>

              {/* Info Grid */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "16px",
                  marginBottom: "24px",
                }}
              >
                {/* Assignee */}
                <div
                  style={{
                    padding: "12px",
                    background: "rgba(255, 255, 255, 0.02)",
                    borderRadius: "8px",
                    border: "1px solid rgba(255, 255, 255, 0.06)",
                  }}
                >
                  <div
                    style={{
                      fontSize: "0.75rem",
                      color: "#97a6c0",
                      textTransform: "uppercase",
                      fontWeight: "600",
                      marginBottom: "4px",
                    }}
                  >
                    Assignee
                  </div>
                  <div
                    style={{
                      fontSize: "0.9rem",
                      color: "#e5eefc",
                      fontWeight: "600",
                    }}
                  >
                    {task.assignee.name}
                  </div>
                </div>

                {/* Due Date */}
                <div
                  style={{
                    padding: "12px",
                    background:
                      daysRemaining < 3
                        ? "rgba(239, 68, 68, 0.08)"
                        : "rgba(255, 255, 255, 0.02)",
                    borderRadius: "8px",
                    border:
                      daysRemaining < 3
                        ? "1px solid rgba(239, 68, 68, 0.2)"
                        : "1px solid rgba(255, 255, 255, 0.06)",
                  }}
                >
                  <div
                    style={{
                      fontSize: "0.75rem",
                      color: "#97a6c0",
                      textTransform: "uppercase",
                      fontWeight: "600",
                      marginBottom: "4px",
                    }}
                  >
                    Due Date
                  </div>
                  <div
                    style={{
                      fontSize: "0.9rem",
                      color: daysRemaining < 3 ? "#ff6b6b" : "#e5eefc",
                      fontWeight: "600",
                    }}
                  >
                    {new Date(task.dueDate).toLocaleDateString()}
                  </div>
                  {daysRemaining < 3 && (
                    <div
                      style={{
                        fontSize: "0.75rem",
                        color: "#ff6b6b",
                        marginTop: "4px",
                      }}
                    >
                      {daysRemaining}d remaining
                    </div>
                  )}
                </div>

                {/* Estimated Hours */}
                <div
                  style={{
                    padding: "12px",
                    background: "rgba(255, 255, 255, 0.02)",
                    borderRadius: "8px",
                    border: "1px solid rgba(255, 255, 255, 0.06)",
                  }}
                >
                  <div
                    style={{
                      fontSize: "0.75rem",
                      color: "#97a6c0",
                      textTransform: "uppercase",
                      fontWeight: "600",
                      marginBottom: "4px",
                    }}
                  >
                    Est. Hours
                  </div>
                  <div
                    style={{
                      fontSize: "0.9rem",
                      color: "#e5eefc",
                      fontWeight: "600",
                    }}
                  >
                    {task.estimatedHours}h
                  </div>
                </div>

                {/* Actual Hours */}
                <div
                  style={{
                    padding: "12px",
                    background: "rgba(255, 255, 255, 0.02)",
                    borderRadius: "8px",
                    border: "1px solid rgba(255, 255, 255, 0.06)",
                  }}
                >
                  <div
                    style={{
                      fontSize: "0.75rem",
                      color: "#97a6c0",
                      textTransform: "uppercase",
                      fontWeight: "600",
                      marginBottom: "4px",
                    }}
                  >
                    Actual Hours
                  </div>
                  <div
                    style={{
                      fontSize: "0.9rem",
                      color: "#e5eefc",
                      fontWeight: "600",
                    }}
                  >
                    {task.actualHours}h
                  </div>
                </div>
              </div>

              {/* Divider */}
              <div
                style={{
                  height: "1px",
                  background: "rgba(255, 255, 255, 0.06)",
                  margin: "24px 0",
                }}
              />

              {/* Action Buttons */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "12px",
                  marginBottom: "24px",
                }}
              >
                <button
                  style={{
                    padding: "10px",
                    background: "rgba(59, 130, 246, 0.1)",
                    border: "1px solid rgba(59, 130, 246, 0.2)",
                    borderRadius: "8px",
                    color: "#3b82f6",
                    fontWeight: "600",
                    fontSize: "0.85rem",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "6px",
                    transition: "all 0.2s",
                  }}
                  onMouseEnter={(e: any) => {
                    (e.currentTarget as HTMLElement).style.background =
                      "rgba(59, 130, 246, 0.2)";
                  }}
                  onMouseLeave={(e: any) => {
                    (e.currentTarget as HTMLElement).style.background =
                      "rgba(59, 130, 246, 0.1)";
                  }}
                >
                  <MessageSquare size={14} /> Comment
                </button>
                <button
                  style={{
                    padding: "10px",
                    background: "rgba(147, 51, 234, 0.1)",
                    border: "1px solid rgba(147, 51, 234, 0.2)",
                    borderRadius: "8px",
                    color: "#a855f7",
                    fontWeight: "600",
                    fontSize: "0.85rem",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "6px",
                    transition: "all 0.2s",
                  }}
                  onMouseEnter={(e: any) => {
                    (e.currentTarget as HTMLElement).style.background =
                      "rgba(147, 51, 234, 0.2)";
                  }}
                  onMouseLeave={(e: any) => {
                    (e.currentTarget as HTMLElement).style.background =
                      "rgba(147, 51, 234, 0.1)";
                  }}
                >
                  <FileText size={14} /> Attach
                </button>
              </div>

              {/* Progress Info */}
              <div
                style={{
                  padding: "12px",
                  background: "rgba(34, 197, 94, 0.08)",
                  borderRadius: "8px",
                  border: "1px solid rgba(34, 197, 94, 0.2)",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                <Clock size={16} color="#22c55e" />
                <div>
                  <div
                    style={{
                      fontSize: "0.85rem",
                      fontWeight: "600",
                      color: "#e5eefc",
                    }}
                  >
                    Progress
                  </div>
                  <div
                    style={{
                      fontSize: "0.75rem",
                      color: "#97a6c0",
                    }}
                  >
                    {task.actualHours} of {task.estimatedHours} hours used
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div
              style={{
                padding: "16px 24px",
                borderTop: "1px solid rgba(255, 255, 255, 0.06)",
                display: "flex",
                gap: "12px",
              }}
            >
              <button
                style={{
                  flex: 1,
                  padding: "10px",
                  background: "rgba(255, 255, 255, 0.1)",
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                  borderRadius: "8px",
                  color: "#e5eefc",
                  fontWeight: "600",
                  cursor: "pointer",
                  transition: "all 0.2s",
                }}
                onClick={handleClose}
              >
                Close
              </button>
              <button
                style={{
                  flex: 1,
                  padding: "10px",
                  background: "linear-gradient(135deg, #3b82f6, #1d4ed8)",
                  border: "none",
                  borderRadius: "8px",
                  color: "white",
                  fontWeight: "600",
                  cursor: "pointer",
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e: any) => {
                  (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)";
                  (e.currentTarget as HTMLElement).style.boxShadow =
                    "0 10px 20px rgba(59, 130, 246, 0.3)";
                }}
                onMouseLeave={(e: any) => {
                  (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
                  (e.currentTarget as HTMLElement).style.boxShadow = "none";
                }}
              >
                Update Status
              </button>
            </div>
          </div>
        </>
      )}

      <style>{`
        @keyframes slideIn {
          from {
            transform: translateX(100%);
          }
          to {
            transform: translateX(0);
          }
        }
      `}</style>
    </>
  );
}

export default TaskDetailSide;
