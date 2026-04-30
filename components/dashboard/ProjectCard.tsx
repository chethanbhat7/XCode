"use client";

import React from "react";
import { GlassCard } from "@/components/ui/glass-card";
import { Badge } from "@/components/ui/badge-advanced";
import { Project } from "@/lib/dashboard-types";
import { ProgressBar } from "@/components/ui/progress-bar";
import { GitBranch, Users, Calendar, ChevronRight } from "lucide-react";

interface ProjectCardProps {
  project: Project;
  onProjectClick: (project: Project) => void;
  developerView?: boolean;
}

export function ProjectCard({ project, onProjectClick, developerView = true }: ProjectCardProps) {
  const daysRemaining = Math.ceil(
    (new Date(project.dueDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
  );

  const statusVariant: Record<string, "success" | "info" | "warning" | "danger" | "default"> = {
    planning: "default",
    "in-progress": "info",
    review: "warning",
    completed: "success",
  };

  return (
    <GlassCard interactive onClick={() => onProjectClick(project)}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: "16px" }}>
        <div>
          <h3
            style={{
              fontSize: "1.125rem",
              fontWeight: "700",
              color: "#e5eefc",
              margin: "0 0 4px 0",
            }}
          >
            {project.name}
          </h3>
          <p
            style={{
              fontSize: "0.85rem",
              color: "#97a6c0",
              margin: "0",
              maxWidth: "300px",
            }}
          >
            {project.description}
          </p>
        </div>
        <ChevronRight size={20} color="#3b82f6" style={{ flexShrink: 0 }} />
      </div>

      <Badge
        label={project.status}
        variant={statusVariant[project.status] as any}
        size="sm"
        style={{ marginBottom: "12px" }}
      />

      <div style={{ marginBottom: "16px" }}>
        <ProgressBar value={project.progress} label="Progress" color="blue" />
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "12px",
          fontSize: "0.85rem",
          marginBottom: "16px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            color: "#97a6c0",
          }}
        >
          <Calendar size={16} />
          <span>
            {daysRemaining > 0 ? `${daysRemaining}d left` : "Overdue"}
          </span>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            color: "#97a6c0",
          }}
        >
          <Users size={16} />
          <span>{project.teamMembers.length} members</span>
        </div>
        {project.commits !== undefined && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              color: "#97a6c0",
            }}
          >
            <GitBranch size={16} />
            <span>{project.commits} commits</span>
          </div>
        )}
      </div>

      {project.teamMembers.length > 0 && (
        <div style={{ borderTop: "1px solid rgba(255, 255, 255, 0.06)", paddingTop: "12px" }}>
          <div style={{ fontSize: "0.75rem", color: "#97a6c0", marginBottom: "8px" }}>
            Team Members
          </div>
          <div style={{ display: "flex", gap: "4px", flexWrap: "wrap" }}>
            {project.teamMembers.slice(0, 5).map((member) => (
              <div
                key={member.id}
                style={{
                  width: "32px",
                  height: "32px",
                  borderRadius: "50%",
                  background: "rgba(59, 130, 246, 0.2)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "0.9rem",
                  cursor: "pointer",
                  transition: "all 0.2s",
                  border: "1px solid rgba(59, 130, 246, 0.3)",
                }}
                title={member.name}
              >
                {member.avatar || member.name.charAt(0)}
              </div>
            ))}
            {project.teamMembers.length > 5 && (
              <div
                style={{
                  width: "32px",
                  height: "32px",
                  borderRadius: "50%",
                  background: "rgba(147, 51, 234, 0.2)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "0.8rem",
                  border: "1px solid rgba(147, 51, 234, 0.3)",
                  color: "#a855f7",
                  fontWeight: "700",
                }}
              >
                +{project.teamMembers.length - 5}
              </div>
            )}
          </div>
        </div>
      )}
    </GlassCard>
  );
}

export default ProjectCard;
