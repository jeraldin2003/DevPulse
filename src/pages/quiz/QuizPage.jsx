import { useEffect, useState } from "react";
import { RefreshCw } from "lucide-react";
import { useAuth } from "../../context/AuthContext.jsx";
import QuizPanel from "../../components/panels/QuizPanel.jsx";
import LeaderboardPanel from "../../components/panels/LeaderboardPanel.jsx";
import LoadingSpinner from "../../components/shared/LoadingSpinner.jsx";
import { fetchLeaderboard } from "../../api/quiz.js";

const TABS = [
  { id: "quiz", label: "Play Quiz" },
  { id: "leaderboard", label: "Leaderboard" },
];

export default function QuizPage() {
  const { accessToken, user } = useAuth();
  const [activeTab, setActiveTab] = useState("quiz");
  const [leaderboardData, setLeaderboardData] = useState({
    loading: false,
    top10: [],
    currentUser: null,
    error: null,
  });

  const loadLeaderboard = async () => {
    setLeaderboardData((prev) => ({ ...prev, loading: true, error: null }));
    try {
      const result = await fetchLeaderboard(accessToken, user);
      if (result.success) {
        setLeaderboardData({
          loading: false,
          top10: result.data.top10 || [],
          currentUser: result.data.currentUser || null,
          error: null,
        });
      } else {
        throw new Error(result.error || "Failed to load leaderboard");
      }
    } catch (err) {
      setLeaderboardData({
        loading: false,
        top10: [],
        currentUser: null,
        error: err.message || "An error occurred",
      });
    }
  };

  useEffect(() => {
    if (activeTab === "leaderboard") {
      loadLeaderboard();
    }
  }, [activeTab]);

  const handleTabClick = (tabId) => {
    setActiveTab(tabId);
  };

  const handleRefresh = () => {
    if (activeTab === "leaderboard") {
      loadLeaderboard();
    }
  };

  const renderActiveContent = () => {
    if (activeTab === "quiz") {
      return <QuizPanel />;
    }

    if (activeTab === "leaderboard") {
      if (leaderboardData.loading) {
        return <LoadingSpinner />;
      }
      if (leaderboardData.error) {
        return (
          <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-sm">
            {leaderboardData.error}
          </div>
        );
      }
      return (
        <LeaderboardPanel
          top10={leaderboardData.top10}
          currentUser={leaderboardData.currentUser}
        />
      );
    }

    return null;
  };

  return (
    <div className="flex flex-col min-h-screen pb-12">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-slate-800 tracking-tight">
          {activeTab === "quiz" ? "Trivia Quiz" : "Quiz Leaderboard"}
        </h1>
        {activeTab === "leaderboard" && (
          <button
            type="button"
            className="inline-flex items-center gap-1.5 px-4 py-1.5 border border-slate-200 rounded-lg bg-white hover:bg-slate-50 text-slate-600 font-medium text-sm transition-colors duration-150 cursor-pointer disabled:opacity-50"
            onClick={handleRefresh}
            disabled={leaderboardData.loading}
          >
            <RefreshCw size={16} className={leaderboardData.loading ? "animate-spin" : ""} />
            Refresh
          </button>
        )}
      </div>

      <nav className="flex flex-wrap gap-2 mb-6" aria-label="Quiz page tabs">
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

      <main className="flex-1">
        {renderActiveContent()}
      </main>

      <footer className="flex items-center justify-center pt-6 mt-8 border-t border-slate-200 text-slate-400 text-xs">
        <span>DevPulse Trivia Quiz</span>
      </footer>
    </div>
  );
}
