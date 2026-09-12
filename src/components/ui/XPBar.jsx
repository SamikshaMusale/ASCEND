import { motion } from 'framer-motion';
import { getLevelProgress } from '../../utils/progression';

export default function XPBar({ totalXp, showLabel = true, size = 'md' }) {
  const { level, currentXp, requiredXp, percentage } = getLevelProgress(totalXp);

  const heights = {
    sm: 'h-2',
    md: 'h-4',
    lg: 'h-6',
  };

  return (
    <div className="w-full" role="progressbar" aria-valuenow={currentXp} aria-valuemin={0} aria-valuemax={requiredXp} aria-label="Experience points">
      {showLabel && (
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-accent-purple-light">
            Level {level}
          </span>
          <span className="text-sm text-gray-400">
            {currentXp.toLocaleString()} / {requiredXp.toLocaleString()} XP
          </span>
        </div>
      )}
      <div className={`w-full bg-surface-dark rounded-full overflow-hidden ${heights[size]} relative`}>
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-accent-purple-dark via-accent-purple to-accent-purple-light relative"
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1, ease: 'easeOut' }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer bg-[length:200%_100%]" />
        </motion.div>
      </div>
    </div>
  );
}
