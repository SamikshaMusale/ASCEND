import { motion } from 'framer-motion';
import { Flame } from 'lucide-react';

export default function StreakDisplay({ streak }) {
  const { current, days } = streak;

  return (
    <div className="glass-card p-5">
      <div className="flex items-center gap-2 mb-4">
        <motion.div
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <Flame size={22} className="text-accent-gold" />
        </motion.div>
        <h3 className="text-lg font-bold text-white">
          {current} Day Streak
        </h3>
      </div>

      <div className="flex items-center justify-between gap-2">
        {days.map((day, i) => (
          <motion.div
            key={day.day}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="flex flex-col items-center gap-2"
          >
            <span className="text-xs text-gray-500 font-medium">{day.day}</span>
            <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-sm font-bold border transition-all
              ${day.completed
                ? 'bg-accent-gold/20 border-accent-gold/40 text-accent-gold shadow-glow-gold'
                : 'bg-surface-dark/80 border-white/10 text-gray-600'
              }`}
            >
              {day.completed ? '✓' : '○'}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
