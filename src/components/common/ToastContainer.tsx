import React from 'react';
import { useWorkspace } from '../../context/WorkspaceContext';
import { motion, AnimatePresence } from 'motion/react';
import { X, CheckCircle, AlertTriangle, Info } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useWorkspace();

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 pointer-events-none max-w-md w-full">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="pointer-events-auto bg-zinc-900/95 dark:bg-zinc-900/95 border border-zinc-800 text-zinc-100 shadow-2xl backdrop-blur-md rounded-lg p-3.5 flex items-start justify-between gap-3 text-sm"
          >
            <div className="flex items-start gap-2.5">
              {toast.type === 'success' && <CheckCircle size={16} className="text-emerald-400 mt-0.5 shrink-0" />}
              {toast.type === 'warning' && <AlertTriangle size={16} className="text-amber-400 mt-0.5 shrink-0" />}
              {toast.type === 'info' && <Info size={16} className="text-sky-400 mt-0.5 shrink-0" />}
              {(!toast.type || toast.type === 'default') && <Info size={16} className="text-indigo-400 mt-0.5 shrink-0" />}

              <div>
                <p className="font-medium text-zinc-100">{toast.title}</p>
                {toast.description && <p className="text-zinc-400 text-xs mt-0.5">{toast.description}</p>}
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {toast.action && (
                <button
                  onClick={() => {
                    toast.action?.onClick();
                    removeToast(toast.id);
                  }}
                  className="text-xs font-semibold px-2 py-1 bg-zinc-800 hover:bg-zinc-700 text-indigo-400 hover:text-indigo-300 rounded border border-zinc-700/60 transition-colors"
                >
                  {toast.action.label}
                </button>
              )}
              <button
                onClick={() => removeToast(toast.id)}
                className="text-zinc-400 hover:text-zinc-200 p-1 hover:bg-zinc-800/80 rounded transition-colors"
                title="Dismiss"
              >
                <X size={14} />
              </button>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};
