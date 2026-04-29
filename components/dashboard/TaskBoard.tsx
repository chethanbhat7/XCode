import { Card } from "@/components/ui/card";

export type TaskItem = {
  title: string;
  status: string;
  description: string;
  tags: string[];
  tone: string[];
};

function statusClass(status: string) {
  if (status === "Blocked") return "red";
  if (status === "Assigned") return "green";
  return "yellow";
}

export function TaskBoard({ tasks }: { tasks: TaskItem[] }) {
  return (
    <Card className="panel">
      <div className="panel-head">
        <div>
          <h3>Project progress</h3>
          <span>Alpha release timeline</span>
        </div>
        <span className="chip">68% complete</span>
      </div>

      <div className="progress-wrap">
        <div className="progress-line"><div className="progress-bar" /></div>
        <div className="progress-meta">
          <span>Planning</span>
          <span>Development</span>
          <span>Testing</span>
          <span>Release</span>
        </div>
      </div>

      <div className="task-list">
        {tasks.map(task => (
          <div className="task" key={task.title}>
            <div className="task-top">
              <div className="task-title">{task.title}</div>
              <span className={`tag ${statusClass(task.status)}`}>{task.status}</span>
            </div>
            <div className="task-desc">{task.description}</div>
            <div className="tag-row">
              {task.tags.map((tag, index) => (
                <span className={`tag ${task.tone[index] || ""}`} key={tag}>
                  {tag}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
