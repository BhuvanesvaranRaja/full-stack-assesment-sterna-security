import { useAuth } from "@/hooks/useAuth";
import AppLayout from "@/components/layout/AppLayout";
import DashboardHeader from "./components/DashboardHeader";
import StatCard from "./components/StatCard";
import DashboardPanel from "./components/DashboardPanel";
import "./Dashboard.css";

const DASHBOARD_STATISTICS = [
  { label: "Total assets", value: 0, color: "blue" },
  { label: "Total locations", value: 1, color: "green" },
  { label: "Total access", value: 0, color: "orange" },
  { label: "Total users", value: 7, color: "pink" },
  { label: "Total lock groups", value: 0, color: "slate" },
  { label: "Total user groups", value: 0, color: "purple" },
];

/**
 * Display the user greeting, configured summary counts, and empty dashboard panels.
 */
export default function Dashboard() {
  const { user } = useAuth();
  const name = user?.name || user?.email?.split("@")[0] || "User";

  return (
    <AppLayout activePage="Dashboard">
      <DashboardHeader name={name} />
      <main id="page-content" className="dashboard-content" tabIndex={-1}>
        <dl className="dashboard-statistics" aria-label="Dashboard totals">
          {DASHBOARD_STATISTICS.map((stat) => (
            <StatCard key={stat.label} {...stat} />
          ))}
        </dl>
        <div className="dashboard-panels">
          <DashboardPanel title="Assets in stock" emptyMessage="No Assets" />
          <DashboardPanel
            title="Highest lock openings (last 7 days)"
            emptyMessage="No data"
          />
          <DashboardPanel title="Lock status count" emptyMessage="No data" />
        </div>
      </main>
    </AppLayout>
  );
}
