import { Card } from "@/components/ui/card";

export default function StatCard({ label, value, color }) {
  return (
    <Card className={`dashboard-stat dashboard-stat-${color} border-0`}>
      <dt>{label}</dt>
      <dd>{value}</dd>
    </Card>
  );
}
