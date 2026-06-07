import { useState } from "react";
import { Globe } from "lucide-react";
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

function CountriesTooltip({ active, payload }) {
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
      <p style={{ fontWeight: 600, marginBottom: "0.25rem" }}>{entry.name}</p>
      <p>{entry.population.toLocaleString()} people</p>
    </div>
  );
}

export default function CountriesPanel({ data }) {
  const [search, setSearch] = useState("");

  if (!data) {
    return <ErrorCard message="Countries data is unavailable due to a failed API request." />;
  }

  const countries = data.top10CountriesByPopulation;
  const chartData = countries.slice(0, 5);

  const filtered = countries.filter((country) =>
    country.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <SectionTitle>Country Statistics</SectionTitle>

      <div className="panel-grid" style={{ maxWidth: "320px" }}>
        <StatCard
          icon={Globe}
          label="Total Countries"
          value={data.totalCountries}
          color="#06b6d4"
        />
      </div>

      <SectionTitle>Top 5 by Population</SectionTitle>

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
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#eef0f4" />
            <XAxis dataKey="name" tick={{ fontSize: 11 }} interval={0} angle={-20} textAnchor="end" height={70} />
            <YAxis tick={{ fontSize: 12 }} tickFormatter={(v) => `${(v / 1e6).toFixed(0)}M`} />
            <Tooltip content={<CountriesTooltip />} />
            <Bar dataKey="population" fill="#06b6d4" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "1rem",
          marginBottom: "1rem",
          flexWrap: "wrap",
        }}
      >
        <h2
          style={{
            fontSize: "1.125rem",
            fontWeight: 600,
            color: "#1a1d26",
            paddingBottom: "0.5rem",
            borderBottom: "2px solid #dde1e8",
            flex: 1,
          }}
        >
          Countries ({filtered.length})
        </h2>
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search countries..."
          style={{
            padding: "0.5rem 0.75rem",
            border: "1px solid #dde1e8",
            borderRadius: "8px",
            fontSize: "0.875rem",
            minWidth: "200px",
          }}
        />
      </div>

      {filtered.length === 0 ? (
        <p
          style={{
            padding: "2rem",
            textAlign: "center",
            color: "#5c6370",
            background: "#ffffff",
            borderRadius: "8px",
            border: "1px solid #dde1e8",
          }}
        >
          No countries match your search
        </p>
      ) : (
        <div className="card-grid">
          {filtered.map((country) => (
            <div
              key={country.name}
              style={{
                padding: "1rem",
                background: "#ffffff",
                borderRadius: "8px",
                border: "1px solid #dde1e8",
                boxShadow: "0 1px 3px rgba(0, 0, 0, 0.08)",
              }}
            >
              <p style={{ fontWeight: 600, marginBottom: "0.25rem", color: "#1a1d26" }}>
                {country.name}
              </p>
              <p style={{ fontSize: "0.875rem", color: "#5c6370" }}>
                {country.population.toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
