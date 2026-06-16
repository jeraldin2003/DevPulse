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
    <div className="p-2 bg-white border border-slate-200 rounded-md text-xs shadow-sm">
      <p className="font-semibold text-slate-800 mb-0.5">{entry.userName}</p>
      <p className="text-slate-650">{entry.completionPercentage}% complete</p>
      <p className="text-slate-500">
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

      <div className="p-4 bg-white border border-slate-200 rounded-lg shadow-sm">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData} layout="vertical" margin={{ left: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
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
