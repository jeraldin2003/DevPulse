import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import QuizPage from '~/features/quiz/pages/QuizPage.jsx';
import { useLeaderboard } from '~/features/quiz/hooks/useLeaderboard.js';

// Mock hooks and components
vi.mock('~/features/quiz/hooks/useLeaderboard.js', () => ({
  useLeaderboard: vi.fn(),
}));

vi.mock('~/features/quiz/components', () => ({
  QuizPanel: () => <div data-testid="quiz-panel">Quiz Panel Content</div>,
  LeaderboardPanel: () => <div data-testid="leaderboard-panel">Leaderboard Content</div>,
}));

describe('QuizPage', () => {
  const mockLoad = vi.fn();
  const mockRefresh = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render Quiz tab by default', () => {
    useLeaderboard.mockReturnValue({
      top10: [],
      currentUser: null,
      loading: false,
      error: null,
      load: mockLoad,
      refresh: mockRefresh,
    });

    render(<QuizPage />);

    expect(screen.getByText('Trivia Quiz')).toBeTruthy();
    expect(screen.getByTestId('quiz-panel')).toBeTruthy();
  });

  it('should switch to Leaderboard tab and trigger load', () => {
    useLeaderboard.mockReturnValue({
      top10: [],
      currentUser: null,
      loading: false,
      error: null,
      load: mockLoad,
      refresh: mockRefresh,
    });

    render(<QuizPage />);

    // Click on the Leaderboard tab
    const leaderboardTab = screen.getByRole('tab', { name: /leaderboard/i });
    fireEvent.click(leaderboardTab);

    // Header should change
    expect(screen.getByRole('heading', { level: 1 }).textContent).toBe('Leaderboard');
    // Leaderboard panel should be rendered
    expect(screen.getByTestId('leaderboard-panel')).toBeTruthy();
    // It should load the leaderboard
    expect(mockLoad).toHaveBeenCalledTimes(1);
  });

  it('should render skeleton while loading leaderboard', () => {
    useLeaderboard.mockReturnValue({
      top10: [],
      currentUser: null,
      loading: true,
      error: null,
      load: mockLoad,
      refresh: mockRefresh,
    });

    render(<QuizPage />);

    // Switch to leaderboard tab to trigger loading state rendering
    fireEvent.click(screen.getByRole('tab', { name: /leaderboard/i }));

    // In a real environment, the skeleton doesn't have text, but it's rendered instead of the panel
    expect(screen.queryByTestId('leaderboard-panel')).toBeNull();
  });

  it('should render error message when leaderboard fails to load', () => {
    useLeaderboard.mockReturnValue({
      top10: [],
      currentUser: null,
      loading: false,
      error: 'Network Error',
      load: mockLoad,
      refresh: mockRefresh,
    });

    render(<QuizPage />);

    fireEvent.click(screen.getByRole('tab', { name: /leaderboard/i }));

    expect(screen.getByText('Failed to load leaderboard')).toBeTruthy();
    expect(screen.getByText('Network Error')).toBeTruthy();
  });

  it('should call refresh when refresh button is clicked on leaderboard tab', () => {
    useLeaderboard.mockReturnValue({
      top10: [],
      currentUser: null,
      loading: false,
      error: null,
      load: mockLoad,
      refresh: mockRefresh,
    });

    render(<QuizPage />);

    fireEvent.click(screen.getByRole('tab', { name: /leaderboard/i }));

    const refreshButton = screen.getByRole('button', { name: /refresh leaderboard/i });
    fireEvent.click(refreshButton);

    expect(mockRefresh).toHaveBeenCalledTimes(1);
  });
});
