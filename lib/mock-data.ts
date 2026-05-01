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
export const mockTeamMembers: TeamMember[] = mockDevelopers.map((dev, idx) => ({
  ...dev,
  manager: "Margaret Johnson",
  departmentProductivity: 85 + Math.random() * 15,
  deadline_met_percentage: 90 - Math.random() * 10,
  active_projects: Math.floor(2 + Math.random() * 3),
  pending_tasks: Math.floor(1 + Math.random() * 5),
  aiUsage: dev.id === "ai-1" ? mockAIUsage : { ...mockAIUsage, tokensUsed: Math.floor(Math.random()*2000), promptsUsed: Math.floor(Math.random()*30), assistantSessions: Math.floor(Math.random()*5), lastUsed: mockAIUsage.lastUsed, tokensLimit: mockAIUsage.tokensLimit, promptsLimit: mockAIUsage.promptsLimit },
  contributions: {
    commits: Math.floor(10 + Math.random() * 120),
    efficiency: Math.floor(60 + Math.random() * 30),
    backlog: Math.floor(Math.random() * 6),
  },
}));

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
