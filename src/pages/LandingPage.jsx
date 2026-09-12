import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Swords, Target, Zap, Trophy, TrendingUp, ArrowRight, ChevronRight, Flame, Star } from 'lucide-react';
import { Suspense, lazy } from 'react';

const FloatingCrystal = lazy(() => import('../components/three/FloatingCrystal'));

const steps = [
  { icon: Target, title: 'Choose Your Quest', desc: 'Select tasks from your daily goals — learning, fitness, wellness, or creative work.' },
  { icon: Zap, title: 'Complete It', desc: 'Do the work. Finish the quest in the real world.' },
  { icon: Star, title: 'Earn XP & Gold', desc: 'Gain experience points, gold, and attribute progress.' },
  { icon: TrendingUp, title: 'Level Up', desc: 'Watch your character grow as you build real-life habits.' },
];

const features = [
  { icon: '🧠', label: 'Character Attributes', desc: 'Intellect, Strength, Vitality, Creativity — shaped by your real actions.' },
  { icon: '⚔️', label: 'Daily Quests', desc: 'Transform tasks into RPG quests with difficulty and rewards.' },
  { icon: '🔥', label: 'Streaks', desc: 'Build consistency. Maintain your flame.' },
  { icon: '🏆', label: 'Achievements', desc: 'Unlock titles and milestones as you progress.' },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-surface-dark overflow-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-surface-dark/50 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <Swords size={24} className="text-accent-purple" />
            <span className="font-display text-xl font-bold text-gradient-hero tracking-wider">ASCEND</span>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/login" className="text-sm text-gray-400 hover:text-white transition-colors px-4 py-2">
              Login
            </Link>
            <Link to="/register" className="btn-primary text-sm !px-5 !py-2">
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 sm:pt-40 sm:pb-32 px-4">
        {/* Background glow */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-accent-purple/5 rounded-full blur-[120px]" />
          <div className="absolute top-1/3 left-1/3 w-[300px] h-[300px] bg-accent-gold/5 rounded-full blur-[100px]" />
        </div>

        <div className="relative max-w-7xl mx-auto text-center">
          {/* 3D Crystal */}
          <Suspense fallback={<div className="h-[280px]" />}>
            <FloatingCrystal height="280px" className="mb-8" />
          </Suspense>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="font-display text-5xl sm:text-7xl lg:text-8xl font-black tracking-wider text-gradient-hero mb-6">
              ASCEND
            </h1>
            <p className="text-xl sm:text-2xl text-gray-300 font-light mb-3 max-w-2xl mx-auto">
              Your Real Life. Your Character. Your RPG.
            </p>
            <p className="text-base text-gray-500 max-w-xl mx-auto mb-10">
              Transform everyday goals into quests. Build real habits. Level up your character through the work you already do.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/register">
                <motion.span
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="btn-primary text-lg flex items-center gap-2 !px-8 !py-4"
                >
                  Begin Your Journey <ArrowRight size={20} />
                </motion.span>
              </Link>
              <a href="#how-it-works">
                <motion.span
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="btn-secondary text-lg flex items-center gap-2 !px-8 !py-4"
                >
                  Explore the World <ChevronRight size={20} />
                </motion.span>
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 sm:py-28 px-4 bg-grid-pattern">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-white tracking-wider mb-4">
              HOW IT WORKS
            </h2>
            <p className="text-gray-500 max-w-lg mx-auto">
              Four steps to turn your daily grind into an epic adventure.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((step, i) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="glass-card-hover p-6 text-center relative"
              >
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-7 h-7 rounded-full bg-accent-purple text-white text-xs font-bold flex items-center justify-center">
                  {i + 1}
                </div>
                <div className="w-14 h-14 mx-auto mb-4 rounded-xl bg-accent-purple/10 flex items-center justify-center">
                  <step.icon size={26} className="text-accent-purple-light" />
                </div>
                <h3 className="text-base font-semibold text-white mb-2">{step.title}</h3>
                <p className="text-sm text-gray-400">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Preview */}
      <section className="py-20 sm:py-28 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-white tracking-wider mb-4">
              YOUR ADVENTURE AWAITS
            </h2>
            <p className="text-gray-500 max-w-lg mx-auto">
              Everything you need to gamify your growth.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-3xl mx-auto">
            {features.map((feat, i) => (
              <motion.div
                key={feat.label}
                initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass-card-hover p-6 flex items-start gap-4"
              >
                <span className="text-3xl flex-shrink-0">{feat.icon}</span>
                <div>
                  <h3 className="text-base font-semibold text-white mb-1">{feat.label}</h3>
                  <p className="text-sm text-gray-400">{feat.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 sm:py-28 px-4 relative">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-accent-purple/5 rounded-full blur-[100px]" />
        </div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative max-w-2xl mx-auto text-center"
        >
          <Trophy size={48} className="text-accent-gold mx-auto mb-6" />
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-white tracking-wider mb-4">
            READY TO ASCEND?
          </h2>
          <p className="text-gray-400 mb-8">
            Your character is waiting. Start building the hero you want to become.
          </p>
          <Link to="/register">
            <motion.span
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="btn-primary text-lg inline-flex items-center gap-2 !px-10 !py-4"
            >
              Create Your Character <Swords size={20} />
            </motion.span>
          </Link>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-white/5">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Swords size={16} className="text-accent-purple" />
            <span className="font-display text-sm text-gray-500 tracking-wider">ASCEND</span>
          </div>
          <p className="text-xs text-gray-600">
            Built for the IIT Bhubaneswar Hackathon.
          </p>
        </div>
      </footer>
    </div>
  );
}
