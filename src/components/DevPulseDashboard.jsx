import { useEffect, useState } from "react";
import { RefreshCw, LogOut } from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";

import LoadingSpinner from "./shared/LoadingSpinner.jsx";
import OverviewPanel from "./panels/OverviewPanel.jsx";
import UsersPanel from "./panels/UsersPanel.jsx";
import PostsPanel from "./panels/PostsPanel.jsx";
import ProductivityPanel from "./panels/ProductivityPanel.jsx";
import TriviaPanel from "./panels/TriviaPanel.jsx";
import CountriesPanel from "./panels/CountriesPanel.jsx";

import {fetchDashboardData} from "./DashboardData.js"
const TABS = [
  { id: "overview", label: "Overview" },
  { id: "users", label: "Users" },
  { id: "posts", label: "Posts" },
  { id: "productivity", label: "Productivity" },
  { id: "trivia", label: "Trivia" },
  { id: "countries", label: "Countries" },
];

export default function DevPulseDashboard() {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");
  const [dashData, setDashData] = useState({});
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState({});
  const [loadTime, setLoadTime] = useState(0);

  async function loadDashboardData() {
    setLoading(true);
    setErrors({});

    const result = await fetchDashboardData();

    setDashData(result.dashData);
    setErrors(result.errors);
    setLoadTime(result.loadTime);
    setLoading(false);
  }

  useEffect(() => {
    let cancelled = false;

    async function loadOnMount() {
      const result = await fetchDashboardData();

      if (!cancelled) {
        setDashData(result.dashData);
        setErrors(result.errors);
        setLoadTime(result.loadTime);
        setLoading(false);
      }
    }

    loadOnMount();

    return () => {
      cancelled = true;
    };
  }, []);

  const hasErrors = Object.keys(errors).length > 0;

  function renderActivePanel() {
    switch (activeTab) {
      case "overview":
        return <OverviewPanel data={dashData} />;
      case "users":
        return <UsersPanel data={dashData.users} />;
      case "posts":
        return <PostsPanel data={dashData.posts} />;
      case "productivity":
        return <ProductivityPanel data={dashData.productivity} />;
      case "trivia":
        return <TriviaPanel data={dashData.trivia} />;
      case "countries":
        return <CountriesPanel data={dashData.countries} />;
      default:
        return null;
    }
  }

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>DevPulse Dashboard</h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {user && (
            <span style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', fontWeight: 500 }}>
              {user.username}
            </span>
          )}
          <button type="button" className="btn" onClick={loadDashboardData}>
            <RefreshCw size={16} />
            Refresh
          </button>
          <button
            type="button"
            className="btn"
            onClick={logout}
            style={{ background: '#ef4444' }}
            title="Sign out"
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </header>

      {hasErrors && (
        <div className="error-banner" role="alert">
          <strong>Some data failed to load:</strong>
          {Object.entries(errors).map(([module, message]) => (
            <span key={module}>
              {module}: {message}
            </span>
          ))}
        </div>
      )}

      <main className="dashboard-body">
        <nav className="tab-nav" aria-label="Dashboard tabs">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              className={`tab-btn${activeTab === tab.id ? " active" : ""}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </nav>

        {renderActivePanel()}
      </main>

      <footer className="dashboard-footer">
        <span>Loaded in {loadTime}ms</span>
      </footer>
    </div>
  );
}