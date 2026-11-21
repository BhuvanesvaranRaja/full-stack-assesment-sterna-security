import { useEffect, useState } from "react";

/**
 * Display a time-based greeting and a local date and clock that update every second.
 */
export default function DashboardHeader({ name }) {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);
  const hour = now.getHours();
  const greeting =
    hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";
  return (
    <header className="dashboard-header">
      <h1>Dashboard</h1>
      <div className="dashboard-greeting">
        <p>
          {greeting}, <strong>{name}</strong>
        </p>
        <time dateTime={now.toISOString()}>
          {now.toLocaleDateString("en-GB", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
          ,{" "}
          {now
            .toLocaleTimeString("en-US", {
              hour: "numeric",
              minute: "2-digit",
              second: "2-digit",
              hour12: true,
            })
            .toLowerCase()}
        </time>
      </div>
    </header>
  );
}
