import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function DashboardPanel({ title, emptyMessage }) {
  return (
    <Card className="dashboard-panel" aria-label={title}>
      <CardHeader className="dashboard-panel-header">
        <h2>{title}</h2>
      </CardHeader>
      <CardContent className="dashboard-panel-content">
        <p>{emptyMessage}</p>
      </CardContent>
    </Card>
  );
}
