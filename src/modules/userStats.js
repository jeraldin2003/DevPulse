
export const userStats = (users) => (
  getUserStats(users)
);

export function getUserStats(users) {
  const totalUsers = users.length;

  const bizUsers = users.filter(u => u.email.endsWith('.biz'));

  const companies = users.map(u => ({
    name: u.name,
    company: u.company.name,
    email: u.email,
  }));

  const uniqueCompanies = [...new Set(users.map(u => u.company.name))];

  return { totalUsers, bizUsers, companies, totalCompanies: uniqueCompanies.length };
}