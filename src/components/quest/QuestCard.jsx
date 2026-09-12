import { motion } from 'framer-motion';
import { CheckCircle, Swords, Trash2, Edit, Zap } from 'lucide-react';

const categoryColors = {
  Learning: { bg: 'bg-violet-500/10', text: 'text-violet-400', border: 'border-violet-500/20' },
  Fitness: { bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'border-amber-500/20' },
  Wellness: { bg: 'bg-rose-500/10', text: 'text-rose-400', border: 'border-rose-500/20' },
  Creative: { bg: 'bg-cyan-500/10', text: 'text-cyan-400', border: 'border-cyan-500/20' },
};

const categoryLabels = {
  Learning: 'Intellect',
  Fitness: 'Strength',
  Wellness: 'Vitality',
  Creative: 'Creativity',
};

const difficultyColors = {
  Easy: 'text-gray-400',
  Medium: 'text-accent-purple-light',
  Hard: 'text-accent-gold',
  Epic: 'text-semantic-error',
};

export default function QuestCard({ quest, onComplete, onEdit, onDelete, showActions = true }) {
  const cat = categoryColors[quest.category] || categoryColors.Learning;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      className={`glass-card-hover p-5 transform-gpu ${quest.completed ? 'opacity-60' : ''}`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          {/* Category & Difficulty */}
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <span className={`text-xs font-medium px-2.5 py-1 rounded-full border ${cat.bg} ${cat.text} ${cat.border}`}>
              {categoryLabels[quest.category] || quest.category}
            </span>
            <span className={`text-xs font-medium ${difficultyColors[quest.difficulty]}`}>
              {quest.difficulty}
            </span>
          </div>

          {/* Title */}
          <h3 className={`text-base font-semibold mb-1 ${quest.completed ? 'line-through text-gray-500' : 'text-white'}`}>
            {quest.name}
          </h3>

          {/* Description */}
          {quest.description && (
            <p className="text-sm text-gray-400 mb-3 line-clamp-2">{quest.description}</p>
          )}

          {/* Rewards */}
          <div className="flex items-center gap-4 text-xs">
            <span className="flex items-center gap-1 text-accent-purple-light">
              <Zap size={12} />
              +{quest.xpReward} XP
            </span>
            <span className="flex items-center gap-1 text-accent-gold">
              <Swords size={12} />
              +{quest.goldReward} Gold
            </span>
            {quest.attributeReward && (
              <span className="text-gray-400">
                +{quest.attributeReward.points} {quest.attributeReward.attribute.charAt(0).toUpperCase() + quest.attributeReward.attribute.slice(1)}
              </span>
            )}
          </div>
        </div>

        {/* Actions */}
        {showActions && (
          <div className="flex flex-col gap-2 flex-shrink-0">
            {!quest.completed ? (
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => onComplete?.(quest.id)}
                className="p-2.5 rounded-lg bg-accent-purple/20 border border-accent-purple/30 text-accent-purple hover:bg-accent-purple/30 hover:shadow-glow-purple transition-all"
                aria-label={`Complete quest: ${quest.name}`}
              >
                <CheckCircle size={18} />
              </motion.button>
            ) : (
              <div className="p-2.5 rounded-lg bg-semantic-success/10 border border-semantic-success/20 text-semantic-success">
                <CheckCircle size={18} />
              </div>
            )}
            {onEdit && !quest.completed && (
              <button
                onClick={() => onEdit?.(quest)}
                className="p-2 rounded-lg text-gray-500 hover:text-white hover:bg-surface-light/30 transition-all"
                aria-label={`Edit quest: ${quest.name}`}
              >
                <Edit size={14} />
              </button>
            )}
            {onDelete && (
              <button
                onClick={() => onDelete?.(quest.id)}
                className="p-2 rounded-lg text-gray-500 hover:text-semantic-error hover:bg-semantic-error/10 transition-all"
                aria-label={`Delete quest: ${quest.name}`}
              >
                <Trash2 size={14} />
              </button>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
}
