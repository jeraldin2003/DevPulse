import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { QuizPanel } from '~/features/quiz/components/QuizPanel.jsx';
import { useQuiz } from '~/features/quiz/hooks/useQuiz.js';

// Mock hook and components
vi.mock('~/features/quiz/hooks/useQuiz.js', () => ({
  useQuiz: vi.fn(),
}));

vi.mock('~/features/quiz/components/SelectionScreen.jsx', () => ({
  SelectionScreen: () => <div data-testid="selection-screen">Selection Screen</div>,
}));

vi.mock('~/features/quiz/components/PlayingScreen.jsx', () => ({
  PlayingScreen: () => <div data-testid="playing-screen">Playing Screen</div>,
}));

vi.mock('~/features/quiz/components/FinishedScreen.jsx', () => ({
  FinishedScreen: () => <div data-testid="finished-screen">Finished Screen</div>,
}));

describe('QuizPanel', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render SelectionScreen when quizState is selection', () => {
    useQuiz.mockReturnValue({
      quizState: 'selection',
      startQuiz: vi.fn(),
      error: null,
    });

    render(<QuizPanel />);
    expect(screen.getByTestId('selection-screen')).toBeTruthy();
  });

  it('should render LoadingScreen when quizState is loading', () => {
    useQuiz.mockReturnValue({
      quizState: 'loading',
    });

    render(<QuizPanel />);
    expect(screen.getByText('Fetching questions…')).toBeTruthy();
  });

  it('should render FinishedScreen when quizState is finished', () => {
    useQuiz.mockReturnValue({
      quizState: 'finished',
      score: 5,
      questions: Array(10).fill({}),
      resetQuiz: vi.fn(),
    });

    render(<QuizPanel />);
    expect(screen.getByTestId('finished-screen')).toBeTruthy();
  });

  it('should render PlayingScreen for any other state (playing)', () => {
    useQuiz.mockReturnValue({
      quizState: 'playing',
      currentQuestion: {},
      currentIndex: 0,
      questions: Array(10).fill({}),
      score: 0,
      timeLeft: 15,
      selectedAnswer: null,
      handleAnswer: vi.fn(),
    });

    render(<QuizPanel />);
    expect(screen.getByTestId('playing-screen')).toBeTruthy();
  });
});
