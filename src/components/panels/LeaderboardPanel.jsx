import { Trophy, Award, Medal, User } from "lucide-react";
import SectionTitle from "../shared/SectionTitle.jsx";
import Badge from "../shared/Badge.jsx";

export default function LeaderboardPanel({ top10, currentUser }) {
  const isUserInTop10 = top10.some(
    (item) => item.username === currentUser?.username
  );

  return (
    <div className="flex flex-col gap-6">
      <div>
        <div className="flex justify-between items-center mb-4">
          <SectionTitle>Global Leaderboard</SectionTitle>
          <Badge color="#3b82f6">Top 10 players</Badge>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 w-20">Rank</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Player</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 text-right">Total Score</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 text-right">Games Played</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {top10.map((player) => {
                  const isCurrentUser = player.username === currentUser?.username;
                  return (
                    <tr
                      key={player.username}
                      className={`transition-colors duration-150 ${
                        isCurrentUser ? "bg-blue-50/50 hover:bg-blue-50" : "hover:bg-slate-50"
                      }`}
                    >
                      <td className="px-6 py-4 font-semibold text-slate-700">
                        <div className="flex items-center gap-2">
                          {player.rank === 1 && <Trophy size={18} className="text-amber-500 shrink-0" />}
                          {player.rank === 2 && <Award size={18} className="text-slate-400 shrink-0" />}
                          {player.rank === 3 && <Medal size={18} className="text-amber-700 shrink-0" />}
                          {player.rank > 3 && <span>#{player.rank}</span>}
                        </div>
                      </td>
                      <td className="px-6 py-4 font-medium text-slate-800">
                        <div className="flex items-center gap-2">
                          <User size={14} className="text-slate-400" />
                          <span className={isCurrentUser ? "font-bold text-blue-600" : ""}>
                            {player.username}
                          </span>
                          {isCurrentUser && (
                            <span className="text-[10px] bg-blue-100 text-blue-800 font-bold px-1.5 py-0.5 rounded uppercase tracking-wide ml-1">
                              You
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 font-semibold text-slate-800 text-right">
                        {player.totalScore}
                      </td>
                      <td className="px-6 py-4 text-slate-500 text-right">
                        {player.totalGamesPlayed}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* If current user is not in top 10, show their stats right below */}
      {!isUserInTop10 && currentUser && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 shadow-sm">
          <h4 className="text-sm font-bold text-blue-800 uppercase tracking-wider mb-3 flex items-center gap-2">
            <User size={16} />
            Your Current Standing
          </h4>
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-white rounded-lg border border-blue-100 p-4 shadow-sm">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Rank</span>
              <p className="text-2xl font-black text-blue-600 mt-1">
                {currentUser.rank ? `#${currentUser.rank}` : "Unranked"}
              </p>
            </div>
            <div className="bg-white rounded-lg border border-blue-100 p-4 shadow-sm">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Total Score</span>
              <p className="text-2xl font-bold text-slate-800 mt-1">{currentUser.totalScore}</p>
            </div>
            <div className="bg-white rounded-lg border border-blue-100 p-4 shadow-sm">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Games Played</span>
              <p className="text-2xl font-bold text-slate-800 mt-1">{currentUser.totalGamesPlayed}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
