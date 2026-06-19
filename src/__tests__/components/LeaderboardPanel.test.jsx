import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import LeaderboardPanel from '~/features/quiz/components/LeaderboardPanel.jsx';

// We don't necessarily need to mock lucide-react if the environment handles SVGs fine,
// but testing library will render them as elements which is fine.

describe('LeaderboardPanel', () => {
  it('should render empty state when top10 is empty', () => {
    render(<LeaderboardPanel top10={[]} currentUser={null} />);

    expect(screen.getByText('Global Leaderboard')).toBeTruthy();
    expect(screen.getByText('No leaderboard data available yet.')).toBeTruthy();
  });

  it('should render top10 players correctly', () => {
    const top10 = [
      { username: 'player1', rank: 1, totalScore: 1000, totalGamesPlayed: 10 },
      { username: 'player2', rank: 2, totalScore: 800, totalGamesPlayed: 8 },
    ];

    render(<LeaderboardPanel top10={top10} currentUser={null} />);

    expect(screen.getByText('player1')).toBeTruthy();
    expect(screen.getByText('1,000')).toBeTruthy();
    expect(screen.getByText('player2')).toBeTruthy();
    expect(screen.getByText('800')).toBeTruthy();
  });

  it('should highlight the current user if they are in top 10', () => {
    const top10 = [
      { username: 'player1', rank: 1, totalScore: 1000, totalGamesPlayed: 10 },
      { username: 'currentUser', rank: 2, totalScore: 800, totalGamesPlayed: 8 },
    ];

    render(<LeaderboardPanel top10={top10} currentUser={{ username: 'currentUser' }} />);

    // "You" badge should be present
    expect(screen.getByText('You')).toBeTruthy();

    // The "Your Current Standing" block should not be rendered if user is in top 10
    expect(screen.queryByText('Your Current Standing')).toBeNull();
  });

  it('should render current user stats separately if not in top 10', () => {
    const top10 = [{ username: 'player1', rank: 1, totalScore: 1000, totalGamesPlayed: 10 }];
    const currentUser = { username: 'currentUser', rank: 15, totalScore: 500, totalGamesPlayed: 5 };

    render(<LeaderboardPanel top10={top10} currentUser={currentUser} />);

    // "Your Current Standing" block should be rendered
    expect(screen.getByText('Your Current Standing')).toBeTruthy();
    expect(screen.getByText('#15')).toBeTruthy();
    expect(screen.getByText('500')).toBeTruthy();
  });
});
