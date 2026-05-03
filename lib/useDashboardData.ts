import { useState, useEffect } from "react";
import { Project, Task, Developer, TeamMember, AIUsage, ProductivityMetric, CommitActivity } from "@/lib/dashboard-types";

export function useDashboardData() {
  const [data, setData] = useState<{
    projects: Project[];
    tasks: Task[];
    developers: Developer[];
    teamMembers: TeamMember[];
    aiUsage: AIUsage | null;
    commitActivity: CommitActivity[];
    productivityMetrics: ProductivityMetric[];
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    async function fetchData() {
      try {
        const res = await fetch("/api/dashboard/data");
        if (!res.ok) throw new Error("Failed to fetch data");
        const json = await res.json();
        setData(json);
        setError(null);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchData(); // Initial fetch
    intervalId = setInterval(fetchData, 5000); // Poll every 5s

    return () => clearInterval(intervalId);
  }, []);

  return { data, loading, error };
}
