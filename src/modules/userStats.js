const getTotalUsers = (users) => users.length;

const getTotalCompanies = (users) =>
  new Set(users.map(({ company: { name } }) => name)).size;

export const userStats = (users) => ({
  totalUsers: getTotalUsers(users),
  totalCompanies: getTotalCompanies(users),
});