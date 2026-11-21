import React from 'react';
import { useApp } from '../../contexts/AppContext';
import { CheckCircle2, AlertCircle, Info } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts } = useApp();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`pointer-events-auto flex items-center gap-3 p-3.5 rounded-xl shadow-lg border text-sm font-medium transition-all duration-200 animate-in fade-in slide-in-from-bottom-3 ${
            toast.type === 'success'
              ? 'bg-white text-slate-800 border-emerald-200 shadow-emerald-500/10'
              : toast.type === 'error'
              ? 'bg-white text-slate-800 border-rose-200 shadow-rose-500/10'
              : 'bg-white text-slate-800 border-indigo-200 shadow-indigo-500/10'
          }`}
        >
          {toast.type === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />}
          {toast.type === 'error' && <AlertCircle className="w-5 h-5 text-rose-500 shrink-0" />}
          {toast.type === 'info' && <Info className="w-5 h-5 text-indigo-500 shrink-0" />}
          <span className="flex-1 text-xs sm:text-sm">{toast.message}</span>
        </div>
      ))}
    </div>
  );
};
