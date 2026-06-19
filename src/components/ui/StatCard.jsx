/**
 * StatCard.jsx
 * Metric card with icon, label, value, optional sub-text, and optional trend badge.
 *
 * Props:
 *   icon      - LucideIcon component
 *   label     - Short descriptor (e.g. "Total Users")
 *   value     - Numeric or string value to display
 *   sub       - Optional supporting text below the value
 *   colorKey  - One of: 'blue' | 'violet' | 'green' | 'amber' | 'cyan' | 'rose'
 *   trend     - Optional { value: number, direction: 'up' | 'down' | 'neutral' }
 */

const COLOR_MAP = {
  blue: { border: 'border-l-blue-500', bg: 'bg-blue-50', text: 'text-blue-600' },
  violet: { border: 'border-l-violet-500', bg: 'bg-violet-50', text: 'text-violet-600' },
  green: { border: 'border-l-emerald-500', bg: 'bg-emerald-50', text: 'text-emerald-600' },
  amber: { border: 'border-l-amber-500', bg: 'bg-amber-50', text: 'text-amber-600' },
  cyan: { border: 'border-l-cyan-500', bg: 'bg-cyan-50', text: 'text-cyan-600' },
  rose: { border: 'border-l-rose-500', bg: 'bg-rose-50', text: 'text-rose-600' },
};

const FALLBACK_COLOR = { border: 'border-l-slate-300', bg: 'bg-slate-50', text: 'text-slate-500' };

const TREND_STYLES = {
  up: 'bg-emerald-50 text-emerald-700',
  down: 'bg-rose-50 text-rose-700',
  neutral: 'bg-slate-100 text-slate-500',
};

const TREND_ARROWS = { up: '↑', down: '↓', neutral: '→' };

export default function StatCard({ icon: Icon, label, value, sub, colorKey, trend }) {
  const colors = COLOR_MAP[colorKey] ?? FALLBACK_COLOR;

  return (
    <div
      className={`flex items-start gap-3.5 p-4 bg-white rounded-lg shadow-sm border border-slate-100 border-l-4 ${colors.border} dp-fade-in`}
    >
      {/* Icon circle */}
      <div
        className={`flex items-center justify-center w-10 h-10 rounded-full shrink-0 ${colors.bg} ${colors.text}`}
        aria-hidden="true"
      >
        <Icon size={21} />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p className="text-xs font-medium text-slate-500 mb-1 truncate">{label}</p>
        <p className="text-2xl font-bold text-slate-800 leading-tight dp-count-up">{value}</p>
        {sub && <p className="text-[11px] text-slate-400 mt-0.5">{sub}</p>}
      </div>

      {/* Trend badge */}
      {trend && (
        <span
          className={`shrink-0 inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[11px] font-semibold ${TREND_STYLES[trend.direction] ?? TREND_STYLES.neutral}`}
          aria-label={`Trend: ${trend.direction} ${trend.value}%`}
        >
          {TREND_ARROWS[trend.direction] ?? '→'} {trend.value}%
        </span>
      )}
    </div>
  );
}
