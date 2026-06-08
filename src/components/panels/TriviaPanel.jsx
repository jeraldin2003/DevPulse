import { Brain, HelpCircle } from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

import StatCard from "../shared/StatCard.jsx";
import SectionTitle from "../shared/SectionTitle.jsx";
import Badge from "../shared/Badge.jsx";
import ErrorCard from "../shared/ErrorCard.jsx";

const DIFFICULTY_COLORS = {
  easy: "#70AD47",
  medium: "#FFC000",
  hard: "#FF6B6B",
};

function decodeHtml(text) {
  const el = document.createElement("textarea");
  el.innerHTML = text;
  return el.value;
}

function TriviaTooltip({ active, payload }) {
  if (!active || !payload || payload.length === 0) {
    return null;
  }

  const entry = payload[0];

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
      <p style={{ fontWeight: 600, textTransform: "capitalize" }}>{entry.name}</p>
      <p>{entry.value} questions</p>
    </div>
  );
}

export default function TriviaPanel({ data }) {
  if (!data) {
    return <ErrorCard message="Trivia data is unavailable due to a failed API request." />;
  }

  const pieData = data.difficultyCounts.map((item) => ({
    name: item.difficulty,
    value: item.count,
  }));

  const easyCount = data.difficultyCounts.find((d) => d.difficulty === "easy")?.count ?? 0;
  const mediumCount = data.difficultyCounts.find((d) => d.difficulty === "medium")?.count ?? 0;
  const hardCount = data.difficultyCounts.find((d) => d.difficulty === "hard")?.count ?? 0;

  return (
    <div>
      <SectionTitle>Trivia Overview</SectionTitle>

      <div className="panel-grid">
        <StatCard
          icon={Brain}
          label="Total Questions"
          value={data.questions.length}
          color="#f59e0b"
        />
        <StatCard
          icon={HelpCircle}
          label="Easy Questions"
          value={easyCount}
          color="#70AD47"
        />
        <StatCard
          icon={HelpCircle}
          label="Medium Questions"
          value={mediumCount}
          color="#FFC000"
        />
        <StatCard
          icon={HelpCircle}
          label="Hard Questions"
          value={hardCount}
          color="#FF6B6B"
        />
      </div>

      <SectionTitle>Difficulty Breakdown</SectionTitle>

      <div
        style={{
          padding: "1rem",
          background: "#ffffff",
          borderRadius: "8px",
          border: "1px solid #dde1e8",
          marginBottom: "1.5rem",
        }}
      >
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={pieData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={2}
            >
              {pieData.map((entry) => (
                <Cell
                  key={entry.name}
                  fill={DIFFICULTY_COLORS[entry.name] ?? "#8b5cf6"}
                />
              ))}
            </Pie>
            <Tooltip content={<TriviaTooltip />} />
            <Legend formatter={(value) => value.charAt(0).toUpperCase() + value.slice(1)} />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <SectionTitle>Question Results</SectionTitle>

      <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
        {data.questions.map((item) => (
          <div
            key={`${item.category}-${item.question.slice(0, 40)}`}
            style={{
              padding: "1rem",
              background: "#ffffff",
              borderRadius: "8px",
              border: "1px solid #dde1e8",
            }}
          >
            <p style={{ fontSize: "0.9375rem", marginBottom: "0.5rem", color: "#1a1d26" }}>
              {decodeHtml(item.question)}
            </p>
            <p style={{ fontSize: "0.8125rem", color: "#5c6370", marginBottom: "0.5rem" }}>
              Answer: {decodeHtml(item.answer)}
            </p>
            <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
              <Badge color={DIFFICULTY_COLORS[item.difficulty] ?? "#8b5cf6"}>
                {item.difficulty}
              </Badge>
              <Badge color="#3b6cf4">{decodeHtml(item.category)}</Badge>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}