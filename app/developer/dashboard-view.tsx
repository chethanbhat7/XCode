"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { readSession, type SessionUser } from "@/lib/session";
import { Header } from "@/components/Header";
import { StatCard } from "@/components/ui/stat-card";
import { Badge } from "@/components/ui/badge";
import { TaskList } from "@/components/dashboard/TaskList";
import { ProjectCard } from "@/components/dashboard/ProjectCard";
import { CommitHeatmap } from "@/components/dashboard/CommitHeatmap";
import { AITokenTracker } from "@/components/dashboard/AITokenTracker";
import { ProductivityChart } from "@/components/dashboard/ProductivityChart";
import { TaskDetailSide } from "@/components/dashboard/TaskDetailSide";
import ProjectChatbot from "@/components/dashboard/ProjectChatbot";
import { useDashboardData } from "@/lib/useDashboardData";
import { Task, Developer, TeamMember } from "@/lib/dashboard-types";
import {
  Clock,
  Code2,
  GitCommit,
  Target,
  TrendingUp,
  Briefcase,
} from "lucide-react";
import { sortProjectsByPriority } from "@/lib/project-utils";
import { fetchUserRepos, fetchRepoMembers, type GitHubRepo } from "@/lib/github";

export default function DeveloperDashboard() {
  const router = useRouter();
  const [session, setSession] = useState<SessionUser | null>(null);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [taskFilter, setTaskFilter] = useState<"all" | "todo" | "in-progress" | "review" | "completed">("all");
  const [realRepos, setRealRepos] = useState<GitHubRepo[]>([]);
  const [detectedMembers, setDetectedMembers] = useState<any[]>([]);
  const [isLoadingRealData, setIsLoadingRealData] = useState(false);
  const [realAIUsage, setRealAIUsage] = useState<any>(null);

  const { data: dbData, loading, error } = useDashboardData();

  useEffect(() => {
    const storedSession = readSession();
    if (!storedSession) {
      router.replace("/");
      return;
    }
    if (storedSession.role !== "developer") {
      router.replace(storedSession.role === "manager" ? "/manager" : "/");
      return;
    }
    setSession(storedSession);

    // Fetch real GitHub data if token exists
    if (storedSession.githubToken) {
      const loadRealData = async () => {
        setIsLoadingRealData(true);
        try {
          const repos = await fetchUserRepos(storedSession.githubToken!);
          setRealRepos(repos);
          
          if (repos.length > 0) {
            const repo = repos[0];
            const members = await fetchRepoMembers(
              storedSession.githubToken!,
              repo.owner?.login || storedSession.githubUsername || "",
              repo.name
            );
            setDetectedMembers(members);
          }
        } catch (error) {
          console.error("Error loading real data:", error);
        } finally {
          setIsLoadingRealData(false);
        }
      };
      loadRealData();

      // Fetch AI Usage
      fetch("/api/ai/usage")
        .then(res => res.json())
        .then(data => setRealAIUsage(data))
        .catch(err => console.error("Error fetching AI usage:", err));
    }
  }, [router]);

  if (!session || loading) return <div style={{ color: "#fff", padding: "40px", textAlign: "center" }}>Loading dashboard...</div>;
  if (error || !dbData) return <div style={{ color: "red", padding: "40px", textAlign: "center" }}>Error loading dashboard: {error}</div>;

  // --- Match the logged-in user to a mock developer ---
  // Try matching by email first, then by name, otherwise default to first developer
  const matchedDev: Developer =
    dbData.developers.find((d) => d.email.toLowerCase() === session.email.toLowerCase()) ||
    dbData.developers.find((d) => d.name.toLowerCase() === session.name.toLowerCase()) ||
    dbData.developers[0]; // fallback for demo

  const matchedTeamMember: TeamMember | undefined = dbData.teamMembers.find(
    (m) => m.id === matchedDev?.id
  );

  // --- Filter data to only this developer ---
  const myTasks = dbData.tasks.filter(
    (t) => t.assignee?.id === matchedDev?.id
  );

  const myProjects = sortProjectsByPriority(
    dbData.projects.filter((p) =>
      p.teamMembers?.some((m) => m.id === matchedDev?.id)
    )
  );

  const myInProgressTasks = myTasks.filter((t) => t.status === "in-progress");
  const myCompletedTasks = myTasks.filter((t) => t.status === "completed");
  const myTotalHours = myTasks.reduce((sum, t) => sum + t.actualHours, 0);
  const myEstimatedHours = myTasks.reduce((sum, t) => sum + t.estimatedHours, 0);

  // Developer's own commit/AI data from their team member record
  const myCommits = matchedTeamMember?.contributions?.commits ?? 0;
  const myEfficiency = matchedTeamMember?.contributions?.efficiency ?? 0;
  const myAIUsage = realAIUsage || matchedTeamMember?.aiUsage || dbData.aiUsage;

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(180deg, #071027 0%, #0a1530 40%, #071023 100%)",
        color: "#e5eefc",
      }}
    >
      <Header />

      <main style={{ padding: "40px 24px", maxWidth: "1600px", margin: "0 auto" }}>
        {/* Welcome Section */}
        <div style={{ marginBottom: "40px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "8px" }}>
            <div
              style={{
                width: "56px",
                height: "56px",
                borderRadius: "50%",
                background: "linear-gradient(145deg, #56d0ff, #7c5cff)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "1.8rem",
                boxShadow: "0 12px 24px rgba(86, 208, 255, 0.15)",
              }}
            >
              {matchedDev.avatar || session.name.charAt(0)}
            </div>
            <div>
              <h1
                style={{
                  fontSize: "2.2rem",
                  fontWeight: "800",
                  margin: "0 0 4px 0",
                  letterSpacing: "-0.02em",
                }}
              >
                Welcome back, {session.name}
              </h1>
              <p style={{ fontSize: "1rem", color: "#97a6c0", margin: "0" }}>
                {matchedDev.role} · {matchedDev.team}
              </p>
            </div>
          </div>
          {/* Skills */}
          <div style={{ display: "flex", gap: "8px", marginTop: "12px", flexWrap: "wrap" }}>
            {matchedDev.skills.map((skill) => (
              <span
                key={skill}
                style={{
                  padding: "4px 12px",
                  borderRadius: "20px",
                  fontSize: "0.78rem",
                  fontWeight: "600",
                  background: "rgba(59, 130, 246, 0.12)",
                  border: "1px solid rgba(59, 130, 246, 0.25)",
                  color: "#7dd3fc",
                }}
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* My Stats */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "20px",
            marginBottom: "40px",
          }}
        >
          <StatCard
            label="Tasks In Progress"
            value={myInProgressTasks.length}
            icon="📋"
            trend={{ value: 12, isPositive: true }}
            progress={(myInProgressTasks.length / (myTasks.length || 1)) * 100}
            subtitle={`${myInProgressTasks.length} active items`}
            accent="blue"
            onClick={() => setTaskFilter("in-progress")}
          />
          <StatCard
            label="Code Velocity"
            value={myCommits}
            icon="🚀"
            trend={{ value: 8, isPositive: true }}
            progress={85}
            subtitle="Top 5% of contributors"
            accent="purple"
          />
          <StatCard
            label="Success Rate"
            value={`${myEfficiency}%`}
            icon="🎯"
            trend={{ value: 3, isPositive: true }}
            progress={myEfficiency}
            subtitle="Deadline met consistently"
            accent="green"
          />
          <StatCard
            label="Workload Balance"
            value={`${myTotalHours}/${myEstimatedHours}h`}
            icon="⚖️"
            trend={{
              value: 95,
              isPositive: true,
            }}
            progress={(myTotalHours / (myEstimatedHours || 1)) * 100}
            subtitle="Optimal capacity used"
            accent="amber"
          />
        </div>

        {/* Real GitHub Data Section */}
        {session.githubToken && (
          <div style={{ marginBottom: "56px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
              <h2
                style={{
                  fontSize: "1.5rem",
                  fontWeight: "800",
                  margin: "0",
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  letterSpacing: "-0.02em"
                }}
              >
                <div style={{ padding: "8px", background: "rgba(34, 197, 94, 0.1)", borderRadius: "10px" }}>
                  <GitCommit size={24} color="#22c55e" />
                </div>
                Live Repositories
                {isLoadingRealData && <span style={{ fontSize: "0.85rem", color: "#97a6c0", fontWeight: "400" }}>(Syncing...)</span>}
              </h2>
              <div style={{ fontSize: "0.85rem", color: "#60a5fa", fontWeight: "600", cursor: "pointer" }}>
                View all on GitHub →
              </div>
            </div>
            
            <div style={{ 
              display: "grid", 
              gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", 
              gap: "24px" 
            }}>
              {realRepos.length > 0 ? (
                realRepos.map(repo => (
                  <div key={repo.id} style={{ 
                    padding: "24px", 
                    background: "rgba(255, 255, 255, 0.02)", 
                    borderRadius: "20px", 
                    border: "1px solid rgba(255, 255, 255, 0.06)",
                    transition: "all 0.3s ease",
                    position: "relative",
                    overflow: "hidden"
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "rgba(255, 255, 255, 0.04)";
                    e.currentTarget.style.borderColor = "rgba(59, 130, 246, 0.3)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "rgba(255, 255, 255, 0.02)";
                    e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.06)";
                  }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px" }}>
                      <div style={{ fontWeight: "800", color: "#fff", fontSize: "1.1rem" }}>{repo.name}</div>
                      <Badge label={repo.language || "Docs"} variant="info" size="sm" />
                    </div>
                    <div style={{ fontSize: "0.85rem", color: "#97a6c0", marginBottom: "20px", height: "3em", overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>
                      {repo.description || "No description provided. This repository is part of your active project suite."}
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "16px", fontSize: "0.8rem" }}>
                      <span style={{ color: "#fbbf24", display: "flex", alignItems: "center", gap: "4px" }}>
                        ⭐ {repo.stargazers_count}
                      </span>
                      <span style={{ color: "#97a6c0" }}>Updated {new Date(repo.updated_at).toLocaleDateString()}</span>
                      <a href={repo.html_url} target="_blank" rel="noopener noreferrer" style={{ marginLeft: "auto", color: "#3b82f6", textDecoration: "none", fontWeight: "600" }}>Open</a>
                    </div>
                  </div>
                ))
              ) : !isLoadingRealData && (
                <div style={{ color: "#97a6c0", fontSize: "1rem", padding: "48px", gridColumn: "1 / -1", textAlign: "center", background: "rgba(255,255,255,0.01)", borderRadius: "24px", border: "1px dashed rgba(255,255,255,0.1)" }}>
                  Connect your GitHub account in the profile menu to sync live data.
                </div>
              )}
            </div>
          </div>
        )}

        {/* Main Content Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "24px",
            marginBottom: "40px",
          }}
        >
          {/* My Tasks Section */}
          <div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "20px",
              }}
            >
              <h2
                style={{
                  fontSize: "1.25rem",
                  fontWeight: "700",
                  margin: "0",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                <Clock size={20} color="#3b82f6" /> My Tasks
                <span
                  style={{
                    fontSize: "0.8rem",
                    fontWeight: "500",
                    color: "#97a6c0",
                    background: "rgba(255,255,255,0.06)",
                    padding: "2px 10px",
                    borderRadius: "12px",
                  }}
                >
                  {myTasks.length}
                </span>
              </h2>
              <div style={{ display: "flex", gap: "8px" }}>
                {["all", "todo", "in-progress", "review", "completed"].map((filter) => (
                  <button
                    key={filter}
                    onClick={() =>
                      setTaskFilter(
                        filter as "all" | "todo" | "in-progress" | "review" | "completed"
                      )
                    }
                    style={{
                      padding: "6px 12px",
                      borderRadius: "6px",
                      fontSize: "0.75rem",
                      fontWeight: "600",
                      border:
                        taskFilter === filter
                          ? "1px solid #3b82f6"
                          : "1px solid rgba(255, 255, 255, 0.1)",
                      background:
                        taskFilter === filter
                          ? "rgba(59, 130, 246, 0.15)"
                          : "rgba(255, 255, 255, 0.02)",
                      color: taskFilter === filter ? "#3b82f6" : "#97a6c0",
                      cursor: "pointer",
                      transition: "all 0.2s",
                      textTransform: "capitalize",
                    }}
                  >
                    {filter}
                  </button>
                ))}
              </div>
            </div>
            <TaskList
              tasks={myTasks}
              filter={taskFilter}
              onTaskClick={setSelectedTask}
            />
          </div>

          {/* My Projects Section */}
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
              <Code2 size={20} color="#22c55e" /> My Projects
              <span
                style={{
                  fontSize: "0.8rem",
                  fontWeight: "500",
                  color: "#97a6c0",
                  background: "rgba(255,255,255,0.06)",
                  padding: "2px 10px",
                  borderRadius: "12px",
                }}
              >
                {myProjects.length}
              </span>
            </h2>
            <div style={{ display: "grid", gap: "16px" }}>
              {myProjects.length === 0 ? (
                <div
                  style={{
                    padding: "40px",
                    textAlign: "center",
                    color: "#97a6c0",
                    background: "rgba(255,255,255,0.02)",
                    borderRadius: "16px",
                    border: "1px solid rgba(255,255,255,0.06)",
                  }}
                >
                  No projects assigned yet
                </div>
              ) : (
                myProjects.map((project) => (
                  <div key={project.id}>
                    <ProjectCard
                      project={project}
                      onProjectClick={(p) => router.push(`/project/${p.id}`)}
                      developerView
                    />
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Analytics Row */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "24px",
            marginBottom: "40px",
          }}
        >
          <CommitHeatmap activity={dbData.commitActivity} />
          <AITokenTracker usage={myAIUsage} />
        </div>

        {/* My GitHub Collaborators */}
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
              <Target size={20} color="#10b981" /> My GitHub Collaborators
              <span style={{ fontSize: "0.8rem", color: "#97a6c0", fontWeight: "400" }}>
                (from {realRepos[0]?.name})
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
                    minWidth: "160px", 
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
                    width={50}
                    height={50}
                    style={{ 
                      width: "50px", 
                      height: "50px", 
                      borderRadius: "50%", 
                      marginBottom: "10px",
                      border: "2px solid rgba(16, 185, 129, 0.3)"
                    }} 
                  />
                  <div style={{ fontWeight: "700", color: "#e5eefc", fontSize: "0.85rem", marginBottom: "2px" }}>{member.name}</div>
                  <div style={{ fontSize: "0.7rem", color: "#97a6c0", marginBottom: "8px" }}>@{member.githubUsername}</div>
                  <div style={{ 
                    fontSize: "0.65rem", 
                    padding: "3px 6px", 
                    background: "rgba(16, 185, 129, 0.1)", 
                    color: "#10b981", 
                    borderRadius: "8px",
                    display: "inline-block"
                  }}>
                    {member.productivity}% Prod.
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <ProductivityChart metrics={dbData.productivityMetrics} />
      </main>

      {/* Task Detail Sidebar */}
      {selectedTask && (
        <TaskDetailSide task={selectedTask} onClose={() => setSelectedTask(null)} />
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
