export default function StatCard({ icon: Icon, label, value, sub, color }) {
  let borderClass = "border-l-4 border-slate-300";
  let bgClass = "bg-slate-50";
  let textClass = "text-slate-600";

  const c = color?.trim().toLowerCase();
  if (c === "#3b6cf4" || c === "#3b82f6" || c === "blue") {
    borderClass = "border-l-4 border-blue-500";
    bgClass = "bg-blue-50/80";
    textClass = "text-blue-600";
  } else if (c === "#8b5cf6" || c === "violet" || c === "purple") {
    borderClass = "border-l-4 border-violet-500";
    bgClass = "bg-violet-50/80";
    textClass = "text-violet-600";
  } else if (c === "#70ad47" || c === "green" || c === "#22c55e") {
    borderClass = "border-l-4 border-emerald-500";
    bgClass = "bg-emerald-50/80";
    textClass = "text-emerald-600";
  } else if (c === "#f59e0b" || c === "amber" || c === "yellow" || c === "#ffc000") {
    borderClass = "border-l-4 border-amber-500";
    bgClass = "bg-amber-50/80";
    textClass = "text-amber-600";
  } else if (c === "#06b6d4" || c === "cyan") {
    borderClass = "border-l-4 border-cyan-500";
    bgClass = "bg-cyan-50/80";
    textClass = "text-cyan-600";
  } else if (c === "#ff6b6b" || c === "red" || c === "#ef4444") {
    borderClass = "border-l-4 border-rose-500";
    bgClass = "bg-rose-50/80";
    textClass = "text-rose-600";
  }

  return (
    <div className={`flex items-start gap-3.5 p-4 bg-white rounded-lg shadow-sm border border-slate-100 ${borderClass}`}>
      <div className={`flex items-center justify-center w-10 h-10 rounded-full shrink-0 ${bgClass} ${textClass}`}>
        <Icon size={22} />
      </div>

      <div>
        <p className="text-xs font-medium text-slate-500 mb-1">{label}</p>
        <p className="text-2xl font-bold text-slate-800 leading-tight">{value}</p>
        {sub && <p className="text-[11px] text-slate-400 mt-1">{sub}</p>}
      </div>
    </div>
  );
}
