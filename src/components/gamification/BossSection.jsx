import { motion } from 'framer-motion';
import { Skull, Swords } from 'lucide-react';

export default function BossSection({ boss, completedQuests }) {
  const progress = Math.min(completedQuests / boss.totalQuests, 1);
  const defeated = completedQuests >= boss.totalQuests;

  return (
    <div className={`glass-card p-5 border ${defeated ? 'border-accent-gold/30' : 'border-semantic-error/10'}`}>
      <div className="flex items-center gap-3 mb-4">
        <motion.div
          animate={defeated ? {} : { scale: [1, 1.1, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className={`w-10 h-10 rounded-lg flex items-center justify-center ${defeated ? 'bg-accent-gold/10' : 'bg-semantic-error/10'}`}
        >
          {defeated ? <Swords size={20} className="text-accent-gold" /> : <Skull size={20} className="text-semantic-error" />}
        </motion.div>
        <div>
          <h3 className="text-base font-bold text-white">{boss.name}</h3>
          <p className="text-xs text-gray-500">Daily Boss</p>
        </div>
      </div>

      {/* HP Bar */}
      <div className="mb-3">
        <div className="flex justify-between text-xs mb-1.5">
          <span className="text-gray-400">Boss HP</span>
          <span className={defeated ? 'text-accent-gold' : 'text-semantic-error'}>
            {completedQuests} / {boss.totalQuests} hits
          </span>
        </div>
        <div className="w-full h-3 bg-surface-dark rounded-full overflow-hidden">
          <motion.div
            className={`h-full rounded-full ${defeated
              ? 'bg-gradient-to-r from-accent-gold-dark to-accent-gold'
              : 'bg-gradient-to-r from-semantic-error/80 to-semantic-error'
              }`}
            initial={{ width: 0 }}
            animate={{ width: `${progress * 100}%` }}
            transition={{ duration: 1, ease: 'easeOut' }}
          />
        </div>
      </div>

      <p className="text-xs text-gray-500">
        {defeated
          ? '🎉 Boss defeated! You conquered today\'s challenge.'
          : boss.description}
      </p>
    </div>
  );
}
