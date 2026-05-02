import {
  Developer,
  Task,
  Project,
  CommitActivity,
  AIUsage,
  ProductivityMetric,
  TeamMember,
  RiskAlert,
  TeamChat,
} from "./dashboard-types";

// Mock AI Usage (define early so mockDevelopers can use it)
export const mockAIUsage: AIUsage = {
  tokensUsed: 45230,
  tokensLimit: 100000,
  promptsUsed: 342,
  promptsLimit: 1000,
  assistantSessions: 28,
  lastUsed: "2026-04-30T14:23:00Z",
};

// Mock Developers
export const mockDevelopers: Developer[] = [
  {
    id: "dev-1",
    name: "Alice Chen",
    email: "alice@company.com",
    role: "Senior Developer",
    avatar: "👩‍💻",
    skills: ["React", "TypeScript", "Node.js", "PostgreSQL"],
    team: "Backend Team",
    joinDate: "2022-01-15",
  },
  {
    id: "dev-2",
    name: "Bob Smith",
    email: "bob@company.com",
    role: "Full Stack Developer",
    avatar: "👨‍💻",
    skills: ["Next.js", "Python", "AWS", "MongoDB"],
    team: "Full Stack Team",
    joinDate: "2022-06-01",
  },
  {
    id: "dev-3",
    name: "Charlie Brown",
    email: "charlie@company.com",
    role: "Frontend Developer",
    avatar: "👨‍🎨",
    skills: ["React", "Vue.js", "CSS", "Figma"],
    team: "Frontend Team",
    joinDate: "2023-03-10",
  },
  {
    id: "dev-4",
    name: "Diana Prince",
    email: "diana@company.com",
    role: "DevOps Engineer",
    avatar: "👩‍🔧",
    skills: ["Docker", "Kubernetes", "CI/CD", "AWS"],
    team: "DevOps Team",
    joinDate: "2022-09-20",
  },
  {
    id: "ai-1",
    name: "AI Assistant",
    email: "ai@company.com",
    role: "AI Assistant",
    avatar: "🤖",
    skills: ["Automation", "Code Gen", "Review"],
    team: "AI Services",
    joinDate: "2026-01-01",
    aiUsage: mockAIUsage,
  },
];

// Mock Tasks
export const mockTasks: Task[] = [
  {
    id: "task-1",
    title: "Implement authentication module",
    description: "Build JWT-based authentication with refresh tokens",
    status: "in-progress",
    priority: "high",
    dueDate: "2026-05-15",
    assignee: mockDevelopers[0],
    projectId: "proj-1",
    estimatedHours: 16,
    actualHours: 12,
  },
  {
    id: "task-2",
    title: "Design dashboard UI",
    description: "Create responsive Glassmorphism dashboard design",
    status: "completed",
    priority: "high",
    dueDate: "2026-04-30",
    assignee: mockDevelopers[2],
    projectId: "proj-1",
    estimatedHours: 24,
    actualHours: 26,
  },
  {
    id: "task-3",
    title: "Database optimization",
    description: "Optimize query performance and add indexes",
    status: "todo",
    priority: "medium",
    dueDate: "2026-05-22",
    assignee: mockDevelopers[1],
    projectId: "proj-2",
    estimatedHours: 12,
    actualHours: 0,
  },
  {
    id: "task-4",
    title: "API documentation",
    description: "Write comprehensive API docs with examples",
    status: "in-progress",
    priority: "medium",
    dueDate: "2026-05-10",
    assignee: mockDevelopers[0],
    projectId: "proj-1",
    estimatedHours: 8,
    actualHours: 4,
  },
  {
    id: "task-5",
    title: "Deploy to production",
    description: "Set up CI/CD pipeline and deploy",
    status: "review",
    priority: "critical",
    dueDate: "2026-05-05",
    assignee: mockDevelopers[3],
    projectId: "proj-2",
    estimatedHours: 6,
    actualHours: 5,
  },
];

// Mock Team Members with extended info (before mockProjects, as projects need this)
export const mockTeamMembers: TeamMember[] = mockDevelopers.map((dev, idx) => {
  const memberMetrics = [
    {
      departmentProductivity: 97,
      deadlineMetPercentage: 94,
      activeProjects: 4,
      pendingTasks: 2,
      commits: 98,
      efficiency: 86,
      backlog: 1,
      tokensUsed: 1820,
      promptsUsed: 24,
      assistantSessions: 3,
    },
    {
      departmentProductivity: 93,
      deadlineMetPercentage: 91,
      activeProjects: 3,
      pendingTasks: 3,
      commits: 72,
      efficiency: 81,
      backlog: 2,
      tokensUsed: 1460,
      promptsUsed: 19,
      assistantSessions: 2,
    },
    {
      departmentProductivity: 95,
      deadlineMetPercentage: 89,
      activeProjects: 3,
      pendingTasks: 1,
      commits: 64,
      efficiency: 83,
      backlog: 1,
      tokensUsed: 1280,
      promptsUsed: 17,
      assistantSessions: 2,
    },
    {
      departmentProductivity: 90,
      deadlineMetPercentage: 96,
      activeProjects: 2,
      pendingTasks: 1,
      commits: 58,
      efficiency: 88,
      backlog: 0,
      tokensUsed: 960,
      promptsUsed: 11,
      assistantSessions: 1,
    },
    {
      departmentProductivity: 100,
      deadlineMetPercentage: 100,
      activeProjects: 5,
      pendingTasks: 0,
      commits: 120,
      efficiency: 99,
      backlog: 0,
      tokensUsed: 45230,
      promptsUsed: 342,
      assistantSessions: 28,
    },
  ][idx];

  return {
    ...dev,
    manager: "Margaret Johnson",
    departmentProductivity: memberMetrics.departmentProductivity,
    deadline_met_percentage: memberMetrics.deadlineMetPercentage,
    active_projects: memberMetrics.activeProjects,
    pending_tasks: memberMetrics.pendingTasks,
    aiUsage:
      dev.id === "ai-1"
        ? mockAIUsage
        : {
            ...mockAIUsage,
            tokensUsed: memberMetrics.tokensUsed,
            promptsUsed: memberMetrics.promptsUsed,
            assistantSessions: memberMetrics.assistantSessions,
            lastUsed: mockAIUsage.lastUsed,
            tokensLimit: mockAIUsage.tokensLimit,
            promptsLimit: mockAIUsage.promptsLimit,
          },
    contributions: {
      commits: memberMetrics.commits,
      efficiency: memberMetrics.efficiency,
      backlog: memberMetrics.backlog,
    },
  };
});

