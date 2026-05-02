import { Task, TeamMember } from "./dashboard-types";

/**
 * Task Allocation Engine - Assigns tasks to developers based on:
 * - Current workload
 * - Skill compatibility
 * - Past performance (efficiency)
 * - Priority level
 */

export interface AllocationScore {
  member: TeamMember;
  score: number;
  reasoning: string;
  workload: number;
  skillMatch: number;
  efficiencyFactor: number;
}

/**
 * Calculate skill match between task requirements and developer skills
 * Based on role and past performance
 */
function calculateSkillMatch(task: Task, member: TeamMember): number {
  const taskKeywords = task.title.toLowerCase() + " " + task.description.toLowerCase();
  const memberRole = member.role.toLowerCase();

  let score = 0.5; // Base score

  // Role-based skill matching
  if (
    memberRole.includes("senior") ||
    memberRole.includes("lead") ||
    memberRole.includes("architect")
  ) {
    score += 0.2; // Senior developers get higher score for complex tasks
  }

  if (
    memberRole.includes("frontend") &&
    (taskKeywords.includes("ui") || taskKeywords.includes("design") || taskKeywords.includes("frontend"))
  ) {
    score += 0.2;
  }

  if (
    memberRole.includes("backend") &&
    (taskKeywords.includes("api") ||
      taskKeywords.includes("database") ||
      taskKeywords.includes("backend") ||
      taskKeywords.includes("auth"))
  ) {
    score += 0.2;
  }

  if (
    memberRole.includes("full stack") &&
    (taskKeywords.includes("feature") || taskKeywords.includes("implementation"))
  ) {
    score += 0.15;
  }

  return Math.min(score, 1);
}

/**
 * Calculate current workload (normalized 0-1, where 1 is overloaded)
 */
function calculateWorkload(member: TeamMember, projectTasks: Task[]): number {
  const memberTasks = projectTasks.filter(
    (t) => t.assignee?.id === member.id && t.status !== "completed"
  );
  const totalHours = memberTasks.reduce((sum, t) => sum + (t.estimatedHours || 0), 0);
  const maxCapacity = 40; // 40 hour/week capacity
  return Math.min(totalHours / maxCapacity, 1);
}

/**
 * Calculate efficiency factor based on past performance
 * Uses actual vs estimated hours ratio
 */
function calculateEfficiencyFactor(member: TeamMember, projectTasks: Task[]): number {
  const completedTasks = projectTasks.filter(
    (t) => t.assignee?.id === member.id && t.status === "completed"
  );

  if (completedTasks.length === 0) return 0.8; // Default for new members

  let totalEfficiency = 0;
  for (const task of completedTasks) {
    const ratio = Math.min(task.actualHours || 0, task.estimatedHours || 1) /
      (task.estimatedHours || 1) || 1;
    totalEfficiency += Math.min(ratio, 1);
  }

  return totalEfficiency / completedTasks.length;
}

/**
 * Main allocation function - returns sorted list of candidates with scores
 */
export function allocateTask(
  task: Task,
  teamMembers: TeamMember[],
  projectTasks: Task[]
): AllocationScore[] {
  const scores: AllocationScore[] = [];

  for (const member of teamMembers) {
    if (member.id === "ai-1") continue; // Skip AI member for allocation

    const skillMatch = calculateSkillMatch(task, member);
    const workload = calculateWorkload(member, projectTasks);
    const efficiencyFactor = calculateEfficiencyFactor(member, projectTasks);

    // Final score calculation
    // Lower workload = higher score
    // Higher skill match = higher score
    // Higher efficiency = higher score
    const score =
      skillMatch * 0.5 + // 50% weight on skill match
      (1 - workload) * 0.3 + // 30% weight on available capacity
      efficiencyFactor * 0.2; // 20% weight on efficiency

    // Apply priority multiplier
    const priorityMultiplier =
      task.priority === "critical"
        ? 1.2
        : task.priority === "high"
          ? 1.1
          : task.priority === "low"
            ? 0.9
            : 1;

    const finalScore = score * priorityMultiplier;

    scores.push({
      member,
      score: finalScore,
      reasoning: generateReasoningText(member, skillMatch, workload, efficiencyFactor),
      workload,
      skillMatch,
      efficiencyFactor,
    });
  }

  // Sort by score (highest first)
  return scores.sort((a, b) => b.score - a.score);
}

/**
 * Get the best candidate for a task
 */
export function getBestCandidate(
  task: Task,
  teamMembers: TeamMember[],
  projectTasks: Task[]
): TeamMember | null {
  const scores = allocateTask(task, teamMembers, projectTasks);
  return scores.length > 0 ? scores[0].member : null;
}

/**
 * Generate human-readable reasoning for allocation
 */
function generateReasoningText(
  member: TeamMember,
  skillMatch: number,
  workload: number,
  efficiency: number
): string {
  const parts: string[] = [];

  if (skillMatch > 0.7) {
    parts.push("Excellent skill match");
  } else if (skillMatch > 0.5) {
    parts.push("Good skill alignment");
  }

  if (workload < 0.5) {
    parts.push("Available capacity");
  } else if (workload > 0.8) {
    parts.push("Currently overloaded");
  }

  if (efficiency > 0.9) {
    parts.push("High performer");
  } else if (efficiency < 0.7) {
    parts.push("Needs support");
  }

  return parts.join(" • ") || "Available";
}
