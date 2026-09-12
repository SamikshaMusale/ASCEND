import { motion } from 'framer-motion';
import { Lock, CheckCircle } from 'lucide-react';

export default function AchievementCard({ achievement, index = 0 }) {
  const { name, description, icon, unlocked } = achievement;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className={`glass-card p-4 flex items-center gap-4 transition-all duration-300
        ${unlocked
          ? 'border-accent-gold/20 hover:border-accent-gold/40 hover:shadow-glow-gold'
          : 'opacity-50 grayscale'
        }`}
    >
      {/* Icon */}
      <div className={`w-12 h-12 rounded-lg flex items-center justify-center text-2xl flex-shrink-0
        ${unlocked ? 'bg-accent-gold/10' : 'bg-surface-dark/80'}`}
      >
        {unlocked ? icon : <Lock size={20} className="text-gray-600" />}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <h4 className={`text-sm font-semibold ${unlocked ? 'text-white' : 'text-gray-500'}`}>
          {name}
        </h4>
        <p className={`text-xs ${unlocked ? 'text-gray-400' : 'text-gray-600'}`}>
          {description}
        </p>
      </div>

      {/* Status */}
      {unlocked && (
        <CheckCircle size={18} className="text-accent-gold flex-shrink-0" />
      )}
    </motion.div>
  );
}
