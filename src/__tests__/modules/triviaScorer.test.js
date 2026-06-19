import { describe, it, expect } from 'vitest';
import { triviaScorer } from '~/features/quiz/utils/triviaScorer.js';

describe('triviaScorer module', () => {
  it('should handle empty results', () => {
    const res = triviaScorer({ response_code: 0, results: [] });
    expect(res).toEqual({
      questions: [],
      difficultyCounts: [
        { difficulty: 'easy', count: 0 },
        { difficulty: 'medium', count: 0 },
        { difficulty: 'hard', count: 0 },
      ],
    });
  });

  it('should parse difficulties and format questions', () => {
    const input = {
      response_code: 0,
      results: [
        { difficulty: 'easy', question: 'Q1?', correct_answer: 'A1', category: 'General' },
        { difficulty: 'easy', question: 'Q2?', correct_answer: 'A2', category: 'General' },
        { difficulty: 'hard', question: 'Q3?', correct_answer: 'A3', category: 'General' },
      ],
    };

    const res = triviaScorer(input);

    expect(res.questions).toHaveLength(3);
    expect(res.questions[0].answer).toBe('A1');

    const difficulties = res.difficultyCounts;
    expect(difficulties).toHaveLength(3);

    const easy = difficulties.find((d) => d.difficulty === 'easy');
    expect(easy.count).toBe(2);

    const hard = difficulties.find((d) => d.difficulty === 'hard');
    expect(hard.count).toBe(1);

    const medium = difficulties.find((d) => d.difficulty === 'medium');
    expect(medium.count).toBe(0);
  });
});
