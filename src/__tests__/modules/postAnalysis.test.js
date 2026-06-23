import { describe, it, expect } from 'vitest';
import { postAnalysis } from '~/features/dashboard/utils/postAnalysis.js';

describe('postAnalysis module', () => {
  it('should handle empty arrays safely', () => {
    const res = postAnalysis([]);
    expect(res).toEqual({ totalPosts: 0, top5UsersByPostCount: [] });
  });

  it('should calculate metrics correctly', () => {
    const input = [
      { userId: 1, id: 101, title: 'Short', body: 'One two three' },
      { userId: 2, id: 102, title: 'Medium', body: 'One two three four five' },
      { userId: 1, id: 103, title: 'Longer', body: 'One two three four five six' },
    ];

    const res = postAnalysis(input);

    expect(res.totalPosts).toBe(3);

    expect(res.top5UsersByPostCount[0]).toEqual({ userId: 1, postCount: 2 });
    expect(res.top5UsersByPostCount[1]).toEqual({ userId: 2, postCount: 1 });
  });
});
