import Link from "next/link";
import { Header } from "@/components/Header";
import { ProjectDetailView } from "@/components/dashboard/ProjectDetailView";
import { getDatabase } from "@/lib/db";

type ProjectDetailByIdProps = {
  params?: Promise<{ id?: string | string[] }>;
};

async function getProjectId(params?: ProjectDetailByIdProps["params"]) {
  const resolvedParams = await params;
  const id = resolvedParams?.id;
  return Array.isArray(id) ? id[0] : id;
}

export default async function ProjectDetailById({ params }: ProjectDetailByIdProps) {
  const projectId = await getProjectId(params);
  
  const db = await getDatabase();
  const project = await db.collection("projects").findOne({ id: projectId });

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

  // Next.js server components pass plain objects down. MongoDB documents contain `_id` which is not plain object.
  const serializedProject = JSON.parse(JSON.stringify(project));

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(180deg, #071027 0%, #0a1530 40%, #071023 100%)",
        color: "#e5eefc",
      }}
    >
      <Header />
      <main style={{ padding: "24px 0" }}>
        <div style={{ paddingLeft: "24px", paddingRight: "24px", marginBottom: "24px" }}>
          <Link
            href="/manager"
            style={{
              display: "inline-block",
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
        </div>
        <ProjectDetailView project={serializedProject} />
      </main>
    </div>
  );
}
