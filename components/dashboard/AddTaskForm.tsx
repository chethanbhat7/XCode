"use client";

import { useState } from "react";
import { GlassCard } from "@/components/ui/glass-card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { X } from "lucide-react";
import { TeamMember } from "@/lib/dashboard-types";

interface AddTaskFormProps {
  onClose: () => void;
  onSubmit: (task: any) => void;
  teamMembers: TeamMember[];
}

export default function AddTaskForm({ onClose, onSubmit, teamMembers }: AddTaskFormProps) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    status: "todo",
    priority: "medium",
    dueDate: "",
    assigneeId: teamMembers[0]?.id || "",
    estimatedHours: "8",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.title.trim()) newErrors.title = "Task title required";
    if (!formData.description.trim()) newErrors.description = "Description required";
    if (!formData.dueDate) newErrors.dueDate = "Due date required";
    if (!formData.assigneeId) newErrors.assigneeId = "Assignee required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const assignee = teamMembers.find((m) => m.id === formData.assigneeId);
    const newTask = {
      id: `task-${Date.now()}`,
      title: formData.title,
      description: formData.description,
      status: formData.status as any,
      priority: formData.priority as any,
      dueDate: formData.dueDate,
      assignee: assignee!,
      estimatedHours: parseInt(formData.estimatedHours),
      actualHours: 0,
      projectId: "",
    };

    onSubmit(newTask);
    setFormData({
      title: "",
      description: "",
      status: "todo",
      priority: "medium",
      dueDate: "",
      assigneeId: teamMembers[0]?.id || "",
      estimatedHours: "8",
    });
    onClose();
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0, 0, 0, 0.6)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
      }}
      onClick={onClose}
    >
      <div
        style={{
          maxWidth: "500px",
          width: "90%",
        }}
        onClick={(e: any) => e.stopPropagation()}
      >
        <GlassCard
          style={{
            padding: "32px",
            maxHeight: "90vh",
            overflowY: "auto",
          }}
        >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "24px",
          }}
        >
          <h2
            style={{
              fontSize: "1.5rem",
              fontWeight: "700",
              color: "#e5eefc",
              margin: 0,
            }}
          >
            Add New Task
          </h2>
          <button
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              color: "#97a6c0",
              cursor: "pointer",
              fontSize: "1.5rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: "grid", gap: "16px" }}>
          {/* Title */}
          <div>
            <label
              style={{
                display: "block",
                fontSize: "0.85rem",
                fontWeight: "600",
                color: "#97a6c0",
                marginBottom: "6px",
              }}
            >
              Task Title
            </label>
            <Input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g., Fix login bug"
              style={{ width: "100%" }}
            />
            {errors.title && (
              <span style={{ fontSize: "0.75rem", color: "#ef4444" }}>{errors.title}</span>
            )}
          </div>

          {/* Description */}
          <div>
            <label
              style={{
                display: "block",
                fontSize: "0.85rem",
                fontWeight: "600",
                color: "#97a6c0",
                marginBottom: "6px",
              }}
            >
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe the task..."
              style={{
                width: "100%",
                minHeight: "80px",
                padding: "10px 12px",
                background: "rgba(255, 255, 255, 0.05)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                borderRadius: "6px",
                color: "#e5eefc",
                fontFamily: "inherit",
                fontSize: "0.9rem",
              }}
            />
            {errors.description && (
              <span style={{ fontSize: "0.75rem", color: "#ef4444" }}>{errors.description}</span>
            )}
          </div>

          {/* Grid: Status & Priority */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
            <div>
              <label
                style={{
                  display: "block",
                  fontSize: "0.85rem",
                  fontWeight: "600",
                  color: "#97a6c0",
                  marginBottom: "6px",
                }}
              >
                Status
              </label>
              <Select
                name="status"
                value={formData.status}
                onChange={handleChange}
                options={[
                  { value: "todo", label: "To Do" },
                  { value: "in-progress", label: "In Progress" },
                  { value: "review", label: "Review" },
                  { value: "completed", label: "Completed" },
                ]}
              />
            </div>
            <div>
              <label
                style={{
                  display: "block",
                  fontSize: "0.85rem",
                  fontWeight: "600",
                  color: "#97a6c0",
                  marginBottom: "6px",
                }}
              >
                Priority
              </label>
              <Select
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                options={[
                  { value: "low", label: "Low" },
                  { value: "medium", label: "Medium" },
                  { value: "high", label: "High" },
                  { value: "critical", label: "Critical" },
                ]}
              />
            </div>
          </div>

          {/* Due Date */}
          <div>
            <label
              style={{
                display: "block",
                fontSize: "0.85rem",
                fontWeight: "600",
                color: "#97a6c0",
                marginBottom: "6px",
              }}
            >
              Due Date
            </label>
            <Input
              type="date"
              name="dueDate"
              value={formData.dueDate}
              onChange={handleChange}
              style={{ width: "100%" }}
            />
            {errors.dueDate && (
              <span style={{ fontSize: "0.75rem", color: "#ef4444" }}>{errors.dueDate}</span>
            )}
          </div>

          {/* Assignee */}
          <div>
            <label
              style={{
                display: "block",
                fontSize: "0.85rem",
                fontWeight: "600",
                color: "#97a6c0",
                marginBottom: "6px",
              }}
            >
              Assign To
            </label>
            <select
              name="assigneeId"
              value={formData.assigneeId}
              onChange={handleChange}
              style={{
                width: "100%",
                padding: "10px 12px",
                background: "rgba(255, 255, 255, 0.05)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                borderRadius: "6px",
                color: "#e5eefc",
                fontSize: "0.9rem",
              }}
            >
              {teamMembers.map((member) => (
                <option key={member.id} value={member.id}>
                  {member.name}
                </option>
              ))}
            </select>
            {errors.assigneeId && (
              <span style={{ fontSize: "0.75rem", color: "#ef4444" }}>{errors.assigneeId}</span>
            )}
          </div>

          {/* Estimated Hours */}
          <div>
            <label
              style={{
                display: "block",
                fontSize: "0.85rem",
                fontWeight: "600",
                color: "#97a6c0",
                marginBottom: "6px",
              }}
            >
              Estimated Hours
            </label>
            <Input
              type="number"
              name="estimatedHours"
              value={formData.estimatedHours}
              onChange={handleChange}
              min="1"
              max="100"
              style={{ width: "100%" }}
            />
          </div>

          {/* Buttons */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "12px",
              marginTop: "24px",
            }}
          >
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: "10px 16px",
                background: "transparent",
                border: "1px solid rgba(255, 255, 255, 0.2)",
                borderRadius: "6px",
                color: "#e5eefc",
                fontWeight: "600",
                cursor: "pointer",
                fontSize: "0.9rem",
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              style={{
                padding: "10px 16px",
                background: "linear-gradient(135deg, #22c55e, #16a34a)",
                border: "none",
                borderRadius: "6px",
                color: "#fff",
                fontWeight: "600",
                cursor: "pointer",
                fontSize: "0.9rem",
              }}
            >
              Add Task
            </button>
          </div>
        </form>
        </GlassCard>
      </div>
    </div>
  );
}
