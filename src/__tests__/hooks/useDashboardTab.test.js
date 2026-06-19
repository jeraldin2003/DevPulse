import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useDashboardTab } from '~/features/dashboard/hooks/useDashboardTab.js';

// Mock the API calls
vi.mock('~/features/dashboard/api/DashboardData.js', () => ({
  fetchOverviewData: vi.fn(),
  fetchUsersData: vi.fn(),
  fetchPostsData: vi.fn(),
  fetchProductivityData: vi.fn(),
  fetchTriviaData: vi.fn(),
}));

import { fetchOverviewData, fetchUsersData } from '~/features/dashboard/api/DashboardData.js';

describe('useDashboardTab hook', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should initialize with overview tab and loading state', async () => {
    fetchOverviewData.mockResolvedValueOnce({ data: { stat: 1 }, errors: {}, loadTime: 100 });

    const { result } = renderHook(() => useDashboardTab('overview'));

    // Initially loading
    expect(result.current.activeTab).toBe('overview');
    expect(result.current.tabState.loading).toBe(true);

    // Wait for effect to finish
    await act(async () => {
      await vi.runAllTimersAsync();
    });

    expect(result.current.tabState.loading).toBe(false);
    expect(result.current.tabState.data).toEqual({ stat: 1 });
  });

  it('should switch tabs and load data', async () => {
    fetchOverviewData.mockResolvedValueOnce({ data: { stat: 1 }, errors: {}, loadTime: 100 });
    fetchUsersData.mockResolvedValueOnce({ data: [{ id: 1 }], errors: {}, loadTime: 150 });

    const { result } = renderHook(() => useDashboardTab('overview'));

    await act(async () => {
      await vi.runAllTimersAsync();
    });

    // Switch to users tab
    act(() => {
      result.current.switchTab('users');
    });

    expect(result.current.activeTab).toBe('users');
    expect(result.current.tabState.loading).toBe(true); // Should be loading the new tab

    await act(async () => {
      await vi.runAllTimersAsync();
    });

    expect(fetchUsersData).toHaveBeenCalledTimes(1);
    expect(result.current.tabState.loading).toBe(false);
    expect(result.current.tabState.data).toEqual([{ id: 1 }]);
  });

  it('should serve data from cache if switching back to an already loaded tab', async () => {
    fetchOverviewData.mockResolvedValueOnce({ data: { stat: 1 }, errors: {}, loadTime: 100 });
    fetchUsersData.mockResolvedValueOnce({ data: [{ id: 1 }], errors: {}, loadTime: 150 });

    const { result } = renderHook(() => useDashboardTab('overview'));

    await act(async () => {
      await vi.runAllTimersAsync();
    });

    // Switch to users tab
    act(() => {
      result.current.switchTab('users');
    });

    await act(async () => {
      await vi.runAllTimersAsync();
    });

    // Switch back to overview tab
    act(() => {
      result.current.switchTab('overview');
    });

    // It should not be loading since it's cached
    expect(result.current.activeTab).toBe('overview');
    expect(result.current.tabState.loading).toBe(false);
    expect(result.current.tabState.data).toEqual({ stat: 1 });
    // fetchOverviewData should only be called once
    expect(fetchOverviewData).toHaveBeenCalledTimes(1);
  });

  it('should bypass cache when refresh is called', async () => {
    fetchOverviewData.mockResolvedValueOnce({ data: { stat: 1 }, errors: {}, loadTime: 100 });
    fetchOverviewData.mockResolvedValueOnce({ data: { stat: 2 }, errors: {}, loadTime: 120 });

    const { result } = renderHook(() => useDashboardTab('overview'));

    await act(async () => {
      await vi.runAllTimersAsync();
    });

    expect(result.current.tabState.data).toEqual({ stat: 1 });

    act(() => {
      result.current.refresh();
    });

    expect(result.current.tabState.loading).toBe(true);

    await act(async () => {
      await vi.runAllTimersAsync();
    });

    expect(fetchOverviewData).toHaveBeenCalledTimes(2);
    expect(result.current.tabState.loading).toBe(false);
    expect(result.current.tabState.data).toEqual({ stat: 2 });
  });
});
