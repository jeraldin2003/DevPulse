import { NavLink, Outlet } from "react-router-dom";
import { LayoutDashboard, HelpCircle, LogOut, User, Activity } from "lucide-react";
import { useAuth } from "../../context/AuthContext.jsx";

export default function SidebarLayout() {
  const { user, logout } = useAuth();

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col shrink-0 h-screen sticky top-0">
        {/* Brand/Logo */}
        <div className="p-6 border-b border-slate-100 flex items-center gap-2">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-blue-600 text-white shadow-sm shadow-blue-500/20">
            <Activity size={18} strokeWidth={2.5} />
          </div>
          <span className="text-lg font-bold text-slate-800 tracking-tight">DevPulse</span>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 p-4 flex flex-col gap-1 overflow-y-auto">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-semibold transition-colors duration-150 ${isActive
                ? "bg-blue-50 text-blue-600"
                : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              }`
            }
          >
            <LayoutDashboard size={18} />
            Dashboard
          </NavLink>
          <NavLink
            to="/quiz"
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-semibold transition-colors duration-150 ${isActive
                ? "bg-blue-50 text-blue-600"
                : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              }`
            }
          >
            <HelpCircle size={18} />
            Quiz
          </NavLink>
        </nav>

        {/* User profile & Logout */}
        <div className="p-3 border-t border-slate-100">
          {user && (
            <div className="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors duration-150 group">
              {/* Avatar */}
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-slate-300 to-slate-400 flex items-center justify-center text-white shrink-0 shadow-sm">
                <User size={14} />
              </div>

              {/* User info */}
              <div className="flex flex-col min-w-0 flex-1">
                <span className="text-[10px] font-medium text-slate-400 uppercase tracking-wide leading-none mb-0.5">
                  Signed in
                </span>
                <span className="text-sm font-semibold text-slate-700 truncate leading-tight">
                  {user.username}
                </span>
              </div>

              {/* Logout button */}
              <button
                type="button"
                onClick={logout}
                title="Sign out"
                className="shrink-0 w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 hover:text-rose-500 hover:bg-rose-50 transition-all duration-150 cursor-pointer opacity-60 group-hover:opacity-100"
              >
                <LogOut size={14} />
              </button>
            </div>
          )}
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <main className="flex-1 p-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}