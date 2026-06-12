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

import {
  fetchOverviewData,
  fetchUsersData,
  fetchPostsData,
  fetchProductivityData,
  fetchTriviaData,
  fetchCountriesData,
} from "./DashboardData.js";

const TABS = [
  { id: "overview", label: "Overview" },
  { id: "users", label: "Users" },
  { id: "posts", label: "Posts" },
  { id: "productivity", label: "Productivity" },
  { id: "trivia", label: "Trivia" },
  { id: "countries", label: "Countries" },
];

const TAB_FETCHERS = {
  overview: fetchOverviewData,
  users: fetchUsersData,
  posts: fetchPostsData,
  productivity: fetchProductivityData,
  trivia: fetchTriviaData,
  countries: fetchCountriesData,
};

export default function DevPulseDashboard() {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");
  const [tabData, setTabData] = useState({ loading: true, data: null, errors: {}, loadTime: 0 });

  async function loadTab(tabId) {
    const fetcher = TAB_FETCHERS[tabId];
    if (!fetcher) return;

    setTabData({ loading: true, data: null, errors: {}, loadTime: 0 });

    const result = await fetcher();

    setTabData({
      data: result.data,
      errors: result.errors,
      loadTime: result.loadTime,
      loading: false,
    });
  }


  useEffect(() => {
    loadTab("overview");
  }, []);

  function handleTabClick(tabId) {
    setActiveTab(tabId);
    loadTab(tabId);
  }

  function handleRefresh() {
    loadTab(activeTab);
  }

  const hasErrors = Object.keys(tabData.errors ?? {}).length > 0;

  function renderActivePanel() {
    if (tabData.loading) return <LoadingSpinner />;

    switch (activeTab) {
      case "overview":     return <OverviewPanel data={tabData.data} />;
      case "users":        return <UsersPanel data={tabData.data} />;
      case "posts":        return <PostsPanel data={tabData.data} />;
      case "productivity": return <ProductivityPanel data={tabData.data} />;
      case "trivia":       return <TriviaPanel data={tabData.data} />;
      case "countries":    return <CountriesPanel data={tabData.data} />;
      default:             return null;
    }
  }

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>DevPulse Dashboard</h1>
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          {user && (
            <span style={{ fontSize: "0.875rem", color: "var(--color-text-muted)", fontWeight: 500 }}>
              {user.username}
            </span>
          )}
          <button type="button" className="btn" onClick={handleRefresh} disabled={tabData.loading}>
            <RefreshCw size={16} />
            Refresh
          </button>
          <button
            type="button"
            className="btn"
            onClick={logout}
            style={{ background: "#ef4444" }}
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
          {Object.entries(tabData.errors).map(([module, message]) => (
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
              onClick={() => handleTabClick(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </nav>

        {renderActivePanel()}
      </main>

      <footer className="dashboard-footer">
        <span>
          {tabData.loading ? "Loading…" : `Loaded in ${tabData.loadTime}ms`}
        </span>
      </footer>
    </div>
  );
}