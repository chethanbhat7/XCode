export const dashboardData = {
  stats: [
    { label: "Active projects", value: "02", delta: "+1 this week" },
    { label: "Open tasks", value: "14", delta: "5 ready for assignment" },
    { label: "Token usage", value: "82%", delta: "Within team limit" },
    { label: "Blockers", value: "03", delta: "1 needs immediate review" }
  ],
  tasks: [
    {
      title: "AI task split: onboarding flow",
      status: "Review",
      description: "Break the onboarding epic into API, UI, validation, and analytics tasks for the next sprint.",
      tags: ["4 subtasks", "Est. 2.5 days", "Ready for manager approval"],
      tone: ["blue", "", "green"]
    },
    {
      title: "Task assignment: usage telemetry",
      status: "Assigned",
      description: "Assigned to Dev A with VS Code extension telemetry enabled for prompt count, token usage, and blocker signals.",
      tags: ["Developer linked", "Priority high"],
      tone: ["blue", ""]
    },
    {
      title: "QA and release readiness",
      status: "Blocked",
      description: "Waiting on regression test results and deployment approval before release can be marked ready.",
      tags: ["1 blocker", "Needs update"],
      tone: ["", "yellow"]
    }
  ],
  activity: [
    {
      title: "Manager approved AI split",
      copy: "Created 4 subtasks from the onboarding epic and queued them for assignment.",
      tone: "brand"
    },
    {
      title: "Developer synced VS Code usage",
      copy: "Prompt count, token usage, and current task context were sent from the extension.",
      tone: "success"
    },
    {
      title: "Blocker flagged for review",
      copy: "QA needs regression results before release planning can continue.",
      tone: "warning"
    }
  ],
  usageChart: [56, 92, 74, 126, 98, 136, 112],
  usageDays: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
};
