export default function LoadingSpinner({ message = "Loading dashboard..." }) {
  return (
    <div className="flex flex-col items-center justify-center flex-1 gap-4 min-h-[300px] text-slate-500">
      <div className="w-10 h-10 border-3 border-slate-200 border-t-blue-600 rounded-full animate-spin" aria-hidden="true" />
      <p className="text-sm font-medium">{message}</p>
    </div>
  );
}
