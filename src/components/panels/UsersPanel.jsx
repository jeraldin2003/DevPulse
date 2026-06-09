import { Users, Building2, Mail } from "lucide-react";

import StatCard from "../shared/StatCard.jsx";
import SectionTitle from "../shared/SectionTitle.jsx";
import Badge from "../shared/Badge.jsx";
import ErrorCard from "../shared/ErrorCard.jsx";

export default function UsersPanel({ data }) {
  if (!data) {
    return (
      <ErrorCard message="Users data is unavailable due to a failed API request." />
    );
  }

  const uniqueCompanies = [...new Set(data.companies.map(c => c.company))];

  return (
    <div>
      <SectionTitle>User Statistics</SectionTitle>

      <div className="panel-grid">
        <StatCard
          icon={Users}
          label="Total Users"
          value={data.totalUsers}
          color="#3b82f6"
        />

        <StatCard
          icon={Building2}
          label="Unique Companies"
          value={data.totalCompanies}
          color="#8b5cf6"
        />
      </div>

      {/* Companies */}
      <div
        style={{
          marginTop: "1.5rem",
          background: "#fff",
          border: "1px solid #e5e7eb",
          borderRadius: "12px",
          padding: "1.25rem",
          boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "1rem",
          }}
        >
          <h3 style={{ margin: 0 }}>Companies</h3>
          <Badge color="#8b5cf6">
            {uniqueCompanies.length} Companies
          </Badge>
        </div>

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "0.6rem",
          }}
        >
          {uniqueCompanies.map(company => (
            <Badge key={company} color="#8b5cf6">
              {company}
            </Badge>
          ))}
        </div>
      </div>

      {/* .biz Users */}
      <div
        style={{
          marginTop: "1.5rem",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "1rem",
          }}
        >
          <h3 style={{ margin: 0 }}>.biz Users</h3>

          <Badge color="#3b82f6">
            {data.bizUsers.length} Found
          </Badge>
        </div>

        {data.bizUsers.length === 0 ? (
          <div
            style={{
              padding: "2rem",
              textAlign: "center",
              background: "#fff",
              border: "1px solid #e5e7eb",
              borderRadius: "12px",
              color: "#6b7280",
            }}
          >
            No .biz users found.
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fill, minmax(280px, 1fr))",
              gap: "1rem",
            }}
          >
            {data.bizUsers.map(user => (
              <div
                key={user.id}
                style={{
                  background: "#fff",
                  border: "1px solid #e5e7eb",
                  borderRadius: "12px",
                  padding: "1rem",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                  transition: "all .2s ease",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.75rem",
                    marginBottom: "1rem",
                  }}
                >
                  <div
                    style={{
                      width: "48px",
                      height: "48px",
                      borderRadius: "50%",
                      background: "#dbeafe",
                      color: "#2563eb",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontWeight: "700",
                      fontSize: "1rem",
                    }}
                  >
                    {user.name
                      .split(" ")
                      .map(word => word[0])
                      .slice(0, 2)
                      .join("")}
                  </div>

                  <div>
                    <div
                      style={{
                        fontWeight: 600,
                        color: "#111827",
                      }}
                    >
                      {user.name}
                    </div>

                    <div
                      style={{
                        fontSize: "0.875rem",
                        color: "#6b7280",
                      }}
                    >
                      User #{user.id}
                    </div>
                  </div>
                </div>

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    color: "#6b7280",
                    fontSize: "0.9rem",
                    marginBottom: "0.75rem",
                  }}
                >
                  <Mail size={16} />
                  {user.email}
                </div>

                <Badge color="#6366f1">
                  {user.company.name}
                </Badge>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}