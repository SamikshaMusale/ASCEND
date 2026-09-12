import { Suspense, lazy } from 'react';
import { motion } from 'framer-motion';
import { Zap, Coins, Activity } from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import PageWrapper from '../components/layout/PageWrapper';
import XPBar from '../components/ui/XPBar';
import AttributeBar from '../components/ui/AttributeBar';
import GoldDisplay from '../components/ui/GoldDisplay';
import QuestCard from '../components/quest/QuestCard';
import StreakDisplay from '../components/gamification/StreakDisplay';
import BossSection from '../components/gamification/BossSection';
import { useGame } from '../context/GameContext';
import { getLevelProgress } from '../utils/progression';

const FloatingCrystal = lazy(() => import('../components/three/FloatingCrystal'));

export default function DashboardPage() {
  const { character, quests, activity, streak, dailyBoss, completeQuest } = useGame();
  const { level, currentXp, requiredXp } = getLevelProgress(character.totalXp);

  const todayQuests = quests.filter(q => !q.completed).slice(0, 5);
  const completedToday = quests.filter(q => q.completed).length;

  return (
    <>
      <Navbar />
      <PageWrapper>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* ===== LEFT COLUMN (Character + Attributes) ===== */}
          <div className="lg:col-span-2 space-y-6">

            {/* Character Header Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-card p-6 sm:p-8 relative overflow-hidden"
            >
              {/* Background Crystal */}
              <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-40 hidden sm:block pointer-events-none">
                <Suspense fallback={null}>
                  <FloatingCrystal height="100%" />
                </Suspense>
              </div>

              <div className="relative z-10">
                <p className="text-sm text-gray-500 uppercase tracking-wider mb-1">Your Character</p>
                <h1 className="font-display text-2xl sm:text-3xl font-bold text-white tracking-wider mb-1">
                  {character.characterName}
                </h1>
                <p className="text-sm text-gray-400 mb-6">@{character.username}</p>

                {/* Level & XP */}
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-lg bg-accent-purple/20 border border-accent-purple/30 flex items-center justify-center">
                      <span className="font-display font-bold text-accent-purple-light text-sm">{level}</span>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wider">Level</p>
                      <p className="text-sm font-semibold text-white">{level}</p>
                    </div>
                  </div>
                  <div className="h-8 w-px bg-white/10" />
                  <div className="flex items-center gap-2">
                    <Coins size={16} className="text-accent-gold" />
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wider">Gold</p>
                      <p className="text-sm font-semibold text-accent-gold-light">{character.gold.toLocaleString()}</p>
                    </div>
                  </div>
                </div>

                <XPBar totalXp={character.totalXp} size="md" />
              </div>
            </motion.div>

            {/* Attributes */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="glass-card p-6"
            >
              <h2 className="font-display text-lg font-bold text-white tracking-wider mb-5 flex items-center gap-2">
                <Zap size={18} className="text-accent-purple" />
                Attributes
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {Object.entries(character.attributes).map(([attr, value]) => (
                  <AttributeBar key={attr} attribute={attr} value={value} />
                ))}
              </div>
            </motion.div>

            {/* Today's Quests */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h2 className="font-display text-lg font-bold text-white tracking-wider mb-4 flex items-center gap-2">
                ⚔️ Today's Quests
              </h2>
              <div className="space-y-3">
                {todayQuests.length > 0 ? (
                  todayQuests.map(quest => (
                    <QuestCard
                      key={quest.id}
                      quest={quest}
                      onComplete={completeQuest}
                      showActions={true}
                    />
                  ))
                ) : (
                  <div className="glass-card p-8 text-center">
                    <p className="text-gray-500">All quests completed! 🎉</p>
                  </div>
                )}
              </div>
            </motion.div>
          </div>

          {/* ===== RIGHT COLUMN (Boss + Streak + Activity) ===== */}
          <div className="space-y-6">
            {/* Daily Boss */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
            >
              <BossSection boss={dailyBoss} completedQuests={completedToday} />
            </motion.div>

            {/* Streak */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <StreakDisplay streak={streak} />
            </motion.div>

            {/* Recent Activity */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              className="glass-card p-5"
            >
              <h3 className="font-display text-base font-bold text-white tracking-wider mb-4 flex items-center gap-2">
                <Activity size={16} className="text-accent-purple" />
                Recent Activity
              </h3>
              <div className="space-y-3">
                {activity.slice(0, 5).map((act, i) => (
                  <motion.div
                    key={act.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + i * 0.05 }}
                    className="flex items-center justify-between py-2 border-b border-white/5 last:border-0"
                  >
                    <span className="text-sm text-gray-400">{act.text}</span>
                    <span className={`text-sm font-semibold flex-shrink-0 ml-2
                      ${act.type === 'xp' ? 'text-accent-purple-light' : ''}
                      ${act.type === 'gold' ? 'text-accent-gold' : ''}
                      ${act.type === 'achievement' ? 'text-accent-gold-light' : ''}
                    `}>
                      {act.value}
                    </span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </PageWrapper>
    </>
  );
}
