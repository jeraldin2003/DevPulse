const DIFFICULTY_LABELS = ['easy', 'medium', 'hard', 'random'];

export function SelectionScreen({ onStart, error }) {
  return (
    <div className="flex flex-col items-center justify-center p-10 bg-white border border-slate-200 rounded-2xl shadow-sm dp-fade-in max-w-md mx-auto">
      <div className="w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center mb-6">
        <span className="text-3xl" role="img" aria-label="brain">
          🧠
        </span>
      </div>
      <h2 className="text-2xl font-bold text-slate-800 mb-2">Trivia Quiz</h2>
      <p className="text-slate-500 text-sm mb-8 text-center">
        10 questions. Choose your difficulty and put your knowledge to the test.
      </p>
      <div className="grid grid-cols-2 gap-3 w-full">
        {DIFFICULTY_LABELS.map((level) => (
          <button
            key={level}
            type="button"
            onClick={() => onStart(level)}
            className={[
              'px-5 py-3 rounded-xl font-semibold text-sm capitalize cursor-pointer',
              'transition-all duration-150 border',
              level === 'easy'
                ? 'bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100'
                : level === 'medium'
                  ? 'bg-amber-50   border-amber-200   text-amber-700   hover:bg-amber-100'
                  : level === 'hard'
                    ? 'bg-rose-50    border-rose-200    text-rose-700    hover:bg-rose-100'
                    : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100',
            ].join(' ')}
          >
            {level === 'random' ? '🎲 Random' : level}
          </button>
        ))}
      </div>
      {error && (
        <p className="mt-5 text-sm text-rose-600 bg-rose-50 border border-rose-200 rounded-lg px-4 py-2 w-full text-center">
          {error}
        </p>
      )}
    </div>
  );
}
