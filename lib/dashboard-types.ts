// Developer Dashboard Types
export interface Developer {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
  skills: string[];
  team: string;
  joinDate: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: "todo" | "in-progress" | "review" | "completed";
  priority: "low" | "medium" | "high" | "critical";
  dueDate: string;
  assignee: Developer;
  projectId: string;
  estimatedHours: number;
  actualHours: number;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  status: "planning" | "in-progress" | "review" | "completed";
  startDate: string;
  dueDate: string;
  progress: number;
  teamMembers: Developer[];
  tasks: Task[];
  repository?: string;
  commits?: number;
}

export interface CommitActivity {
  date: string;
  count: number;
  message: string;
}

export interface AIUsage {
  tokensUsed: number;
  tokensLimit: number;
  promptsUsed: number;
  promptsLimit: number;
  assistantSessions: number;
  lastUsed: string;
}

export interface ProductivityMetric {
  date: string;
  taskCompleted: number;
  commits: number;
  hoursWorked: number;
  codeQuality: number;
}

// Manager Dashboard Types
export interface Manager {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
  department: string;
  teamSize: number;
}

export interface TeamMember extends Developer {
  manager: string;
  departmentProductivity: number;
  deadline_met_percentage: number;
  active_projects: number;
  pending_tasks: number;
}

export interface DepartmentMetrics {
  totalProjects: number;
  activeProjects: number;
  completedProjects: number;
  teamSize: number;
  averageProductivity: number;
  avgDeadlineMet: number;
  totalTokensUsed: number;
}

export interface ProjectPhase {
  id: string;
  phase: "planning" | "in-progress" | "review" | "completed";
  projects: Project[];
}

export interface RiskAlert {
  id: string;
  projectId: string;
  severity: "low" | "medium" | "high" | "critical";
  message: string;
  timestamp: string;
}

export interface TeamChat {
  id: string;
  from: Developer;
  message: string;
  timestamp: string;
  channel: string;
}
