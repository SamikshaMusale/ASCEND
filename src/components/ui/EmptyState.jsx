import { motion } from 'framer-motion';
import { Inbox } from 'lucide-react';

export default function EmptyState({ icon: Icon = Inbox, title = 'Nothing here yet', message = '', action, actionLabel }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-16 text-center"
    >
      <div className="w-16 h-16 rounded-full bg-surface-light/50 flex items-center justify-center mb-4">
        <Icon size={28} className="text-gray-500" />
      </div>
      <h3 className="text-lg font-semibold text-gray-300 mb-1">{title}</h3>
      {message && <p className="text-sm text-gray-500 max-w-md">{message}</p>}
      {action && actionLabel && (
        <button onClick={action} className="btn-primary mt-6 text-sm">
          {actionLabel}
        </button>
      )}
    </motion.div>
  );
}
