"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Header } from "@/components/Header";
import { ProjectCard } from "@/components/dashboard/ProjectCard";
import { mockProjects } from "@/lib/mock-data";
import { sortProjectsByPriority } from "@/lib/project-utils";

export default function ProjectListPage() {
  const router = useRouter();
  const projects = sortProjectsByPriority(mockProjects);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(180deg, #071027 0%, #0a1530 40%, #071023 100%)",
        color: "#e5eefc",
      }}
    >
      <Header />

      <main style={{ padding: "40px 24px", maxWidth: "1200px", margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px", gap: "12px", flexWrap: "wrap" }}>
          <div>
            <h1 style={{ fontSize: "2rem", margin: "0 0 6px 0", fontWeight: 800, letterSpacing: "-0.02em" }}>All Projects</h1>
            <p style={{ margin: 0, color: "#97a6c0" }}>Ordered by priority (highest first)</p>
          </div>
          <Link
            href="/manager"
            style={{
              padding: "8px 14px",
              textDecoration: "none",
              background: "rgba(255, 255, 255, 0.1)",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              borderRadius: "8px",
              color: "#e5eefc",
              fontSize: "0.9rem",
              fontWeight: 600,
            }}
          >
            ← Back to manager
          </Link>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "16px",
          }}
        >
          {projects.map((project) => (
            <div key={project.id}>
              <ProjectCard
                project={project}
                onProjectClick={(p) => router.push(`/project/${p.id}`)}
                developerView={false}
              />
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
