import { Coins } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';

export default function GoldDisplay({ amount, size = 'md' }) {
  const [displayAmount, setDisplayAmount] = useState(amount);

  useEffect(() => {
    setDisplayAmount(amount);
  }, [amount]);

  const sizes = {
    sm: 'text-sm gap-1',
    md: 'text-base gap-1.5',
    lg: 'text-xl gap-2',
  };

  const iconSizes = {
    sm: 14,
    md: 16,
    lg: 22,
  };

  return (
    <div className={`flex items-center ${sizes[size]}`} aria-label={`${amount} Gold`}>
      <Coins size={iconSizes[size]} className="text-accent-gold" />
      <AnimatePresence mode="wait">
        <motion.span
          key={displayAmount}
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 10, opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="font-bold text-accent-gold-light"
        >
          {displayAmount.toLocaleString()}
        </motion.span>
      </AnimatePresence>
    </div>
  );
}
