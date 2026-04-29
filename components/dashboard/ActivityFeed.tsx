import { Card } from "@/components/ui/card";

export type ActivityItem = {
  title: string;
  copy: string;
  tone: "brand" | "success" | "warning";
};

export function ActivityFeed({ items }: { items: ActivityItem[] }) {
  return (
    <Card className="panel">
      <div className="panel-head">
        <div>
          <h3>Recent activity</h3>
          <span>Latest manager and dev events</span>
        </div>
      </div>
      <div className="activity">
        {items.map(item => (
          <div className="activity-item" key={item.title}>
            <div className={`dot ${item.tone === "success" ? "success" : item.tone === "warning" ? "warning" : "blue"}`} />
            <div>
              <strong>{item.title}</strong>
              <p>{item.copy}</p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
