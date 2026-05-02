"use client";

import { TeamMember, Project } from "@/lib/dashboard-types";
import { GlassCard } from "@/components/ui/glass-card";
import { ProgressBar } from "@/components/ui/progress-bar";
import { Badge } from "@/components/ui/badge-advanced";
import { TrendingUp, Users, Zap, Target } from "lucide-react";

interface AnalyticsDashboardProps {
  project: Project;
}

export default function AnalyticsDashboard({ project }: AnalyticsDashboardProps) {
  // Calculate team metrics
  const totalMembers = project.teamMembers.filter((m) => m.id !== "ai-1").length;
  const completedTasks = project.tasks.filter((t) => t.status === "completed").length;
  const inProgressTasks = project.tasks.filter((t) => t.status === "in-progress").length;
  const totalHoursWorked = project.tasks
    .filter((t) => t.status === "completed")
    .reduce((sum, t) => sum + (t.actualHours || 0), 0);
  const totalHoursEstimated = project.tasks.reduce((sum, t) => sum + (t.estimatedHours || 0), 0);
  const efficiencyRatio = totalHoursEstimated > 0 ? (totalHoursWorked / totalHoursEstimated) * 100 : 0;

  // Calculate per-member metrics
  const memberMetrics = project.teamMembers
    .filter((m) => m.id !== "ai-1")
    .map((member) => {
      const memberTasks = project.tasks.filter((t) => t.assignee?.id === member.id);
      const completedMemberTasks = memberTasks.filter((t) => t.status === "completed");
      const actualHours = completedMemberTasks.reduce((sum, t) => sum + (t.actualHours || 0), 0);
      const estimatedHours = memberTasks.reduce((sum, t) => sum + (t.estimatedHours || 0), 0);
      const memberEfficiency =
        estimatedHours > 0 ? (actualHours / estimatedHours) * 100 : 0;

      return {
        member,
        totalTasks: memberTasks.length,
        completedTasks: completedMemberTasks.length,
        actualHours,
        estimatedHours,
        efficiency: Math.min(memberEfficiency, 150), // Cap at 150%
      };
    });

  // Calculate AI contribution
  const aiUsageTotal = project.teamMembers
    .filter((m) => m.id === "ai-1")[0]?.aiUsage?.tokensUsed || 0;
  const aiPrompts = project.teamMembers
    .filter((m) => m.id === "ai-1")[0]?.aiUsage?.promptsUsed || 0;

  return (
    <div style={{ display: "grid", gap: "24px" }}>
      {/* Overview Stats */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "16px",
        }}
      >
        <GlassCard>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
            <div
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "8px",
                background: "rgba(59, 130, 246, 0.2)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Users size={20} color="#3b82f6" />
            </div>
            <div>
              <div style={{ fontSize: "0.75rem", color: "#97a6c0", fontWeight: "600" }}>
                TEAM SIZE
              </div>
              <div style={{ fontSize: "1.5rem", fontWeight: "700", color: "#e5eefc" }}>
                {totalMembers}
              </div>
            </div>
          </div>
        </GlassCard>

        <GlassCard>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
            <div
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "8px",
                background: "rgba(34, 197, 94, 0.2)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Target size={20} color="#22c55e" />
            </div>
            <div>
              <div style={{ fontSize: "0.75rem", color: "#97a6c0", fontWeight: "600" }}>
                COMPLETION RATE
              </div>
              <div style={{ fontSize: "1.5rem", fontWeight: "700", color: "#e5eefc" }}>
                {Math.round((completedTasks / project.tasks.length) * 100) || 0}%
              </div>
            </div>
          </div>
        </GlassCard>

        <GlassCard>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
            <div
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "8px",
                background: "rgba(147, 51, 234, 0.2)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <TrendingUp size={20} color="#9333ea" />
            </div>
            <div>
              <div style={{ fontSize: "0.75rem", color: "#97a6c0", fontWeight: "600" }}>
                EFFICIENCY
              </div>
              <div style={{ fontSize: "1.5rem", fontWeight: "700", color: "#e5eefc" }}>
                {Math.round(efficiencyRatio)}%
              </div>
            </div>
          </div>
        </GlassCard>

        <GlassCard>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
            <div
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "8px",
                background: "rgba(244, 114, 24, 0.2)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Zap size={20} color="#f47218" />
            </div>
            <div>
              <div style={{ fontSize: "0.75rem", color: "#97a6c0", fontWeight: "600" }}>
                AI USAGE
              </div>
              <div style={{ fontSize: "1.5rem", fontWeight: "700", color: "#e5eefc" }}>
                {aiPrompts}
              </div>
            </div>
          </div>
        </GlassCard>
      </div>

      {/* Developer Performance Table */}
      <GlassCard>
        <h3
          style={{
            fontSize: "1.05rem",
            fontWeight: "700",
            color: "#e5eefc",
            margin: "0 0 16px 0",
          }}
        >
          Developer Performance
        </h3>

        <div style={{ overflowX: "auto" }}>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              fontSize: "0.85rem",
            }}
          >
            <thead>
              <tr
                style={{
                  borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
                }}
              >
                <th
                  style={{
                    textAlign: "left",
                    padding: "12px 8px",
                    color: "#97a6c0",
                    fontWeight: "600",
                  }}
                >
                  Developer
                </th>
                <th
                  style={{
                    textAlign: "center",
                    padding: "12px 8px",
                    color: "#97a6c0",
                    fontWeight: "600",
                  }}
                >
                  Tasks
                </th>
                <th
                  style={{
                    textAlign: "center",
                    padding: "12px 8px",
                    color: "#97a6c0",
                    fontWeight: "600",
                  }}
                >
                  Completed
                </th>
                <th
                  style={{
                    textAlign: "center",
                    padding: "12px 8px",
                    color: "#97a6c0",
                    fontWeight: "600",
                  }}
                >
                  Hours
                </th>
                <th
                  style={{
                    textAlign: "center",
                    padding: "12px 8px",
                    color: "#97a6c0",
                    fontWeight: "600",
                  }}
                >
                  Efficiency
                </th>
              </tr>
            </thead>
            <tbody>
              {memberMetrics.map((metric) => (
                <tr
                  key={metric.member.id}
                  style={{
                    borderBottom: "1px solid rgba(255, 255, 255, 0.05)",
                  }}
                >
                  <td style={{ padding: "12px 8px", color: "#e5eefc" }}>
                    <div style={{ fontWeight: "600" }}>{metric.member.name}</div>
                    <div style={{ fontSize: "0.75rem", color: "#97a6c0" }}>
                      {metric.member.role}
                    </div>
                  </td>
                  <td style={{ padding: "12px 8px", textAlign: "center", color: "#e5eefc" }}>
                    {metric.totalTasks}
                  </td>
                  <td style={{ padding: "12px 8px", textAlign: "center", color: "#22c55e" }}>
                    {metric.completedTasks}
                  </td>
                  <td style={{ padding: "12px 8px", textAlign: "center", color: "#e5eefc" }}>
                    {metric.actualHours}h / {metric.estimatedHours}h
                  </td>
                  <td style={{ padding: "12px 8px", textAlign: "center" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <div style={{ flex: 1, minWidth: "80px" }}>
                        <ProgressBar
                          value={metric.efficiency}
                          max={150}
                          color={metric.efficiency > 100 ? "green" : "blue"}
                          height="4px"
                          showPercent={false}
                        />
                      </div>
                      <span style={{ color: "#e5eefc", fontWeight: "600", minWidth: "40px" }}>
                        {Math.round(metric.efficiency)}%
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>

      {/* AI Contribution */}
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
          🤖 AI Assistant Contribution
        </h3>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
            gap: "12px",
          }}
        >
          <div
            style={{
              padding: "12px",
              background: "rgba(244, 114, 24, 0.1)",
              borderRadius: "8px",
              border: "1px solid rgba(244, 114, 24, 0.2)",
            }}
          >
            <div style={{ fontSize: "0.75rem", color: "#97a6c0", marginBottom: "4px" }}>
              Tokens Used
            </div>
            <div style={{ fontSize: "1.5rem", fontWeight: "700", color: "#f47218" }}>
              {aiUsageTotal.toLocaleString()}
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
            <div style={{ fontSize: "0.75rem", color: "#97a6c0", marginBottom: "4px" }}>
              Prompts Used
            </div>
            <div style={{ fontSize: "1.5rem", fontWeight: "700", color: "#3b82f6" }}>
              {aiPrompts}
            </div>
          </div>

          <div
            style={{
              padding: "12px",
              background: "rgba(34, 197, 94, 0.1)",
              borderRadius: "8px",
              border: "1px solid rgba(34, 197, 94, 0.2)",
            }}
          >
            <div style={{ fontSize: "0.75rem", color: "#97a6c0", marginBottom: "4px" }}>
              Contribution
            </div>
            <div style={{ fontSize: "1.5rem", fontWeight: "700", color: "#22c55e" }}>
              {project.aiContribution || 0}%
            </div>
          </div>
        </div>
      </GlassCard>
    </div>
  );
}
