import { motion } from 'framer-motion';
import { User, Star, Coins, Flame, TrendingUp, Trophy } from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import PageWrapper from '../components/layout/PageWrapper';
import XPBar from '../components/ui/XPBar';
import AttributeBar from '../components/ui/AttributeBar';
import AchievementCard from '../components/character/AchievementCard';
import { useGame } from '../context/GameContext';
import { getLevelProgress } from '../utils/progression';

const attributeDescriptions = {
  intellect: 'Built through learning, coding, and reading. Sharpen your mind.',
  strength: 'Forged by exercise, discipline, and physical challenge.',
  vitality: 'Nurtured through wellness, rest, and mindfulness.',
  creativity: 'Expressed through art, design, writing, and imagination.',
};

export default function CharacterPage() {
  const { character, achievements } = useGame();
  const { level, currentXp, requiredXp } = getLevelProgress(character.totalXp);

  const stats = [
    { label: 'Level', value: level, icon: Star, color: 'text-accent-purple-light' },
    { label: 'Total XP', value: character.totalXp.toLocaleString(), icon: TrendingUp, color: 'text-accent-purple-light' },
    { label: 'Gold', value: character.gold.toLocaleString(), icon: Coins, color: 'text-accent-gold' },
    { label: 'Streak', value: `${character.streak} days`, icon: Flame, color: 'text-accent-gold' },
  ];

  return (
    <>
      <Navbar />
      <PageWrapper>
        {/* Character Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-6 sm:p-8 mb-8 relative overflow-hidden"
        >
          {/* Background glow */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-accent-purple/5 rounded-full blur-[80px]" />

          <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center gap-6">
            {/* Avatar */}
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-accent-purple to-accent-gold flex items-center justify-center flex-shrink-0 shadow-glow-purple">
              <User size={36} className="text-white" />
            </div>

            <div className="flex-1">
              <h1 className="font-display text-2xl sm:text-3xl font-bold text-white tracking-wider mb-1">
                {character.characterName}
              </h1>
              <p className="text-sm text-gray-400 mb-4">@{character.username}</p>
              <XPBar totalXp={character.totalXp} />
            </div>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="glass-card p-4 text-center"
            >
              <stat.icon size={20} className={`${stat.color} mx-auto mb-2`} />
              <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">{stat.label}</p>
              <p className="text-lg font-bold text-white">{stat.value}</p>
            </motion.div>
          ))}
        </div>

        {/* Attributes Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <h2 className="font-display text-xl font-bold text-white tracking-wider mb-6 flex items-center gap-2">
            <TrendingUp size={20} className="text-accent-purple" />
            Character Attributes
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {Object.entries(character.attributes).map(([attr, value], i) => (
              <motion.div
                key={attr}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.1 }}
                className="glass-card p-5"
              >
                <AttributeBar attribute={attr} value={value} size="lg" />
                <p className="text-xs text-gray-500 mt-3">
                  {attributeDescriptions[attr]}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Achievements Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h2 className="font-display text-xl font-bold text-white tracking-wider mb-6 flex items-center gap-2">
            <Trophy size={20} className="text-accent-gold" />
            Achievements
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {achievements.map((ach, i) => (
              <AchievementCard key={ach.id} achievement={ach} index={i} />
            ))}
          </div>
        </motion.div>
      </PageWrapper>
    </>
  );
}
