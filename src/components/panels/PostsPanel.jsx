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
    <div
      style={{
        padding: "0.5rem 0.75rem",
        background: "#ffffff",
        border: "1px solid #dde1e8",
        borderRadius: "6px",
        fontSize: "0.8125rem",
      }}
    >
      <p style={{ fontWeight: 600, marginBottom: "0.25rem" }}>User {entry.userId}</p>
      <p>{entry.postCount} posts</p>
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

      <div className="panel-grid" style={{ maxWidth: "320px" }}>
        <StatCard
          icon={FileText}
          label="Total Posts"
          value={data.totalPosts}
          color="#8b5cf6"
        />
      </div>

      <SectionTitle>Posts per User Leaderboard</SectionTitle>

      <div
        style={{
          padding: "1rem",
          background: "#ffffff",
          borderRadius: "8px",
          border: "1px solid #dde1e8",
        }}
      >
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#eef0f4" />
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
  );
}
