import { Card } from "@/components/ui/card";

export function UsageChart({ days, values }: { days: string[]; values: number[] }) {
  return (
    <Card className="panel">
      <div className="panel-head">
        <div>
          <h3>AI usage trend</h3>
          <span>Weekly token and chat activity</span>
        </div>
        <span className="chip">Live sync</span>
      </div>
      <div className="mini-chart" aria-label="usage trend chart">
        {values.map((height, index) => (
          <div className="bar-wrap" key={days[index]}>
            <div className="bar" style={{ height: `${height}px`, ["--i" as never]: index + 1 }} />
            <span>{days[index]}</span>
          </div>
        ))}
      </div>
      <div className="footer-note">Use this to show how the extension will report AI activity, token usage, and project-level productivity signals.</div>
    </Card>
  );
}
