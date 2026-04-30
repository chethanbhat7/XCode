import Link from "next/link";
import { Header } from "@/components/Header";
import { TeamMemberDetail } from "@/components/dashboard/TeamMemberDetail";
import { mockTeamMembers } from "@/lib/mock-data";
type TeamMemberPageProps = {
  searchParams?: Promise<{
    id?: string | string[];
  }>;
};

async function getMemberId(searchParams?: TeamMemberPageProps["searchParams"]) {
  const resolvedSearchParams = await searchParams;
  const memberId = resolvedSearchParams?.id;
  return Array.isArray(memberId) ? memberId[0] : memberId;
}

export default async function TeamMemberDetailPage({ searchParams }: TeamMemberPageProps) {
  const memberId = await getMemberId(searchParams);
  const member = mockTeamMembers.find((m) => m.id === memberId);

  if (!member) {
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
            <h1>Team member not found</h1>
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
      <main style={{ padding: "40px 24px", maxWidth: "1000px", margin: "0 auto" }}>
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
        <TeamMemberDetail member={member} />
      </main>
    </div>
  );
}
