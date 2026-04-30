"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { readSession } from "@/lib/session";
import { Header } from "@/components/Header";
import { StatCard } from "@/components/ui/stat-card";
import { MetricsSummary } from "@/components/dashboard/MetricsSummary";
import { TeamGrid } from "@/components/dashboard/TeamGrid";
import { ProjectPhases } from "@/components/dashboard/ProjectPhases";
import { RiskAlerts } from "@/components/dashboard/RiskAlerts";
import {
  mockTeamMembers,
  mockProjects,
  mockRiskAlerts,
} from "@/lib/mock-data";
import { TeamMember, Project, ProjectPhase } from "@/lib/dashboard-types";
import {
  Users,
  GitBranch,
  TrendingUp,
  AlertTriangle,
  Plus,
} from "lucide-react";
import { useEffect } from "react";

export default function ManagerDashboard() {
  const router = useRouter();
  const session = readSession();
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  useEffect(() => {
    if (!session) {
      router.replace("/");
    }
  }, [router, session]);

  if (!session) return null;

  // Department metrics
  const departmentMetrics = {
    totalProjects: mockProjects.length,
    activeProjects: mockProjects.filter((p) => p.status !== "completed").length,
    completedProjects: mockProjects.filter((p) => p.status === "completed").length,
    teamSize: mockTeamMembers.length,
    averageProductivity: mockTeamMembers.reduce((sum, m) => sum + m.departmentProductivity, 0) / mockTeamMembers.length,
    avgDeadlineMet: mockTeamMembers.reduce((sum, m) => sum + m.deadline_met_percentage, 0) / mockTeamMembers.length,
    totalTokensUsed: 148230,
  };

  // Project phases
  const projectPhases: ProjectPhase[] = [
    {
      id: "phase-planning",
      phase: "planning",
      projects: mockProjects.filter((p) => p.status === "planning"),
    },
    {
      id: "phase-progress",
      phase: "in-progress",
      projects: mockProjects.filter((p) => p.status === "in-progress"),
    },
    {
      id: "phase-review",
      phase: "review",
      projects: mockProjects.filter((p) => p.status === "review"),
    },
    {
      id: "phase-completed",
      phase: "completed",
      projects: mockProjects.filter((p) => p.status === "completed"),
    },
  ];

  const totalTeamCommits = mockProjects.reduce((sum, p) => sum + (p.commits || 0), 0);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(180deg, #0f1923 0%, #0d1828 40%, #0a1520 100%)",
        color: "#e5eefc",
      }}
    >
      <Header />

      <main style={{ padding: "40px 24px", maxWidth: "1800px", margin: "0 auto" }}>
        {/* Welcome Section */}
        <div style={{ marginBottom: "40px" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "start",
              gap: "16px",
            }}
          >
            <div>
              <h1
                style={{
                  fontSize: "2.2rem",
                  fontWeight: "800",
                  margin: "0 0 8px 0",
                  letterSpacing: "-0.02em",
                }}
              >
                Management Dashboard
              </h1>
              <p style={{ fontSize: "1rem", color: "#97a6c0", margin: "0" }}>
                Organizational overview and team performance metrics
              </p>
            </div>
            <button
              style={{
                padding: "10px 16px",
                background: "linear-gradient(135deg, #22c55e, #16a34a)",
                border: "none",
                borderRadius: "8px",
                color: "white",
                fontWeight: "600",
                fontSize: "0.9rem",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "6px",
                transition: "all 0.2s",
              }}
              onMouseEnter={(e: any) => {
                (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)";
              }}
              onMouseLeave={(e: any) => {
                (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
              }}
            >
              <Plus size={18} /> New Project
            </button>
          </div>
        </div>

        {/* Department Metrics */}
        <div style={{ marginBottom: "40px" }}>
          <MetricsSummary metrics={departmentMetrics} />
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
            label="Team Members"
            value={departmentMetrics.teamSize}
            icon="👥"
            trend={{ value: 2, isPositive: true }}
            accent="green"
            onClick={() => console.log("Team view")}
          />
          <StatCard
            label="Projects Active"
            value={departmentMetrics.activeProjects}
            icon="📊"
            trend={{ value: 18, isPositive: true }}
            accent="blue"
            onClick={() => console.log("Projects view")}
          />
          <StatCard
            label="Team Commits"
            value={totalTeamCommits}
            icon="🔗"
            trend={{ value: 12, isPositive: true }}
            accent="purple"
          />
          <StatCard
            label="Avg Deadline Met"
            value={`${departmentMetrics.avgDeadlineMet.toFixed(0)}%`}
            icon="✓"
            trend={{ value: 5, isPositive: true }}
            accent="amber"
          />
        </div>

        {/* Team Members Section */}
        <div style={{ marginBottom: "40px" }}>
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
            <Users size={20} color="#22c55e" /> Team Members
          </h2>
          <TeamGrid
            members={mockTeamMembers}
            onMemberClick={setSelectedMember}
          />
        </div>

        {/* Risk Alerts */}
        <div style={{ marginBottom: "40px" }}>
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
            <AlertTriangle size={20} color="#ef4444" /> Risk Alerts
          </h2>
          <RiskAlerts alerts={mockRiskAlerts} />
        </div>

        {/* Project Phases */}
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
            <GitBranch size={20} color="#3b82f6" /> Project Pipeline
          </h2>
          <ProjectPhases
            phases={projectPhases}
            onProjectClick={setSelectedProject}
          />
        </div>
      </main>

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
