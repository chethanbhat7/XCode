"use client";

import React from "react";
import { GlassCard } from "@/components/ui/glass-card";
import { Badge } from "@/components/ui/badge-advanced";
import { ProjectPhase, Project } from "@/lib/dashboard-types";
import { ProgressBar } from "@/components/ui/progress-bar";
import { ChevronRight } from "lucide-react";

interface ProjectPhasesProps {
  phases: ProjectPhase[];
  onProjectClick: (project: Project) => void;
}

export function ProjectPhases({ phases, onProjectClick }: ProjectPhasesProps) {
  const phaseColors: Record<string, string> = {
    planning: "#94a3b8",
    "in-progress": "#3b82f6",
    review: "#fbbf24",
    completed: "#22c55e",
  };

  const phaseTitles: Record<string, string> = {
    planning: "📋 Planning",
    "in-progress": "🚀 In Progress",
    review: "👀 Review",
    completed: "✓ Completed",
  };

  return (
    <div style={{ display: "grid", gap: "24px" }}>
      {phases.map((phase) => (
        <div key={phase.id}>
          <h3
            style={{
              fontSize: "1rem",
              fontWeight: "700",
              color: "#e5eefc",
              marginBottom: "12px",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <span style={{ color: phaseColors[phase.phase] }}>
              {phaseTitles[phase.phase]}
            </span>
            <Badge label={`${phase.projects.length}`} variant="default" size="sm" />
          </h3>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
              gap: "12px",
            }}
          >
            {phase.projects.map((project) => (
              <div key={project.id}>
                <GlassCard
                  interactive
                  onClick={() => onProjectClick(project)}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "start",
                      marginBottom: "12px",
                    }}
                  >
                    <h4
                      style={{
                        fontSize: "0.95rem",
                        fontWeight: "700",
                        color: "#e5eefc",
                        margin: "0",
                        flex: 1,
                      }}
                    >
                      {project.name}
                    </h4>
                    <ChevronRight size={16} color={phaseColors[phase.phase]} />
                  </div>

                  <p
                    style={{
                      fontSize: "0.8rem",
                      color: "#97a6c0",
                      margin: "0 0 12px 0",
                      lineHeight: "1.4",
                    }}
                  >
                    {project.description}
                  </p>

                  <ProgressBar
                    value={project.progress}
                    showPercent={true}
                    color={
                      phase.phase === "completed"
                        ? "green"
                        : phase.phase === "review"
                          ? "amber"
                          : "blue"
                    }
                    height="6px"
                  />

                  <div
                    style={{
                      marginTop: "12px",
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: "8px",
                      fontSize: "0.75rem",
                      color: "#97a6c0",
                    }}
                  >
                    <div>
                      👥 {project.teamMembers.length} members
                    </div>
                    <div>
                      📋 {project.tasks.length} tasks
                    </div>
                  </div>
                </GlassCard>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export default ProjectPhases;
