import { Link } from "react-router-dom";
import { Building2, LoaderCircle, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NAVIGATION_ITEMS } from "./navigation-items";
import { ROUTES } from "@/routes/constants";

// The layout owns navigation and menu state; this component displays them.
export default function AppSidebar({
  name,
  online,
  version,
  onNavigate,
  onLogout,
  pending,
  isOpen,
  onClose,
  closeButtonRef,
  activePage = "Dashboard",
}) {
  return (
    <aside
      id="app-sidebar"
      className={`dashboard-sidebar${isOpen ? " is-open" : ""}`}
      aria-label="Application sidebar"
    >
      <div className="sidebar-header">
        <Link
          className="sidebar-brand"
          to={ROUTES.DASHBOARD}
          aria-label="Selyek dashboard"
          onClick={onClose}
        >
          SELYEK
        </Link>
        <Button
          ref={closeButtonRef}
          type="button"
          variant="ghost"
          size="icon"
          className="sidebar-close"
          aria-label="Close navigation menu"
          onClick={onClose}
        >
          <X size={20} aria-hidden="true" />
        </Button>
      </div>
      <nav className="sidebar-navigation" aria-label="Main navigation">
        {NAVIGATION_ITEMS.map(({ label, icon: Icon }) => (
          <Button
            variant="ghost"
            key={label}
            className={`sidebar-item${label === activePage ? " is-active" : ""}`}
            aria-current={label === activePage ? "page" : undefined}
            onClick={() => onNavigate(label)}
          >
            <Icon size={19} strokeWidth={1.4} aria-hidden="true" />
            <span>{label}</span>
          </Button>
        ))}
        <Button
          variant="ghost"
          className="sidebar-item sidebar-organization"
          aria-label="Organization"
          onClick={() => onNavigate("Organization")}
        >
          <Building2 size={20} strokeWidth={1.4} aria-hidden="true" />
          <span className="sidebar-organization-label">Organization</span>
        </Button>
      </nav>
      <div className="mobile-sidebar-meta">
        <span role="status">
          Network Status :{" "}
          <span className={online ? "network-online" : "network-offline"}>
            {online ? "Online" : "Offline"}
          </span>
        </span>
        <span className="mobile-sidebar-version">VERSION : {version}</span>
      </div>
      <div className="sidebar-account">
        <Button
          variant="ghost"
          type="button"
          className="sidebar-logout"
          aria-label={`Log out ${name}`}
          title="Log out"
          onClick={onLogout}
          disabled={pending}
          aria-busy={pending}
        >
          {pending ? (
            <LoaderCircle size={19} className="spinner" aria-hidden="true" />
          ) : (
            <span aria-hidden="true">{name.charAt(0).toUpperCase()}</span>
          )}
        </Button>
      </div>
    </aside>
  );
}
