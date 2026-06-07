import { useEffect, useState } from "react";
import { RefreshCw } from "lucide-react";

import { fetchUsers } from "../api/fetchUsers.js";
import { fetchPosts } from "../api/fetchPosts.js";
import { fetchTodos } from "../api/fetchTodos.js";
import { fetchTrivia } from "../api/fetchTrivia.js";
import { fetchCountries } from "../api/fetchCountries.js";

import { userStats } from "../modules/userStats.js";
import { postAnalysis } from "../modules/postAnalysis.js";
import { productivityTracker } from "../modules/productivityTracker.js";
import { triviaScorer } from "../modules/triviaScorer.js";
import { countryLookup } from "../modules/countryLookup.js";

import LoadingSpinner from "./shared/LoadingSpinner.jsx";
import OverviewPanel from "./panels/OverviewPanel.jsx";
import UsersPanel from "./panels/UsersPanel.jsx";
import PostsPanel from "./panels/PostsPanel.jsx";
import ProductivityPanel from "./panels/ProductivityPanel.jsx";

const TABS = [
  { id: "overview", label: "Overview" },
  { id: "users", label: "Users" },
  { id: "posts", label: "Posts" },
  { id: "productivity", label: "Productivity" },
  { id: "trivia", label: "Trivia" },
  { id: "countries", label: "Countries" },
];

function PanelPlaceholder({ name, data }) {
  if (!data) {
    return (
      <div
        style={{
          padding: "1.25rem",
          background: "#ffffff",
          borderRadius: "8px",
          border: "1px solid #dde1e8",
          color: "#5c6370",
          fontSize: "0.875rem",
        }}
      >
        <strong style={{ color: "#1a1d26" }}>{name}</strong> panel — data unavailable
      </div>
    );
  }

  return (
    <div
      style={{
        padding: "1.25rem",
        background: "#ffffff",
        borderRadius: "8px",
        border: "1px solid #dde1e8",
        color: "#5c6370",
        fontSize: "0.875rem",
      }}
    >
      <strong style={{ color: "#1a1d26" }}>{name}</strong> panel — data loaded
    </div>
  );
}

async function fetchDashboardData() {
  const start = Date.now();

  const [usersRes, postsRes, todosRes, triviaRes, countriesRes] =
    await Promise.allSettled([
      fetchUsers(),
      fetchPosts(),
      fetchTodos(),
      fetchTrivia(),
      fetchCountries(),
    ]);

  const nextErrors = {};
  const raw = {};

  if (usersRes.status === "fulfilled") {
    raw.users = usersRes.value;
  } else {
    nextErrors.users = usersRes.reason?.message ?? "Unknown error";
  }

  if (postsRes.status === "fulfilled") {
    raw.posts = postsRes.value;
  } else {
    nextErrors.posts = postsRes.reason?.message ?? "Unknown error";
  }

  if (todosRes.status === "fulfilled") {
    raw.todos = todosRes.value;
  } else {
    nextErrors.todos = todosRes.reason?.message ?? "Unknown error";
  }

  if (triviaRes.status === "fulfilled") {
    raw.trivia = triviaRes.value;
  } else {
    nextErrors.trivia = triviaRes.reason?.message ?? "Unknown error";
  }

  if (countriesRes.status === "fulfilled") {
    raw.countries = countriesRes.value;
  } else {
    nextErrors.countries = countriesRes.reason?.message ?? "Unknown error";
  }

  const nextData = {};

  if (raw.users) {
    nextData.users = userStats(raw.users);
  }

  if (raw.posts) {
    nextData.posts = postAnalysis(raw.posts);
  }

  if (raw.users && raw.todos) {
    nextData.productivity = productivityTracker(raw.users, raw.todos);
  } else if (!raw.users && raw.todos) {
    nextErrors.productivity = "Users data required for productivity stats";
  } else if (raw.users && !raw.todos) {
    nextErrors.productivity = "Todos data required for productivity stats";
  }

  if (raw.trivia) {
    nextData.trivia = triviaScorer(raw.trivia);
  }

  if (raw.countries) {
    nextData.countries = countryLookup(raw.countries);
  }

  return {
    dashData: nextData,
    errors: nextErrors,
    loadTime: Date.now() - start,
  };
}

export default function DevPulseDashboard() {
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
        return <PanelPlaceholder name="Trivia" data={dashData.trivia} />;
      case "countries":
        return <PanelPlaceholder name="Countries" data={dashData.countries} />;
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
        <button type="button" className="btn" onClick={loadDashboardData}>
          <RefreshCw size={16} />
          Refresh
        </button>
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
