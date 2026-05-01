import { Project } from "./dashboard-types";

export function projectPriorityScore(p: Project) {
  const scoreMap: Record<string, number> = { critical: 30, high: 20, medium: 10, low: 0 };
  if (!p.tasks || p.tasks.length === 0) return 0 + (p.progress || 0);
  const maxTaskPriority = Math.max(...p.tasks.map((t) => scoreMap[t.priority] ?? 0));
  const openTasks = p.tasks.filter((t) => t.status !== "completed").length;
  return maxTaskPriority + (p.progress || 0) + openTasks * 2;
}

export function sortProjectsByPriority(projects: Project[]) {
  return [...projects].sort((a, b) => projectPriorityScore(b) - projectPriorityScore(a));
}