// Mock Projects
export const mockProjects: Project[] = [
  {
    id: "proj-1",
    name: "Dashboard Platform",
    description: "Enterprise project management dashboard with AI features",
    status: "in-progress",
    startDate: "2026-03-01",
    dueDate: "2026-06-30",
    progress: 65,
    teamMembers: [mockTeamMembers[0], mockTeamMembers[1], mockTeamMembers[2], mockTeamMembers.find(m=>m.id==="ai-1")!],
    tasks: mockTasks.slice(0, 4),
    repository: "https://github.com/company/dashboard",
    commits: 342,
    aiContribution: 12, // 12% contributed by AI
  },
  {
    id: "proj-2",
    name: "Mobile App Redesign",
    description: "Complete redesign of iOS and Android apps",
    status: "in-progress",
    startDate: "2026-02-15",
    dueDate: "2026-05-31",
    progress: 48,
    teamMembers: [mockTeamMembers[1], mockTeamMembers[2], mockTeamMembers[3], mockTeamMembers.find(m=>m.id==="ai-1")!],
    tasks: mockTasks.slice(2, 5),
    repository: "https://github.com/company/mobile",
    commits: 218,
    aiContribution: 8,
  },
  {
    id: "proj-3",
    name: "API Microservices",
    description: "Microservices architecture for backend services",
    status: "planning",
    startDate: "2026-04-01",
    dueDate: "2026-08-31",
    progress: 15,
    teamMembers: [mockTeamMembers[0], mockTeamMembers[1], mockTeamMembers[3], mockTeamMembers.find(m=>m.id==="ai-1")!],
    tasks: [],
    repository: "https://github.com/company/microservices",
    commits: 0,
    aiContribution: 0,
  },
];

// Mock Commit Activity
export const mockCommitActivity: CommitActivity[] = [
  { date: "2026-04-30", count: 8, message: "Major features commit" },
  { date: "2026-04-29", count: 5, message: "Bug fixes" },
  { date: "2026-04-28", count: 3, message: "Documentation updates" },
  { date: "2026-04-27", count: 6, message: "Performance improvements" },
  { date: "2026-04-26", count: 4, message: "UI refinements" },
  { date: "2026-04-25", count: 7, message: "Feature development" },
  { date: "2026-04-24", count: 2, message: "Hotfix deployment" },
];

// Mock Productivity Metrics
export const mockProductivityMetrics: ProductivityMetric[] = [
  { date: "2026-04-24", taskCompleted: 3, commits: 2, hoursWorked: 8, codeQuality: 92 },
  { date: "2026-04-25", taskCompleted: 2, commits: 1, hoursWorked: 7, codeQuality: 88 },
  { date: "2026-04-26", taskCompleted: 4, commits: 3, hoursWorked: 9, codeQuality: 94 },
  { date: "2026-04-27", taskCompleted: 3, commits: 2, hoursWorked: 8, codeQuality: 91 },
  { date: "2026-04-28", taskCompleted: 2, commits: 1, hoursWorked: 6, codeQuality: 89 },
  { date: "2026-04-29", taskCompleted: 5, commits: 4, hoursWorked: 10, codeQuality: 95 },
  { date: "2026-04-30", taskCompleted: 3, commits: 2, hoursWorked: 8, codeQuality: 90 },
];

// Mock Risk Alerts
export const mockRiskAlerts: RiskAlert[] = [
  {
    id: "risk-1",
    projectId: "proj-1",
    severity: "high",
    message: "Project Dashboard Platform is 5 days behind schedule",
    timestamp: "2026-04-30T10:15:00Z",
  },
  {
    id: "risk-2",
    projectId: "proj-2",
    severity: "medium",
    message: "Mobile App Redesign resource allocation needs adjustment",
    timestamp: "2026-04-29T15:45:00Z",
  },
  {
    id: "risk-3",
    projectId: "proj-2",
    severity: "critical",
    message: "Critical bug found in production - immediate review needed",
    timestamp: "2026-04-30T11:20:00Z",
  },
];

// Mock Team Chat
export const mockTeamChat: TeamChat[] = [
  {
    id: "chat-1",
    from: mockDevelopers[0],
    message: "Frontend is ready for integration testing",
    timestamp: "2026-04-30T14:22:00Z",
    channel: "general",
  },
  {
    id: "chat-2",
    from: mockDevelopers[1],
    message: "Database optimization complete, improved query time by 40%",
    timestamp: "2026-04-30T13:45:00Z",
    channel: "backend",
  },
  {
    id: "chat-3",
    from: mockDevelopers[2],
    message: "New design system components deployed",
    timestamp: "2026-04-30T12:30:00Z",
    channel: "frontend",
  },
  {
    id: "chat-4",
    from: mockDevelopers[3],
    message: "CI/CD pipeline updated with new security checks",
    timestamp: "2026-04-30T11:15:00Z",
    channel: "devops",
  },
];
