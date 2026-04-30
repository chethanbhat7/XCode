import { Card } from "@/components/ui/card";

export type StatItem = {
  label: string;
  value: string;
  delta: string;
};

export function StatGrid({ stats }: { stats: StatItem[] }) {
  return (
    <section className="grid stats">
      {stats.map(stat => (
        <div key={stat.label}>
          <Card className="stat">
            <div className="label">{stat.label}</div>
            <div className="value">{stat.value}</div>
            <div className="delta">{stat.delta}</div>
          </Card>
        </div>
      ))}
    </section>
  );
}
