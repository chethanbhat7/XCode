import Link from "next/link";
import { Header } from "@/components/Header";
import { ProjectDetailView } from "@/components/dashboard/ProjectDetailView";
import { mockProjects } from "@/lib/mock-data";
type ProjectPageProps = {
  searchParams?: Promise<{
    id?: string | string[];
  }>;
};

async function getProjectId(searchParams?: ProjectPageProps["searchParams"]) {
  const resolvedSearchParams = await searchParams;
  const projectId = resolvedSearchParams?.id;
  return Array.isArray(projectId) ? projectId[0] : projectId;
}

export default async function ProjectDetailPage({ searchParams }: ProjectPageProps) {
  const projectId = await getProjectId(searchParams);
  const project = mockProjects.find((p) => p.id === projectId);

  if (!project) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "linear-gradient(180deg, #071027 0%, #0a1530 40%, #071023 100%)",
          color: "#e5eefc",
        }}
      >
        <Header />
        <main style={{ padding: "40px 24px" }}>
          <div style={{ textAlign: "center" }}>
            <h1>Project not found</h1>
            <Link href="/manager" style={{ color: "#7dd3fc", textDecoration: "none" }}>
              Return to dashboard
            </Link>
          </div>
        </main>
      </div>
    );
  }

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
        <Link
          href="/manager"
          style={{
            display: "inline-block",
            marginBottom: "24px",
            padding: "8px 16px",
            textDecoration: "none",
            background: "rgba(255, 255, 255, 0.1)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            borderRadius: "6px",
            color: "#e5eefc",
            fontSize: "0.9rem",
            fontWeight: "600",
          }}
        >
          ← Back
        </Link>
        <ProjectDetailView project={project} />
      </main>
    </div>
  );
}
