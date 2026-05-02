"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { readSession, type SessionUser } from "@/lib/session";
import { Header } from "@/components/Header";
import { StatCard } from "@/components/ui/stat-card";
import { MetricsSummary } from "@/components/dashboard/MetricsSummary";
// TeamGrid removed from main dashboard per user preference; teams shown only within projects
import { ProjectPhases } from "@/components/dashboard/ProjectPhases";
import { RiskAlerts } from "@/components/dashboard/RiskAlerts";
import CreateProjectForm from "@/components/dashboard/CreateProjectForm";
import ProjectChatbot from "@/components/dashboard/ProjectChatbot";
import {
  mockTeamMembers,
  mockProjects,
  mockRiskAlerts,
} from "@/lib/mock-data";
import { sortProjectsByPriority } from "@/lib/project-utils";
import { fetchUserOrgs, fetchUserRepos, fetchRepoMembers } from "@/lib/github";
import { TeamMember, Project, ProjectPhase } from "@/lib/dashboard-types";
import {
  Users,
  GitBranch,
  TrendingUp,
  AlertTriangle,
  Plus,
} from "lucide-react";

export default function ManagerDashboard() {
  const router = useRouter();
  const [session, setSession] = useState<SessionUser | null>(null);
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [projects, setProjects] = useState<Project[]>(mockProjects);
  const [githubOrgs, setGithubOrgs] = useState<any[]>([]);
  const [githubRepos, setGithubRepos] = useState<any[]>([]);
  const [detectedMembers, setDetectedMembers] = useState<any[]>([]);
  const [isLoadingGithub, setIsLoadingGithub] = useState(false);
  const [realAIUsage, setRealAIUsage] = useState<any>(null);

  useEffect(() => {
    const storedSession = readSession();
    if (!storedSession) {
      router.replace("/");
      return;
    }
    if (storedSession.role !== "manager") {
      router.replace(storedSession.role === "developer" ? "/developer" : "/");
      return;
    }
    setSession(storedSession);

    if (storedSession.githubToken) {
      const loadGithubData = async () => {
        setIsLoadingGithub(true);
        try {
          const [orgs, repos] = await Promise.all([
            fetchUserOrgs(storedSession.githubToken!),
            fetchUserRepos(storedSession.githubToken!)
          ]);
          setGithubOrgs(orgs);
          setGithubRepos(repos);

          // Automatically detect members from the first repo found
          if (repos.length > 0) {
            const repo = repos[0];
            const members = await fetchRepoMembers(
              storedSession.githubToken!, 
              repo.owner?.login || session?.githubUsername || "", 
              repo.name
            );
            setDetectedMembers(members);
          }
        } catch (error) {
          console.error("Error loading GitHub data:", error);
        } finally {
          setIsLoadingGithub(false);
        }
      };
      loadGithubData();

      // Fetch AI Usage
      fetch("/api/ai/usage")
        .then(res => res.json())
        .then(data => setRealAIUsage(data))
        .catch(err => console.error("Error fetching AI usage:", err));
    }
  }, [router, session?.githubUsername]);

  if (!session) return null;

  // Handler for creating new projects
  const handleProjectCreate = (newProject: Project) => {
    setProjects([...projects, newProject]);
    setShowCreateForm(false);
    router.push(`/project/${newProject.id}`);
  };

  // Department metrics
  const departmentMetrics = {
    totalProjects: projects.length,
    activeProjects: projects.filter((p) => p.status !== "completed").length,
    completedProjects: projects.filter((p) => p.status === "completed").length,
    teamSize: mockTeamMembers.length,
    averageProductivity: mockTeamMembers.reduce((sum, m) => sum + m.departmentProductivity, 0) / mockTeamMembers.length,
    avgDeadlineMet: mockTeamMembers.reduce((sum, m) => sum + m.deadline_met_percentage, 0) / mockTeamMembers.length,
    totalTokensUsed: realAIUsage?.tokensUsed || 148230,
  };

  // Note: project priority computation moved to lib/project-utils for reuse across views.

  // Project phases (bucket by status) — within each phase sort projects by priority desc
  const projectPhases: ProjectPhase[] = [
    {
      id: "phase-planning",
      phase: "planning",
      projects: sortProjectsByPriority(projects.filter((p) => p.status === "planning")),
    },
    {
      id: "phase-development",
      phase: "in-progress",
      projects: sortProjectsByPriority(projects.filter((p) => p.status === "in-progress")),
    },
    {
      id: "phase-testing",
      phase: "review",
      projects: sortProjectsByPriority(projects.filter((p) => p.status === "review")),
    },
    {
      id: "phase-feedback",
      phase: "completed",
      projects: sortProjectsByPriority(projects.filter((p) => p.status === "completed")),
    },
  ];

  const totalTeamCommits = projects.reduce((sum, p) => sum + (p.commits || 0), 0);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(180deg, #0f1923 0%, #0d1828 40%, #0a1520 100%)",
        color: "#e5eefc",
      }}
    >
      <Header />

      <main style={{ padding: "48px 48px", maxWidth: "2000px", margin: "0 auto" }}>
        {/* Welcome Section */}
        <div style={{ marginBottom: "56px" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: "32px",
            }}
          >
            <div>
              <h1
                style={{
                  fontSize: "3rem",
                  fontWeight: "900",
                  margin: "0 0 12px 0",
                  letterSpacing: "-0.03em",
                  background: "linear-gradient(135deg, #e5eefc, #97a6c0)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                Management Dashboard
              </h1>
              <p style={{ fontSize: "1rem", color: "#97a6c0", margin: "0" }}>
                Organizational overview and team performance metrics
              </p>
            </div>
            <button
              onClick={() => setShowCreateForm(true)}
              style={{
                padding: "12px 28px",
                background: "linear-gradient(135deg, #22c55e, #16a34a)",
                border: "none",
                borderRadius: "10px",
                color: "white",
                fontWeight: "700",
                fontSize: "1rem",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "10px",
                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                boxShadow: "0 8px 16px rgba(34, 197, 94, 0.25)",
                whiteSpace: "nowrap",
              }}
              onMouseEnter={(e: any) => {
                e.currentTarget.style.transform = "translateY(-3px)";
                e.currentTarget.style.boxShadow = "0 12px 24px rgba(34, 197, 94, 0.35)";
              }}
              onMouseLeave={(e: any) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 8px 16px rgba(34, 197, 94, 0.25)";
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
            onClick={() => router.push("/project")}
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

        {/* Team Members removed from main dashboard — show team inside project pages only */}

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

        {/* Detected GitHub Members */}
        {detectedMembers.length > 0 && (
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
              <Users size={20} color="#10b981" /> Detected GitHub Members
              <span style={{ fontSize: "0.8rem", color: "#97a6c0", fontWeight: "400" }}>
                (from {githubRepos[0]?.name})
              </span>
            </h2>
            <div style={{ 
              display: "flex", 
              gap: "16px", 
              overflowX: "auto", 
              paddingBottom: "10px",
              scrollbarWidth: "thin",
              scrollbarColor: "rgba(255,255,255,0.1) transparent"
            }}>
              {detectedMembers.map((member) => (
                <div 
                  key={member.id} 
                  style={{ 
                    minWidth: "180px", 
                    padding: "16px", 
                    background: "rgba(255, 255, 255, 0.03)", 
                    borderRadius: "16px", 
                    border: "1px solid rgba(255, 255, 255, 0.08)",
                    textAlign: "center"
                  }}
                >
                  <img 
                    src={member.avatarUrl} 
                    alt={member.name} 
                    style={{ 
                      width: "60px", 
                      height: "60px", 
                      borderRadius: "50%", 
                      marginBottom: "12px",
                      border: "2px solid rgba(16, 185, 129, 0.3)"
                    }} 
                  />
                  <div style={{ fontWeight: "700", color: "#e5eefc", marginBottom: "2px" }}>{member.name}</div>
                  <div style={{ fontSize: "0.75rem", color: "#97a6c0", marginBottom: "8px" }}>@{member.githubUsername}</div>
                  <div style={{ 
                    fontSize: "0.7rem", 
                    padding: "4px 8px", 
                    background: "rgba(16, 185, 129, 0.1)", 
                    color: "#10b981", 
                    borderRadius: "10px",
                    display: "inline-block"
                  }}>
                    Productivity: {member.productivity}%
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

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
            onProjectClick={(p) => router.push(`/project/${p.id}`)}
          />
        </div>
      </main>

      {/* Create Project Form Modal */}
      {showCreateForm && (
        <CreateProjectForm 
          onClose={() => setShowCreateForm(false)}
          onSubmit={handleProjectCreate}
        />
      )}

      {/* Floating Chatbot Assistant */}
      <ProjectChatbot />

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
