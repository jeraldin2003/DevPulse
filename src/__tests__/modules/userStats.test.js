import { describe, it, expect } from 'vitest';
import { userStats } from '~/features/dashboard/utils/userStats.js';

describe('userStats module', () => {
  it('should handle empty or invalid input', () => {
    expect(userStats([])).toEqual({
      totalUsers: 0,
      totalCompanies: 0,
      bizUsers: [],
      companies: [],
    });
    expect(userStats(null)).toEqual({
      totalUsers: 0,
      totalCompanies: 0,
      bizUsers: [],
      companies: [],
    });
  });

  it('should shape .biz users correctly and extract companies', () => {
    const input = [
      { id: 1, name: 'User 1', email: 'test@test.com', company: { name: 'Corp A' } },
      { id: 2, name: 'User 2', email: 'biz@test.biz', company: { name: 'Corp B' } },
      { id: 3, name: 'User 3', email: 'biz2@test.biz', company: { name: 'Corp A' } },
    ];

    const result = userStats(input);

    expect(result.totalUsers).toBe(3);
    expect(result.totalCompanies).toBe(2); // Corp A, Corp B
    expect(result.bizUsers).toHaveLength(2);
    expect(result.bizUsers[0]).toEqual({
      id: 2,
      name: 'User 2',
      email: 'biz@test.biz',
      company: { name: 'Corp B' },
    });
  });
});
