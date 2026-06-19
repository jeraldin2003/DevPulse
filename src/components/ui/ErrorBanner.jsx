import { AlertCircle } from 'lucide-react';

export function ErrorBanner({ message }) {
  if (!message) return null;
  return (
    <div className="flex items-start gap-2.5 p-3.5 mb-5 bg-rose-50 border border-rose-200 rounded-xl text-sm text-rose-700 dp-fade-in">
      <AlertCircle size={18} className="shrink-0 text-rose-500 mt-0.5" />
      <span>{message}</span>
    </div>
  );
}
