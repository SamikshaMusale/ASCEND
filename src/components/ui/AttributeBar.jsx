import { motion } from 'framer-motion';

const attributeConfig = {
  intellect: { icon: '🧠', color: 'from-violet-500 to-purple-600', label: 'Intellect' },
  strength: { icon: '💪', color: 'from-amber-500 to-orange-600', label: 'Strength' },
  vitality: { icon: '❤️', color: 'from-rose-500 to-red-600', label: 'Vitality' },
  creativity: { icon: '🎨', color: 'from-cyan-400 to-blue-500', label: 'Creativity' },
};

export default function AttributeBar({ attribute, value, maxValue = 100, showLabel = true, size = 'md' }) {
  const config = attributeConfig[attribute] || attributeConfig.intellect;
  const percentage = Math.min((value / maxValue) * 100, 100);

  const heights = {
    sm: 'h-2',
    md: 'h-3',
    lg: 'h-4',
  };

  return (
    <div className="w-full" role="progressbar" aria-valuenow={value} aria-valuemin={0} aria-valuemax={maxValue} aria-label={config.label}>
      {showLabel && (
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-300 flex items-center gap-2">
            <span>{config.icon}</span>
            <span>{config.label}</span>
          </span>
          <span className="text-sm font-bold text-white">{value}</span>
        </div>
      )}
      <div className={`w-full bg-surface-dark rounded-full overflow-hidden ${heights[size]}`}>
        <motion.div
          className={`h-full rounded-full bg-gradient-to-r ${config.color}`}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1, ease: 'easeOut', delay: 0.2 }}
        />
      </div>
    </div>
  );
}

export { attributeConfig };
