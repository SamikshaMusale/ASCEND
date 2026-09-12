import { motion } from 'framer-motion';
import { Coins, Lock, ShoppingBag } from 'lucide-react';
import Button from '../ui/Button';

const rarityColors = {
  Common: { border: 'border-gray-500/20', badge: 'text-gray-400 bg-gray-500/10' },
  Rare: { border: 'border-accent-purple/20', badge: 'text-accent-purple-light bg-accent-purple/10' },
  Epic: { border: 'border-accent-gold/20', badge: 'text-accent-gold bg-accent-gold/10' },
  Legendary: { border: 'border-accent-gold/30', badge: 'text-accent-gold-light bg-accent-gold/20' },
};

const typeIcons = {
  badge: '🛡️',
  theme: '🎨',
  aura: '✨',
  title: '👑',
};

export default function LootCard({ item, onPurchase, canAfford, index = 0 }) {
  const rarity = rarityColors[item.rarity] || rarityColors.Common;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className={`glass-card-hover p-6 flex flex-col h-full ${item.purchased ? 'ring-1 ring-accent-gold/30' : ''}`}
    >
      {/* Visual / Icon */}
      <div className="flex items-center justify-between mb-4">
        <div className="w-14 h-14 rounded-xl bg-surface-dark/80 flex items-center justify-center text-3xl border border-white/5">
          {typeIcons[item.type] || '📦'}
        </div>
        <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${rarity.badge}`}>
          {item.rarity}
        </span>
      </div>

      {/* Info */}
      <h3 className="text-base font-bold text-white mb-1">{item.name}</h3>
      <p className="text-sm text-gray-400 mb-4 flex-1">{item.description}</p>

      {/* Price & Action */}
      <div className="flex items-center justify-between mt-auto pt-4 border-t border-white/5">
        <div className="flex items-center gap-1.5">
          <Coins size={16} className="text-accent-gold" />
          <span className="font-bold text-accent-gold-light">{item.price}</span>
        </div>

        {item.purchased ? (
          <span className="flex items-center gap-1.5 text-sm font-medium text-accent-gold">
            <ShoppingBag size={14} />
            Owned
          </span>
        ) : (
          <Button
            variant="gold"
            className="!px-4 !py-2 text-sm"
            disabled={!canAfford}
            onClick={() => onPurchase?.(item.id)}
          >
            {canAfford ? 'Unlock' : <><Lock size={12} className="inline mr-1" />Locked</>}
          </Button>
        )}
      </div>
    </motion.div>
  );
}
