import { Badge } from "@/components/ui/badge";

export function Sidebar({ role, taskCount }: { role: string; taskCount: number }) {
  return (
    <aside>
      <div className="brand">
        <div className="brand-mark">X</div>
        <div>
          <h1>X Code</h1>
          <p>AI project control center</p>
        </div>
      </div>

      <div className="nav-section">
        <div className="nav-label">Workspace</div>
        <button className="nav-item active" type="button">
          <div className="meta">
            <span className="title">Dashboard</span>
            <span className="sub">Project health and usage</span>
          </div>
          <Badge>{role === "developer" ? "Developer" : "Manager"}</Badge>
        </button>
        <button className="nav-item" type="button">
          <div className="meta">
            <span className="title">Tasks</span>
            <span className="sub">Assign and track work</span>
          </div>
          <Badge>{taskCount}</Badge>
        </button>
        <button className="nav-item" type="button">
          <div className="meta">
            <span className="title">AI Planner</span>
            <span className="sub">Break goals into tasks</span>
          </div>
          <Badge>Beta</Badge>
        </button>
        <button className="nav-item" type="button">
          <div className="meta">
            <span className="title">Usage</span>
            <span className="sub">Tokens and activity</span>
          </div>
          <Badge>Live</Badge>
        </button>
      </div>

      <div className="sidebar-card">
        <h3>Today’s focus</h3>
        <p>Ship the manager dashboard first, then connect the VS Code extension for developer activity and AI usage telemetry.</p>
      </div>

      <div className="sidebar-card">
        <h3>Project snapshot</h3>
        <p>2 active projects, 14 open tasks, 68% completion, 3 blockers, 1 AI review pending.</p>
      </div>
    </aside>
  );
}
