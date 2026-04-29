"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { StatGrid } from "@/components/dashboard/StatGrid";
import { TaskBoard } from "@/components/dashboard/TaskBoard";
import { UsageChart } from "@/components/dashboard/UsageChart";
import { ActivityFeed } from "@/components/dashboard/ActivityFeed";
import { AIAssistant } from "@/components/dashboard/AIAssistant";
import { dashboardData } from "@/lib/dashboard-data";
import { clearSession } from "@/lib/session";

export function DashboardView({ role }: { role: "manager" | "developer" }) {
  const router = useRouter();

  const heroTitle =
    role === "developer"
      ? "Developer workspace for task context, AI chat, and usage telemetry"
      : "Manager dashboard for project control, AI task creation, and developer usage";

  const heroCopy =
    role === "developer"
      ? "This view shows assigned tasks, extension sync, token usage, and current blockers so managers and developers stay aligned."
      : "This starter view gives you the first expected dashboard experience: project health, task assignment, AI suggestions, token usage, and team activity in one place.";

  function handleLogout() {
    clearSession();
    router.push("/");
  }

  return (
    <div className="shell">
      <Sidebar role={role} taskCount={dashboardData.tasks.length} />

      <main>
        <div className="mobile-header">
          <div className="title">PulseBoard</div>
          <div className="sub">AI project dashboard for managers and developers</div>
        </div>

        <div className="topbar">
          <div className="hero">
            <h2>{heroTitle}</h2>
            <p>{heroCopy}</p>
          </div>
          <div className="actions">
            <Input type="search" placeholder="Search projects, tasks, or developers" />
            <Button variant="secondary" type="button">Preview report</Button>
            <Button type="button">Create task with AI</Button>
            <Button variant="secondary" type="button" onClick={handleLogout}>Logout</Button>
          </div>
        </div>

        <StatGrid stats={dashboardData.stats} />

        <section className="grid content-grid">
          <div className="grid" style={{ gap: 18 }}>
            <TaskBoard tasks={dashboardData.tasks} />
            <UsageChart days={dashboardData.usageDays} values={dashboardData.usageChart} />
          </div>

          <div className="grid" style={{ gap: 18 }}>
            <AIAssistant />
            <ActivityFeed items={dashboardData.activity} />
          </div>
        </section>
      </main>
    </div>
  );
}