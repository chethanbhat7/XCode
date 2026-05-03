import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export function AIAssistant({ projectId }: { projectId?: string }) {
  const [goal, setGoal] = useState("Build a dashboard for managers and developers with AI-based task assignment and developer usage tracking.");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleGenerate = async () => {
    setLoading(true);
    setMessage("");
    try {
      const res = await fetch("/api/tasks/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ goal, projectId }),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage(`Successfully generated and allocated ${data.tasks.length} tasks! Refresh to view.`);
      } else {
        setMessage(`Error: ${data.error}`);
      }
    } catch (err: any) {
      setMessage(`Failed: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

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
          <p>Split the project goal into setup, core API, dashboard UI, extension sync, and deployment tasks. The AI will automatically assign tasks based on workload and skills.</p>
        </div>
        <div className="form-grid">
          <div className="field" style={{ gridColumn: "1 / -1" }}>
            <label htmlFor="goal">Project goal</label>
            <textarea 
              id="goal" 
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              style={{ minHeight: "80px" }}
            />
          </div>
          
          <Button 
            type="button" 
            onClick={handleGenerate} 
            disabled={loading || !goal}
            style={{ gridColumn: "1 / -1" }}
          >
            {loading ? "Generating & Allocating..." : "Generate & Allocate tasks with AI"}
          </Button>

          {message && (
            <div style={{ 
              gridColumn: "1 / -1", 
              padding: "10px", 
              marginTop: "10px",
              borderRadius: "8px", 
              background: message.includes("Error") || message.includes("Failed") ? "rgba(239,68,68,0.1)" : "rgba(34,197,94,0.1)", 
              color: message.includes("Error") || message.includes("Failed") ? "#ef4444" : "#22c55e",
              fontSize: "0.85rem"
            }}>
              {message}
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
