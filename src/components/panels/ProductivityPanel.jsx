import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Cell,
} from "recharts";

import SectionTitle from "../shared/SectionTitle.jsx";
import ErrorCard from "../shared/ErrorCard.jsx";

function getCompletionColor(rate) {
  if (rate >= 70) {
    return "#70AD47";
  }
  if (rate >= 50) {
    return "#FFC000";
  }
  return "#FF6B6B";
}

function ProductivityTooltip({ active, payload }) {
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
      <p style={{ fontWeight: 600, marginBottom: "0.25rem" }}>{entry.userName}</p>
      <p>{entry.completionPercentage}% complete</p>
      <p>
        {entry.completedTodos} / {entry.totalTodos} todos
      </p>
    </div>
  );
}

export default function ProductivityPanel({ data }) {
  if (!data) {
    return (
      <ErrorCard message="Productivity data is unavailable due to a failed API request." />
    );
  }

  const chartData = data.userCompletionStats;

  return (
    <div>
      <SectionTitle>Completion Rate by User</SectionTitle>

      <div
        style={{
          padding: "1rem",
          background: "#ffffff",
          borderRadius: "8px",
          border: "1px solid #dde1e8",
        }}
      >
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData} layout="vertical" margin={{ left: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#eef0f4" />
            <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 12 }} />
            <YAxis
              type="category"
              dataKey="userName"
              width={120}
              tick={{ fontSize: 11 }}
            />
            <Tooltip content={<ProductivityTooltip />} />
            <Bar dataKey="completionPercentage" radius={[0, 4, 4, 0]}>
              {chartData.map((entry) => (
                <Cell
                  key={entry.userId}
                  fill={getCompletionColor(entry.completionPercentage)}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
