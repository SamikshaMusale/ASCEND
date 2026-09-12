import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Swords, Target, Zap, Trophy, TrendingUp, ArrowRight, ChevronRight, Flame, Star, ScrollText, Crown, Coins } from 'lucide-react';

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
      <section 
        className="relative h-[100svh] min-h-[600px] flex flex-col justify-center pt-16 pb-4 px-4 bg-cover bg-center bg-no-repeat overflow-hidden" 
        style={{ backgroundImage: "url('/bg_image.png')" }}
      >
        {/* Dark overlay for readability - gradient to darken the text area on the right */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-surface-dark/60 to-surface-dark/95 sm:via-surface-dark/40 sm:to-surface-dark/90"></div>
        <div className="absolute inset-0 bg-black/20"></div>

        <div className="relative z-10 w-full max-w-7xl mx-auto flex justify-end mt-4 sm:mt-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="w-full lg:w-[65%] xl:w-[55%] flex flex-col items-start text-left"
          >
            <p className="text-xs sm:text-sm text-gray-400 uppercase tracking-[0.4em] font-medium mb-2 drop-shadow-md">
              Welcome To
            </p>
            <h1 
              className="font-display text-6xl sm:text-7xl lg:text-[8rem] font-black tracking-wider leading-none mb-3 sm:mb-4"
              style={{ 
                background: 'linear-gradient(to right, #a78bfa, #fcd34d)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                color: 'transparent',
                textShadow: '0 4px 20px rgba(0,0,0,0.5)'
              }}
            >
              ASCEND
            </h1>
            <p className="text-xl sm:text-2xl text-white font-medium mb-3 sm:mb-4 drop-shadow-lg">
              Your Real Life. Your Character. Your RPG.
            </p>
            <p className="text-sm sm:text-base text-gray-400 max-w-lg mb-6 sm:mb-8 drop-shadow-md">
              Transform everyday goals into quests. Build real habits.<br className="hidden sm:block" />
              Level up your character through the work you already do.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 mb-8 sm:mb-10">
              <Link to="/register">
                <motion.span
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="bg-accent-purple hover:bg-accent-purple-light text-white font-medium text-sm sm:text-base flex items-center gap-3 px-6 py-3 rounded-md transition-colors shadow-[0_0_15px_rgba(139,92,246,0.4)]"
                >
                  Begin Your Journey <ArrowRight size={18} />
                </motion.span>
              </Link>
              <a href="#how-it-works">
                <motion.span
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="bg-transparent border border-gray-600 hover:border-white text-gray-300 hover:text-white font-medium text-sm sm:text-base flex items-center gap-3 px-6 py-3 rounded-md transition-colors"
                >
                  Explore the World <ChevronRight size={16} />
                </motion.span>
              </a>
            </div>

            {/* Progression Indicators */}
            <div className="flex flex-wrap sm:flex-nowrap items-start justify-between w-full max-w-3xl mb-8 sm:mb-10 gap-2 sm:gap-4">
               <div className="flex flex-col items-center text-center flex-1">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-black/40 backdrop-blur-md border border-white/5 flex items-center justify-center mb-2 sm:mb-3 text-amber-200 shadow-[0_0_20px_rgba(253,230,138,0.15)]">
                     <ScrollText size={20} strokeWidth={1.5} />
                  </div>
                  <h3 className="text-[10px] sm:text-xs font-bold text-gray-200 tracking-[0.1em] sm:tracking-[0.15em] uppercase mb-1">Choose<br/>Your Quest</h3>
                  <p className="text-[9px] sm:text-[10px] text-gray-500">Set real goals</p>
               </div>
               <div className="flex flex-col items-center text-center flex-1">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-black/40 backdrop-blur-md border border-white/5 flex items-center justify-center mb-2 sm:mb-3 text-purple-300 shadow-[0_0_20px_rgba(216,180,254,0.15)]">
                     <Swords size={20} strokeWidth={1.5} />
                  </div>
                  <h3 className="text-[10px] sm:text-xs font-bold text-gray-200 tracking-[0.1em] sm:tracking-[0.15em] uppercase mb-1 mt-2 sm:mt-0">Complete It</h3>
                  <p className="text-[9px] sm:text-[10px] text-gray-500">Build better habits</p>
               </div>
               <div className="flex flex-col items-center text-center flex-1">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-black/40 backdrop-blur-md border border-white/5 flex items-center justify-center mb-2 sm:mb-3 text-amber-400 shadow-[0_0_20px_rgba(251,191,36,0.15)]">
                     <Coins size={20} strokeWidth={1.5} />
                  </div>
                  <h3 className="text-[10px] sm:text-xs font-bold text-gray-200 tracking-[0.1em] sm:tracking-[0.15em] uppercase mb-1 mt-2 sm:mt-0">Earn XP & Gold</h3>
                  <p className="text-[9px] sm:text-[10px] text-gray-500">Track your progress</p>
               </div>
               <div className="flex flex-col items-center text-center flex-1">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-black/40 backdrop-blur-md border border-white/5 flex items-center justify-center mb-2 sm:mb-3 text-amber-500 shadow-[0_0_20px_rgba(245,158,11,0.15)]">
                     <Crown size={20} strokeWidth={1.5} />
                  </div>
                  <h3 className="text-[10px] sm:text-xs font-bold text-gray-200 tracking-[0.1em] sm:tracking-[0.15em] uppercase mb-1 mt-2 sm:mt-0">Level Up</h3>
                  <p className="text-[9px] sm:text-[10px] text-gray-500">Become your best self</p>
               </div>
            </div>

            {/* Bottom text */}
            <div className="flex flex-col items-center justify-center w-full max-w-3xl mt-auto sm:mt-2">
              <div className="flex items-center justify-center gap-4 w-full mb-4 sm:mb-5">
                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-gray-600 to-gray-600"></div>
                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rotate-45 border border-gray-500"></div>
                <div className="h-px flex-1 bg-gradient-to-l from-transparent via-gray-600 to-gray-600"></div>
              </div>
              <p className="text-[10px] sm:text-xs text-gray-400 uppercase tracking-[0.4em] font-medium mb-1.5 sm:mb-2">
                More Than Productivity
              </p>
              <p className="text-sm sm:text-base font-display font-bold text-purple-500 tracking-[0.3em] uppercase drop-shadow-[0_0_10px_rgba(168,85,247,0.4)]">
                A Better You
              </p>
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
            className="text-center mb-12 sm:mb-16"
          >
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-white tracking-wider mb-4">
              YOUR ADVENTURE AWAITS
            </h2>
            <p className="text-gray-400 text-sm sm:text-base max-w-lg mx-auto">
              Everything you need to gamify your growth.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6 max-w-4xl lg:max-w-5xl mx-auto">
            {features.map((feat, i) => (
              <motion.div
                key={feat.label}
                initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass-card-hover p-6 sm:p-7 flex items-start gap-4 sm:gap-5 rounded-xl"
              >
                <span className="text-3xl sm:text-4xl flex-shrink-0 mt-0.5 select-none">{feat.icon}</span>
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg sm:text-xl font-bold font-display text-white mb-1.5 tracking-wide">
                    {feat.label}
                  </h3>
                  <p className="text-sm sm:text-base text-gray-400 leading-relaxed">
                    {feat.desc}
                  </p>
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
