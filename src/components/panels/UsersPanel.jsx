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

      <div className="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-4">
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
      <div className="mt-6 bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-base font-semibold text-slate-800 m-0">Companies</h3>
          <Badge color="#8b5cf6">
            {uniqueCompanies.length} Companies
          </Badge>
        </div>

        <div className="flex flex-wrap gap-2">
          {uniqueCompanies.map(company => (
            <Badge key={company} color="#8b5cf6">
              {company}
            </Badge>
          ))}
        </div>
      </div>

      {/* .biz Users */}
      <div className="mt-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-base font-semibold text-slate-800 m-0">.biz Users</h3>

          <Badge color="#3b82f6">
            {data.bizUsers.length} Found
          </Badge>
        </div>

        {data.bizUsers.length === 0 ? (
          <div className="p-8 text-center bg-white border border-slate-200 rounded-xl text-slate-500">
            No .biz users found.
          </div>
        ) : (
          <div className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-4">
            {data.bizUsers.map(user => (
              <div
                key={user.id}
                className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow duration-200"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-base border border-blue-100">
                    {user.name
                      .split(" ")
                      .map(word => word[0])
                      .slice(0, 2)
                      .join("")}
                  </div>

                  <div>
                    <div className="font-semibold text-slate-900">
                      {user.name}
                    </div>

                    <div className="text-sm text-slate-500">
                      User #{user.id}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-slate-550 text-sm mb-3">
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