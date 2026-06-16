import { useState, useEffect } from 'react';
import CountriesPanel from './panels/CountriesPanel';
import OverviewPanel from './panels/OverviewPanel';
import PostsPanel from './panels/PostsPanel';
import ProductivityPanel from './panels/ProductivityPanel';
import TriviaPanel from './panels/TriviaPanel';
import UsersPanel from './panels/UsersPanel';
import { fetchOverviewData, fetchCountriesData, fetchPostsData, fetchUsersData, fetchTriviaData, fetchProductivityData } from './DashboardData';
import LoadingSpinner from './shared/LoadingSpinner';

function Nav({ setReload, setLoadingStatus, setIsAuthenticated }) {
  return (
    <div className="flex justify-between items-center py-6 border-b border-slate-200 mb-6">
      <h1 className="text-2xl font-bold text-slate-800 tracking-tight">
        DevPulse Dashboard
      </h1>
      <div className="flex gap-2">
        <button
          onClick={() => {
            setLoadingStatus(true);
            setReload(prev => prev + 1);
          }}
          className="px-4 py-1.5 border border-slate-200 rounded-lg bg-white text-slate-600 hover:bg-slate-50 font-medium text-sm transition-colors duration-150 cursor-pointer"
        >
          Refresh
        </button>
        <button
          onClick={() => {
            setIsAuthenticated("login");
          }}
          className="px-4 py-1.5 border border-rose-200 rounded-lg bg-rose-50 hover:bg-rose-100/70 text-rose-600 font-medium text-sm transition-colors duration-150 cursor-pointer"
        >
          Logout
        </button>
      </div>
    </div>
  );
}

function GiveMeButtons({ setReload, activePanel, setActivePanel, setLoadingStatus }) {
  const BUTTONS = [
    "Overview",
    "Users",
    "Posts",
    "Productivity",
    "Trivia",
    "Countries"
  ];

  return (
    <div className="flex flex-wrap gap-2 mb-6">
      {BUTTONS.map((button, index) => {
        const isActive = activePanel === button;
        return (
          <button
            key={index}
            onClick={() => {
              setLoadingStatus(true);
              if (activePanel === button) {
                setReload(prev => prev + 1);
              } else {
                setActivePanel(button);
              }
            }}
            className={
              isActive
                ? "px-4 py-2 rounded-lg bg-blue-600 text-white font-medium text-sm shadow-sm transition-all duration-150 cursor-pointer"
                : "px-4 py-2 border border-slate-200 rounded-lg bg-white text-slate-600 hover:bg-slate-50 font-medium text-sm transition-all duration-150 cursor-pointer"
            }
          >
            {button}
          </button>
        );
      })}
    </div>
  );
}

export default function Dashboard({ setIsAuthenticated }) {
  const [activePanel, setActivePanel] = useState("Overview");
  const [activePanelData, setActivePanelData] = useState("Loading....");
  const [loadingStatus, setLoadingStatus] = useState(true);
  const [reload, setReload] = useState(0);

  useEffect(() => {
    async function getsPanelData() {
      let panelData = null;
      switch (activePanel) {
        case "Overview":
          panelData = await fetchOverviewData();
          setLoadingStatus(false);
          break;
        case "Users":
          panelData = await fetchUsersData();
          setLoadingStatus(false);
          break;
        case "Posts":
          panelData = await fetchPostsData();
          setLoadingStatus(false);
          break;
        case "Productivity":
          panelData = await fetchProductivityData();
          setLoadingStatus(false);
          break;
        case "Trivia":
          panelData = await fetchTriviaData();
          setLoadingStatus(false);
          break;
        case "Countries":
          panelData = await fetchCountriesData();
          setLoadingStatus(false);
          break;
        case "Quiz":
          panelData = await fetchQuizData();
          setLoadingStatus(false);
          break;
      }
      setActivePanelData(panelData.data);
    }
    getsPanelData();
  }, [activePanel, reload]);

  return (
    <div className="flex flex-col min-h-screen max-w-6xl mx-auto px-6 pb-12">
      {loadingStatus === false ? (
        <>
          <Nav setIsAuthenticated={setIsAuthenticated} setReload={setReload} setLoadingStatus={setLoadingStatus} />
          <GiveMeButtons setReload={setReload} activePanel={activePanel} setActivePanel={setActivePanel} setLoadingStatus={setLoadingStatus} />
          {activePanel === "Overview" && (<OverviewPanel data={activePanelData} />)}
          {activePanel === "Posts" && (<PostsPanel data={activePanelData} />)}
          {activePanel === "Users" && (<UsersPanel data={activePanelData} />)}
          {activePanel === "Productivity" && (<ProductivityPanel data={activePanelData} />)}
          {activePanel === "Trivia" && (<TriviaPanel data={activePanelData} />)}
          {activePanel === "Countries" && (<CountriesPanel data={activePanelData} />)}
          {activePanel === "Quiz" && (<QuizPanel data={activePanelData} />)}
        </>
      ) : (
        <LoadingSpinner />
      )}
    </div>
  );
}