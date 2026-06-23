/**
 * TriviaPanel.jsx
 * Dashboard trivia tab — shows 10 random Q&A cards from the fetched trivia data.
 * Users can click "Shuffle Questions" to pick a new random set.
 */

import { useState, useMemo, useCallback } from 'react';
import { Shuffle, Brain, ChevronDown, ChevronUp, BookOpen } from 'lucide-react';
import { SectionTitle } from '~/components/ui';
import { EmptyState } from '~/components/ui';

const DIFFICULTY_STYLES = {
  easy: {
    badge: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    dot: 'bg-emerald-500',
  },
  medium: {
    badge: 'bg-amber-50 text-amber-700 border-amber-200',
    dot: 'bg-amber-500',
  },
  hard: {
    badge: 'bg-rose-50 text-rose-700 border-rose-200',
    dot: 'bg-rose-500',
  },
};

function pickRandom(arr, count) {
  const shuffled = [...arr].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(count, shuffled.length));
}

function DifficultyBadge({ difficulty }) {
  const styles = DIFFICULTY_STYLES[difficulty] ?? {
    badge: 'bg-slate-50 text-slate-600 border-slate-200',
    dot: 'bg-slate-400',
  };
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-full border ${styles.badge}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${styles.dot}`} />
      {difficulty}
    </span>
  );
}

function QuestionCard({ question, answer, category, difficulty, index }) {
  const [revealed, setRevealed] = useState(false);

  return (
    <div className="bg-white border border-slate-100 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden">
      {/* Card header */}
      <div className="flex items-start justify-between gap-3 px-5 pt-4 pb-3">
        <div className="flex items-start gap-3 flex-1 min-w-0">
          <span className="flex-shrink-0 w-7 h-7 rounded-full bg-blue-50 text-blue-600 font-bold text-xs flex items-center justify-center mt-0.5">
            {index + 1}
          </span>
          <p className="text-sm font-medium text-slate-800 leading-relaxed">{question}</p>
        </div>
        <DifficultyBadge difficulty={difficulty} />
      </div>

      {/* Category tag */}
      <div className="px-5 pb-3">
        <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
          <BookOpen size={10} />
          {category}
        </span>
      </div>

      {/* Answer toggle */}
      <button
        type="button"
        onClick={() => setRevealed((r) => !r)}
        className={`w-full flex items-center justify-between gap-2 px-5 py-3 text-xs font-semibold tracking-wide transition-colors duration-150 border-t border-slate-100 ${revealed
            ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100/70'
            : 'bg-slate-50 text-slate-500 hover:bg-slate-100'
          }`}
      >
        <span>{revealed ? 'Hide Answer' : 'Show Answer'}</span>
        {revealed ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
      </button>

      {/* Answer */}
      {revealed && (
        <div className="px-5 py-3 bg-emerald-50/60 border-t border-emerald-100 dp-fade-in">
          <p className="text-sm font-semibold text-emerald-800">{answer}</p>
        </div>
      )}
    </div>
  );
}

export default function TriviaPanel({ data }) {
  console.log(data)
  if (!data?.questions?.length) {
    return (
      <EmptyState
        title="No trivia data available"
        message="Questions could not be loaded. Try refreshing the dashboard."
      />
    );
  }

  const allQuestions = data.questions;
  const [seed, setSeed] = useState(0);

  // Re-shuffle when seed changes, maintaining stable order within a render
  const displayed = useMemo(
    () => pickRandom(allQuestions, 10),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [seed, allQuestions]
  );

  const shuffle = useCallback(() => setSeed((s) => s + 1), []);

  const counts = data.difficultyCounts ?? [];

  return (
    <div className="dp-fade-in">
      {/* Header row */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <SectionTitle>Trivia Questions</SectionTitle>
          <p className="text-xs text-slate-400 mt-0.5">
            Showing 10 of {allQuestions.length} questions · click a card to reveal the answer
          </p>
        </div>
        <button
          type="button"
          onClick={shuffle}
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white text-sm font-semibold rounded-lg shadow-sm transition-all duration-150"
        >
          <Shuffle size={15} />
          Shuffle Questions
        </button>
      </div>

      {/* Difficulty summary chips */}
      {counts.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-6">
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500">
            <Brain size={13} className="text-slate-400" />
            Difficulty breakdown:
          </span>
          {counts.map(({ difficulty, count }) => (
            <span
              key={difficulty}
              className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-full border ${DIFFICULTY_STYLES[difficulty]?.badge ??
                'bg-slate-50 text-slate-600 border-slate-200'
                }`}
            >
              {count} {difficulty}
            </span>
          ))}
        </div>
      )}

      {/* Question cards grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {displayed.map((q, i) => (
          <QuestionCard
            key={`${seed}-${i}`}
            index={i}
            question={q.question}
            answer={q.answer}
            category={q.category}
            difficulty={q.difficulty}
          />
        ))}
      </div>
    </div>
  );
}
