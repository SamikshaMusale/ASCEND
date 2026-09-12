import { motion, AnimatePresence } from 'framer-motion';
import { useEffect } from 'react';
import { X, CheckCircle, AlertCircle, Coins } from 'lucide-react';
import { useGame } from '../../context/GameContext';

const toastIcons = {
  success: <CheckCircle size={20} className="text-semantic-success" />,
  error: <AlertCircle size={20} className="text-semantic-error" />,
  gold: <Coins size={20} className="text-accent-gold" />,
  info: <AlertCircle size={20} className="text-accent-purple" />,
};

const toastBorders = {
  success: 'border-semantic-success/30',
  error: 'border-semantic-error/30',
  gold: 'border-accent-gold/30',
  info: 'border-accent-purple/30',
};

function Toast({ toast, onDismiss }) {
  useEffect(() => {
    const timer = setTimeout(() => onDismiss(toast.id), 4000);
    return () => clearTimeout(timer);
  }, [toast.id, onDismiss]);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 100, scale: 0.9 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 100, scale: 0.9 }}
      className={`flex items-start gap-3 p-4 bg-surface-card/95 backdrop-blur-md border ${toastBorders[toast.type] || toastBorders.info} rounded-lg shadow-glass max-w-sm`}
    >
      <div className="flex-shrink-0 mt-0.5">
        {toastIcons[toast.type] || toastIcons.info}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-white">{toast.title}</p>
        {toast.message && (
          <p className="text-xs text-gray-400 mt-0.5">{toast.message}</p>
        )}
      </div>
      <button
        onClick={() => onDismiss(toast.id)}
        className="flex-shrink-0 text-gray-500 hover:text-white transition-colors"
        aria-label="Dismiss notification"
      >
        <X size={16} />
      </button>
    </motion.div>
  );
}

export default function ToastContainer() {
  const { toasts, dismissToast } = useGame();

  return (
    <div className="fixed top-4 right-4 z-[100] flex flex-col gap-2" aria-live="polite">
      <AnimatePresence>
        {toasts.map(toast => (
          <Toast key={toast.id} toast={toast} onDismiss={dismissToast} />
        ))}
      </AnimatePresence>
    </div>
  );
}
