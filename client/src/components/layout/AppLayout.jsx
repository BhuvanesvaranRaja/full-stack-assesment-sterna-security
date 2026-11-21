import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Menu } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useOnlineStatus } from "@/hooks/useOnlineStatus";
import { ROUTES } from "@/routes/constants";
import AppSidebar from "./AppSidebar";
import InfoDialog from "@/components/InfoDialog";
import { Button } from "@/components/ui/button";
import "./AppLayout.css";

/**
 * Render the shared sidebar, mobile menu, footer, and page content, and handle navigation and logout.
 */
export default function AppLayout({ activePage, className = "", children }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const online = useOnlineStatus();

  const [pending, setPending] = useState(false);
  const [section, setSection] = useState("");
  const [year] = useState(() => new Date().getFullYear());
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const menuButtonRef = useRef(null);
  const closeButtonRef = useRef(null);
  const appVersion = "2.0.2";

  const name = user?.name || user?.email?.split("@")[0] || "User";

  useEffect(() => {
    if (!sidebarOpen) return undefined;

    // Stop background scrolling and move focus into the open mobile sidebar.
    const menuButton = menuButtonRef.current;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function handleKeyDown(event) {
      if (event.key === "Escape") {
        setSidebarOpen(false);
      }
    }

    const frame = window.requestAnimationFrame(() =>
      closeButtonRef.current?.focus(),
    );
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
      // Return keyboard focus to the menu trigger when the sidebar closes.
      menuButton?.focus();
    };
  }, [sidebarOpen]);

  /**
   * Close the mobile menu and log out while tracking the pending request.
   */
  async function signOut() {
    setSidebarOpen(false);
    setPending(true);
    try {
      await logout();
    } catch {
      // The API interceptor displays request errors.
    } finally {
      setPending(false);
    }
  }

  // Open implemented pages or show a placeholder for unfinished sections.
  /**
   * Close the sidebar and open the selected page or its unavailable-section dialog.
   */
  function onNavigate(label) {
    setSidebarOpen(false);
    if (label === "Dashboard") navigate(ROUTES.DASHBOARD);
    else if (label === "Locations") navigate(ROUTES.LOCATIONS);
    else setSection(label);
  }

  return (
    <div className={`dashboard-shell ${className}`}>
      <a className="dashboard-skip-link" href="#page-content">
        Skip to content
      </a>
      {sidebarOpen && (
        <button
          type="button"
          className="sidebar-backdrop"
          aria-label="Close navigation menu"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      <AppSidebar
        activePage={activePage}
        name={name}
        online={online}
        version={appVersion}
        pending={pending}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        closeButtonRef={closeButtonRef}
        onLogout={signOut}
        onNavigate={onNavigate}
      />
      <div className="dashboard-workspace">
        <div className="mobile-app-bar">
          <Button
            ref={menuButtonRef}
            type="button"
            variant="ghost"
            size="icon"
            className="mobile-menu-trigger"
            aria-label="Open navigation menu"
            aria-expanded={sidebarOpen}
            aria-controls="app-sidebar"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu size={21} aria-hidden="true" />
          </Button>
          <span className="mobile-app-brand">SELYEK</span>
        </div>
        {children}
        <footer
          className={`dashboard-footer${activePage === "Dashboard" ? " dashboard-footer-centered" : ""}`}
        >
          <span className="dashboard-footer-status" role="status">
            Network Status :{" "}
            <span className={online ? "network-online" : "network-offline"}>
              {online ? "Online" : "Offline"}
            </span>
          </span>
          <span className="dashboard-copyright">
            Copyright © {year} Sterna Security Devices Private Limited. All
            rights reserved.
          </span>
          {activePage === "Locations" && (
            <span className="app-version">VERSION : {appVersion}</span>
          )}
        </footer>
      </div>
      {section && (
        <InfoDialog title={section} onClose={() => setSection("")}>
          This section is not available yet.
        </InfoDialog>
      )}
    </div>
  );
}
