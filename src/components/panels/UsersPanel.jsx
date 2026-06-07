import { Users, Building2 } from "lucide-react";

import StatCard from "../shared/StatCard.jsx";
import SectionTitle from "../shared/SectionTitle.jsx";
import ErrorCard from "../shared/ErrorCard.jsx";

export default function UsersPanel({ data }) {
  if (!data) {
    return <ErrorCard message="Users data is unavailable due to a failed API request." />;
  }

  return (
    <div>
      <SectionTitle>User Statistics</SectionTitle>

      <div className="panel-grid">
        <StatCard
          icon={Users}
          label="Total Users"
          value={data.totalUsers}
          color="#3b6cf4"
        />
        <StatCard
          icon={Building2}
          label="Unique Companies"
          value={data.totalCompanies}
          color="#8b5cf6"
        />
      </div>

      <div
        style={{
          padding: "1rem 1.125rem",
          background: "#ffffff",
          borderRadius: "8px",
          border: "1px solid #dde1e8",
          color: "#5c6370",
          fontSize: "0.875rem",
        }}
      >
        Per-user details, company badges, and boolean checks are not available
        from the current <code>userStats</code> module output, which only provides
        aggregate totals.
      </div>
    </div>
  );
}
