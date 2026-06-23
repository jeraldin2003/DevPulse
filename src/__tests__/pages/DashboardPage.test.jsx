import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import DashboardPage from '~/features/dashboard/pages/DashboardPage.jsx';
import { useDashboardTab } from '~/features/dashboard/hooks/useDashboardTab.js';

// Mock the hook
vi.mock('~/features/dashboard/hooks/useDashboardTab.js', () => ({
  useDashboardTab: vi.fn(),
}));

// Mock the components used in ActivePanel
vi.mock('~/features/dashboard/components', () => ({
  OverviewPanel: () => <div data-testid="overview-panel">Overview Panel</div>,
  UsersPanel: () => <div data-testid="users-panel">Users Panel</div>,
  PostsPanel: () => <div data-testid="posts-panel">Posts Panel</div>,
  ProductivityPanel: () => <div data-testid="productivity-panel">Productivity Panel</div>,
}));

vi.mock('~/features/quiz/components', () => ({
  LeaderboardPanel: () => <div data-testid="trivia-panel">Trivia Panel</div>,
}));

describe('DashboardPage', () => {
  const mockSwitchTab = vi.fn();
  const mockRefresh = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render the loading skeleton when loading', () => {
    useDashboardTab.mockReturnValue({
      activeTab: 'overview',
      tabState: { loading: true, data: null, errors: {}, loadTime: 0 },
      switchTab: mockSwitchTab,
      refresh: mockRefresh,
    });

    render(<DashboardPage />);

    // Header should be visible
    expect(screen.getByText('Dashboard')).toBeTruthy();

    // Loading skeleton should be present (via DashboardSkeleton, we can check by testing "Loading…" footer text)
    expect(screen.getByText('Loading…')).toBeTruthy();
  });

  it('should render the active panel based on activeTab', () => {
    useDashboardTab.mockReturnValue({
      activeTab: 'overview',
      tabState: { loading: false, data: { some: 'data' }, errors: {}, loadTime: 100 },
      switchTab: mockSwitchTab,
      refresh: mockRefresh,
    });

    render(<DashboardPage />);

    expect(screen.getByTestId('overview-panel')).toBeTruthy();
    expect(screen.getByText('Loaded in 100 ms')).toBeTruthy();
  });

  it('should display error banner if there are errors', () => {
    useDashboardTab.mockReturnValue({
      activeTab: 'overview',
      tabState: {
        loading: false,
        data: null,
        errors: { overview: 'Failed to fetch overview data' },
        loadTime: 50,
      },
      switchTab: mockSwitchTab,
      refresh: mockRefresh,
    });

    render(<DashboardPage />);

    expect(screen.getByText('Some data failed to load:')).toBeTruthy();
    expect(screen.getByText('Failed to fetch overview data')).toBeTruthy();
  });

  it('should call refresh when refresh button is clicked', () => {
    useDashboardTab.mockReturnValue({
      activeTab: 'overview',
      tabState: { loading: false, data: { stat: 1 }, errors: {}, loadTime: 100 },
      switchTab: mockSwitchTab,
      refresh: mockRefresh,
    });

    render(<DashboardPage />);

    const refreshButton = screen.getByRole('button', { name: /refresh current tab/i });
    fireEvent.click(refreshButton);

    expect(mockRefresh).toHaveBeenCalledTimes(1);
  });
});
