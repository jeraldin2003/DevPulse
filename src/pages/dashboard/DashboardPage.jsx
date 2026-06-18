import { useEffect, useState } from "react";
import { RefreshCw } from "lucide-react";

import LoadingSpinner from "../../components/shared/LoadingSpinner.jsx";
import OverviewPanel from "../../components/panels/OverviewPanel.jsx";
import UsersPanel from "../../components/panels/UsersPanel.jsx";
import PostsPanel from "../../components/panels/PostsPanel.jsx";
import ProductivityPanel from "../../components/panels/ProductivityPanel.jsx";
import TriviaPanel from "../../components/panels/TriviaPanel.jsx";
import CountriesPanel from "../../components/panels/CountriesPanel.jsx";

import {
  fetchOverviewData,
  fetchUsersData,
  fetchPostsData,
  fetchProductivityData,
  fetchTriviaData,
} from "./DashboardData.js"

const TABS = [
  { id: "overview", label: "Overview" },
  { id: "users", label: "Users" },
  { id: "posts", label: "Posts" },
  { id: "productivity", label: "Productivity" },
  { id: "trivia", label: "Trivia" },
];

const TAB_FETCHERS = {
  overview: fetchOverviewData,
  users: fetchUsersData,
  posts: fetchPostsData,
  productivity: fetchProductivityData,
  trivia: fetchTriviaData,
};

export default function DashboardPage() {
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
      case "overview": return <OverviewPanel data={tabData.data} />;
      case "users": return <UsersPanel data={tabData.data} />;
      case "posts": return <PostsPanel data={tabData.data} />;
      case "productivity": return <ProductivityPanel data={tabData.data} />;
      case "trivia": return <TriviaPanel data={tabData.data} />;
      default: return null;
    }
  }

  return (
    <div className="flex flex-col min-h-screen pb-12">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Dashboard Overview</h1>
        <button
          type="button"
          className="inline-flex items-center gap-1.5 px-4 py-1.5 border border-slate-200 rounded-lg bg-white hover:bg-slate-50 text-slate-600 font-medium text-sm transition-colors duration-150 cursor-pointer disabled:opacity-50"
          onClick={handleRefresh}
          disabled={tabData.loading}
        >
          <RefreshCw size={16} />
          Refresh
        </button>
      </div>

      {hasErrors && (
        <div className="flex flex-col gap-1.5 p-4 mb-6 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-sm" role="alert">
          <strong className="font-semibold">Some data failed to load:</strong>
          {Object.entries(tabData.errors).map(([module, message]) => (
            <span key={module}>
              {module}: {message}
            </span>
          ))}
        </div>
      )}

      <main className="flex-1">
        <nav className="flex flex-wrap gap-2 mb-6" aria-label="Dashboard tabs">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              className={
                activeTab === tab.id
                  ? "px-4 py-2 rounded-lg bg-blue-600 text-white font-medium text-sm shadow-sm transition-all duration-150 cursor-pointer"
                  : "px-4 py-2 border border-slate-200 rounded-lg bg-white text-slate-600 hover:bg-slate-50 font-medium text-sm transition-all duration-150 cursor-pointer"
              }
              onClick={() => handleTabClick(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </nav>

        {renderActivePanel()}
      </main>

      <footer className="flex items-center justify-center pt-6 mt-8 border-t border-slate-200 text-slate-400 text-xs">
        <span>
          {tabData.loading ? "Loading…" : `Loaded in ${tabData.loadTime}ms`}
        </span>
      </footer>
    </div>
  );
}
