import { FileText } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

import StatCard from "../shared/StatCard.jsx";
import SectionTitle from "../shared/SectionTitle.jsx";
import ErrorCard from "../shared/ErrorCard.jsx";

function PostsTooltip({ active, payload }) {
  if (!active || !payload || payload.length === 0) {
    return null;
  }

  const entry = payload[0].payload;

  return (
    <div className="p-2 bg-white border border-slate-200 rounded-md text-xs shadow-sm">
      <p className="font-semibold text-slate-800 mb-0.5">User {entry.userId}</p>
      <p className="text-slate-600">{entry.postCount} posts</p>
    </div>
  );
}

export default function PostsPanel({ data }) {
  if (!data) {
    return <ErrorCard message="Posts data is unavailable due to a failed API request." />;
  }

  const chartData = data.top5UsersByPostCount;

  return (
    <div>
      <SectionTitle>Post Statistics</SectionTitle>

      <div className="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-4 max-w-[320px]">
        <StatCard
          icon={FileText}
          label="Total Posts"
          value={data.totalPosts}
          color="#8b5cf6"
        />
      </div>

      <div className="mt-6">
        <SectionTitle>Posts per User Leaderboard</SectionTitle>

        <div className="p-4 bg-white border border-slate-200 rounded-lg shadow-sm">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis
                dataKey="userId"
                tickFormatter={(userId) => `User ${userId}`}
                tick={{ fontSize: 12 }}
              />
              <YAxis tick={{ fontSize: 12 }} allowDecimals={false} />
              <Tooltip content={<PostsTooltip />} />
              <Bar dataKey="postCount" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
