import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";

export function AIAssistant() {
  return (
    <Card className="panel">
      <div className="panel-head">
        <div>
          <h3>AI task assistant</h3>
          <span>Manager prompt to task list</span>
        </div>
      </div>
      <div className="ai-box">
        <div className="ai-suggestion">
          <h4>Suggested breakdown</h4>
          <p>Split the project goal into setup, core API, dashboard UI, extension sync, and deployment tasks. Ask the manager to approve before assigning.</p>
        </div>
        <div className="form-grid">
          <div className="field">
            <label htmlFor="goal">Project goal</label>
            <textarea id="goal" defaultValue="Build a dashboard for managers and developers with AI-based task assignment and developer usage tracking." />
          </div>
          <div className="field">
            <label htmlFor="owner">Assign to</label>
            <Select id="owner" defaultValue="Dev A">
              <option>Dev A</option>
              <option>Dev B</option>
              <option>Dev C</option>
            </Select>
          </div>
          <div className="field">
            <label htmlFor="priority">Priority</label>
            <Select id="priority" defaultValue="High">
              <option>High</option>
              <option>Medium</option>
              <option>Low</option>
            </Select>
          </div>
          <Button type="button">Generate tasks</Button>
        </div>
      </div>
    </Card>
  );
}
