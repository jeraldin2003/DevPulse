import { describe, it, expect } from 'vitest';
import { productivityTracker } from '~/features/dashboard/utils/productivityTracker.js';

describe('productivityTracker module', () => {
  it('should handle empty lists safely', () => {
    const res = productivityTracker([], []);
    expect(res).toEqual({ userCompletionStats: [] });
  });

  it('should calculate completion percentages correctly', () => {
    const users = [
      { id: 1, name: 'Alice' },
      { id: 2, name: 'Bob' },
    ];
    const todos = [
      { userId: 1, id: 10, title: 'Task', completed: true },
      { userId: 1, id: 11, title: 'Task', completed: false },
      { userId: 2, id: 12, title: 'Task', completed: true },
    ];

    const res = productivityTracker(users, todos);

    expect(res.userCompletionStats).toHaveLength(2);

    const alice = res.userCompletionStats.find((u) => u.userId === 1);
    expect(alice.totalTodos).toBe(2);
    expect(alice.completedTodos).toBe(1);
    expect(alice.completionPercentage).toBe(50); // 1/2

    const bob = res.userCompletionStats.find((u) => u.userId === 2);
    expect(bob.totalTodos).toBe(1);
    expect(bob.completedTodos).toBe(1);
    expect(bob.completionPercentage).toBe(100);
  });
});
