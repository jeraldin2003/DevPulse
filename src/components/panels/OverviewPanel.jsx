import {
  Users,
  FileText,
  CheckSquare,
  Brain,
  Globe,
} from "lucide-react";

import StatCard from "../shared/StatCard.jsx";
import SectionTitle from "../shared/SectionTitle.jsx";
import ErrorCard from "../shared/ErrorCard.jsx";

function getTopCompletion(userCompletionStats) {
  if (!userCompletionStats || userCompletionStats.length === 0) {
    return null;
  }

  let top = userCompletionStats[0];

  for (let i = 1; i < userCompletionStats.length; i++) {
    if (userCompletionStats[i].completionPercentage > top.completionPercentage) {
      top = userCompletionStats[i];
    }
  }

  return top;
}

function getHardestDifficulty(difficultyCounts) {
  if (!difficultyCounts || difficultyCounts.length === 0) {
    return null;
  }

  let hardest = difficultyCounts[0];

  for (let i = 1; i < difficultyCounts.length; i++) {
    if (difficultyCounts[i].count > hardest.count) {
      hardest = difficultyCounts[i];
    }
  }

  return hardest;
}

export default function OverviewPanel({ data }) {
  if (!data || Object.keys(data).length === 0) {
    return <ErrorCard message="No dashboard data is available." />;
  }

  const topPoster = data.posts?.top5UsersByPostCount?.[0];
  const topCompletion = getTopCompletion(data.productivity?.userCompletionStats);
  const hardestDifficulty = getHardestDifficulty(data.trivia?.difficultyCounts);
  const largestCountry = data.countries?.top10CountriesByPopulation?.[0];

  const quickFacts = [
    topPoster && {
      label: "Top poster",
      value: `User ${topPoster.userId} (${topPoster.postCount} posts)`,
    },
    topCompletion && {
      label: "Highest completion",
      value: `${topCompletion.userName} (${topCompletion.completionPercentage}%)`,
    },
    hardestDifficulty && {
      label: "Most common difficulty",
      value: `${hardestDifficulty.difficulty} (${hardestDifficulty.count} questions)`,
    },
    largestCountry && {
      label: "Largest country",
      value: `${largestCountry.name} (${largestCountry.population.toLocaleString()})`,
    },
  ].filter(Boolean);

  return (
    <div>
      <SectionTitle>Summary</SectionTitle>

      <div className="panel-grid">
        {data.users && (
          <StatCard
            icon={Users}
            label="Total Users"
            value={data.users.totalUsers}
            color="#3b6cf4"
          />
        )}
        {data.posts && (
          <StatCard
            icon={FileText}
            label="Total Posts"
            value={data.posts.totalPosts}
            color="#8b5cf6"
          />
        )}
        {data.productivity && (
          <StatCard
            icon={CheckSquare}
            label="Users Tracked"
            value={data.productivity.userCompletionStats.length}
            sub="Productivity stats"
            color="#70ad47"
          />
        )}
        {data.trivia && (
          <StatCard
            icon={Brain}
            label="Trivia Questions"
            value={data.trivia.questions.length}
            color="#f59e0b"
          />
        )}
        {data.countries && (
          <StatCard
            icon={Globe}
            label="Total Countries"
            value={data.countries.totalCountries}
            color="#06b6d4"
          />
        )}
      </div>

      {quickFacts.length > 0 && (
        <>
          <SectionTitle>Quick Facts</SectionTitle>
          <div className="card-grid">
            {quickFacts.map((fact) => (
              <div
                key={fact.label}
                style={{
                  padding: "1rem",
                  background: "#ffffff",
                  borderRadius: "8px",
                  border: "1px solid #dde1e8",
                  boxShadow: "0 1px 3px rgba(0, 0, 0, 0.08)",
                }}
              >
                <p
                  style={{
                    fontSize: "0.75rem",
                    color: "#5c6370",
                    marginBottom: "0.375rem",
                    textTransform: "uppercase",
                    letterSpacing: "0.04em",
                  }}
                >
                  {fact.label}
                </p>
                <p style={{ fontSize: "0.9375rem", fontWeight: 600, color: "#1a1d26" }}>
                  {fact.value}
                </p>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
