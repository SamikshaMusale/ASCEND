import { motion, AnimatePresence } from 'framer-motion';
import { useGame } from '../../context/GameContext';
import { Star, Sparkles } from 'lucide-react';

export default function LevelUpModal() {
  const { showLevelUp, levelUpData, dismissLevelUp } = useGame();

  return (
    <AnimatePresence>
      {showLevelUp && levelUpData && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[200] flex items-center justify-center p-4"
          onClick={dismissLevelUp}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/80 backdrop-blur-md" />

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.5, rotate: -10 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            exit={{ opacity: 0, scale: 0.5 }}
            transition={{ type: 'spring', stiffness: 200, damping: 15 }}
            onClick={(e) => e.stopPropagation()}
            className="relative text-center"
          >
            {/* Glow Background */}
            <motion.div
              className="absolute inset-0 -m-20 rounded-full bg-gradient-radial from-accent-purple/20 to-transparent blur-3xl"
              animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
              transition={{ duration: 2, repeat: Infinity }}
            />

            {/* Stars */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="relative"
            >
              <div className="flex justify-center mb-4">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
                >
                  <Sparkles size={48} className="text-accent-gold" />
                </motion.div>
              </div>

              <motion.h1
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="font-display text-5xl sm:text-6xl font-black text-gradient-hero mb-6 tracking-widest"
              >
                LEVEL UP!
              </motion.h1>

              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.5, type: 'spring', stiffness: 300 }}
                className="flex items-center justify-center gap-4 mb-6"
              >
                <div className="glass-card px-6 py-4 text-center">
                  <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">From</p>
                  <p className="text-3xl font-display font-bold text-gray-400">
                    {levelUpData.oldLevel}
                  </p>
                </div>
                <motion.div
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 1, repeat: Infinity }}
                >
                  <Star size={28} className="text-accent-gold" />
                </motion.div>
                <div className="glass-card px-6 py-4 text-center border-accent-gold/30">
                  <p className="text-xs text-accent-gold uppercase tracking-wider mb-1">To</p>
                  <p className="text-3xl font-display font-bold text-accent-gold-light">
                    {levelUpData.newLevel}
                  </p>
                </div>
              </motion.div>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
                className="text-gray-400 text-lg mb-8"
              >
                Your potential just increased.
              </motion.p>

              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={dismissLevelUp}
                className="btn-gold text-lg px-10"
              >
                Continue
              </motion.button>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
