import { describe, it, expect, vi, beforeEach } from 'vitest';
import { apiLogin, apiFetchProfile } from '~/features/auth/api/auth.js';

// Setup mock fetch globally
const mockFetch = vi.fn();
globalThis.fetch = mockFetch;

// Vite loads env vars magically, but we can't assign to import.meta.env
// directly in vitest like `import.meta.env = {}`.
// The file being tested will use the mock fallback of '/api' since
// import.meta.env.VITE_API_URL is undefined in this test environment.

describe('Auth API Wrapper', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  describe('apiLogin', () => {
    it('should return success data on 200 response', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ accessToken: '123', user: { username: 'test' } }),
      });

      const res = await apiLogin('test', 'password');
      expect(mockFetch).toHaveBeenCalledTimes(1);
      expect(res.success).toBeUndefined(); // Returns the raw json since ok is true
      expect(res.accessToken).toBe('123');
    });

    it('should return error on non-ok response', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 401,
        json: async () => ({ error: 'Invalid credentials' }),
      });

      const res = await apiLogin('test', 'wrong');
      expect(res).toEqual({ success: false, error: 'Invalid credentials' });
    });

    it('should return error on network failure', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'));

      const res = await apiLogin('test', 'pass');
      expect(res).toEqual({ success: false, error: 'Network error' });
    });
  });

  describe('apiFetchProfile', () => {
    it('should attach Bearer token', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ id: 1 }),
      });

      await apiFetchProfile('my-token');

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/users/profile'),
        expect.objectContaining({
          headers: { Authorization: 'Bearer my-token' },
        })
      );
    });
  });
});
