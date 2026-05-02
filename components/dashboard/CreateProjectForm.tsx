"use client";

import { useState } from "react";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { X } from "lucide-react";

interface CreateProjectFormProps {
  onClose: () => void;
  onSubmit: (project: any) => void;
}

export default function CreateProjectForm({ onClose, onSubmit }: CreateProjectFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    status: "planning",
    startDate: "",
    dueDate: "",
    repository: "",
    teamSize: "3",
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
    if (!formData.name.trim()) newErrors.name = "Project name required";
    if (!formData.description.trim()) newErrors.description = "Description required";
    if (!formData.startDate) newErrors.startDate = "Start date required";
    if (!formData.dueDate) newErrors.dueDate = "Due date required";
    if (new Date(formData.startDate) >= new Date(formData.dueDate)) {
      newErrors.dueDate = "Due date must be after start date";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const newProject = {
      id: `proj-${Date.now()}`,
      name: formData.name,
      description: formData.description,
      status: formData.status,
      startDate: formData.startDate,
      dueDate: formData.dueDate,
      repository: formData.repository || "https://github.com/company/project",
      progress: 0,
      tasks: [],
      commits: 0,
      teamMembers: [],
      aiContribution: 0,
    };

    onSubmit(newProject);
    setFormData({
      name: "",
      description: "",
      status: "planning",
      startDate: "",
      dueDate: "",
      repository: "",
      teamSize: "3",
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
            Create New Project
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
          {/* Project Name */}
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
              Project Name
            </label>
            <Input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g., Mobile App v2.0"
              style={{ width: "100%" }}
            />
            {errors.name && (
              <span style={{ fontSize: "0.75rem", color: "#ef4444" }}>{errors.name}</span>
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
              placeholder="Describe the project..."
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

          {/* Status */}
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
                { value: "planning", label: "Planning" },
                { value: "in-progress", label: "In Progress" },
                { value: "review", label: "Review" },
                { value: "completed", label: "Completed" },
              ]}
            />
          </div>

          {/* Start Date */}
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
              Start Date
            </label>
            <Input
              type="date"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
              style={{ width: "100%" }}
            />
            {errors.startDate && (
              <span style={{ fontSize: "0.75rem", color: "#ef4444" }}>{errors.startDate}</span>
            )}
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

          {/* Repository */}
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
              Repository URL (Optional)
            </label>
            <Input
              type="text"
              name="repository"
              value={formData.repository}
              onChange={handleChange}
              placeholder="https://github.com/..."
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
                background: "linear-gradient(135deg, #3b82f6, #1d4ed8)",
                border: "none",
                borderRadius: "6px",
                color: "#fff",
                fontWeight: "600",
                cursor: "pointer",
                fontSize: "0.9rem",
              }}
            >
              Create Project
            </button>
          </div>
        </form>
        </GlassCard>
      </div>
    </div>
  );
}
