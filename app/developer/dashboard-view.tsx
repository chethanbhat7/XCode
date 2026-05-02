"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { readSession, type SessionUser } from "@/lib/session";
import { Header } from "@/components/Header";
import { StatCard } from "@/components/ui/stat-card";
import { TaskList } from "@/components/dashboard/TaskList";
import { ProjectCard } from "@/components/dashboard/ProjectCard";
import { CommitHeatmap } from "@/components/dashboard/CommitHeatmap";
import { AITokenTracker } from "@/components/dashboard/AITokenTracker";
import { ProductivityChart } from "@/components/dashboard/ProductivityChart";
import { TaskDetailSide } from "@/components/dashboard/TaskDetailSide";
import {
  mockTasks,
  mockProjects,
  mockCommitActivity,
  mockAIUsage,
  mockProductivityMetrics,
  mockDevelopers,
  mockTeamMembers,
} from "@/lib/mock-data";
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
    }
  }, [router]);

  if (!session) return null;

  // --- Match the logged-in user to a mock developer ---
  // Try matching by email first, then by name, otherwise default to first developer
  const matchedDev: Developer =
    mockDevelopers.find((d) => d.email.toLowerCase() === session.email.toLowerCase()) ||
    mockDevelopers.find((d) => d.name.toLowerCase() === session.name.toLowerCase()) ||
    mockDevelopers[0]; // fallback for demo

  const matchedTeamMember: TeamMember | undefined = mockTeamMembers.find(
    (m) => m.id === matchedDev.id
  );

  // --- Filter data to only this developer ---
  const myTasks = mockTasks.filter(
    (t) => t.assignee.id === matchedDev.id
  );

  const myProjects = sortProjectsByPriority(
    mockProjects.filter((p) =>
      p.teamMembers.some((m) => m.id === matchedDev.id)
    )
  );

  const myInProgressTasks = myTasks.filter((t) => t.status === "in-progress");
  const myCompletedTasks = myTasks.filter((t) => t.status === "completed");
  const myTotalHours = myTasks.reduce((sum, t) => sum + t.actualHours, 0);
  const myEstimatedHours = myTasks.reduce((sum, t) => sum + t.estimatedHours, 0);

  // Developer's own commit/AI data from their team member record
  const myCommits = matchedTeamMember?.contributions?.commits ?? 0;
  const myEfficiency = matchedTeamMember?.contributions?.efficiency ?? 0;
  const myAIUsage = matchedTeamMember?.aiUsage ?? mockAIUsage;

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
            label="My Tasks In Progress"
            value={myInProgressTasks.length}
            icon="📋"
            trend={{ value: myInProgressTasks.length, isPositive: true }}
            accent="blue"
            onClick={() => setTaskFilter("in-progress")}
          />
          <StatCard
            label="My Completed Tasks"
            value={myCompletedTasks.length}
            icon="✅"
            trend={{ value: myCompletedTasks.length, isPositive: true }}
            accent="green"
          />
          <StatCard
            label="My Commits"
            value={myCommits}
            icon="🔗"
            trend={{ value: 15, isPositive: true }}
            accent="purple"
          />
          <StatCard
            label="Efficiency Score"
            value={`${myEfficiency}%`}
            icon="⚡"
            trend={{ value: myEfficiency > 80 ? 5 : -3, isPositive: myEfficiency > 80 }}
            accent="amber"
          />
          <StatCard
            label="Hours Logged"
            value={`${myTotalHours}/${myEstimatedHours}h`}
            icon="⏱️"
            trend={{
              value: myEstimatedHours > 0 ? Math.round((myTotalHours / myEstimatedHours) * 100) : 0,
              isPositive: myTotalHours <= myEstimatedHours,
            }}
            accent="blue"
          />
        </div>

        {/* Real GitHub Data Section (Ready for input) */}
        {session.githubToken && (
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
              <GitCommit size={20} color="#22c55e" /> Real GitHub Activity
              {isLoadingRealData && <span style={{ fontSize: "0.8rem", color: "#97a6c0" }}>(Fetching...)</span>}
            </h2>
            
            <div style={{ 
              display: "grid", 
              gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", 
              gap: "20px" 
            }}>
              {realRepos.length > 0 ? (
                realRepos.map(repo => (
                  <div key={repo.id} style={{ 
                    padding: "16px", 
                    background: "rgba(255, 255, 255, 0.03)", 
                    borderRadius: "12px", 
                    border: "1px solid rgba(255, 255, 255, 0.08)" 
                  }}>
                    <div style={{ fontWeight: "700", color: "#e5eefc", marginBottom: "4px" }}>{repo.name}</div>
                    <div style={{ fontSize: "0.8rem", color: "#97a6c0", marginBottom: "12px", height: "2.4em", overflow: "hidden" }}>
                      {repo.description || "No description provided."}
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.75rem" }}>
                      <span style={{ color: "#7dd3fc" }}>{repo.language || "Unknown"}</span>
                      <span style={{ color: "#97a6c0" }}>⭐ {repo.stargazers_count}</span>
                      <a href={repo.html_url} target="_blank" rel="noopener noreferrer" style={{ color: "#3b82f6", textDecoration: "none" }}>View Repo →</a>
                    </div>
                  </div>
                ))
              ) : !isLoadingRealData && (
                <div style={{ color: "#97a6c0", fontSize: "0.9rem", padding: "20px", gridColumn: "1 / -1", textAlign: "center", background: "rgba(255,255,255,0.02)", borderRadius: "12px" }}>
                  Connect GitHub to see your real repositories here.
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
          <CommitHeatmap activity={mockCommitActivity} />
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

        <ProductivityChart metrics={mockProductivityMetrics} />
      </main>

      {/* Task Detail Sidebar */}
      {selectedTask && (
        <TaskDetailSide task={selectedTask} onClose={() => setSelectedTask(null)} />
      )}

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
