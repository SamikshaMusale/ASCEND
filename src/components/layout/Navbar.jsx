import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Swords, User, ScrollText, ShoppingBag, LayoutDashboard, LogOut, Menu, X, Flame } from 'lucide-react';
import { useState } from 'react';
import GoldDisplay from '../ui/GoldDisplay';
import { useGame } from '../../context/GameContext';
import { useAuth } from '../../context/AuthContext';

const navLinks = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/quests', label: 'Quests', icon: ScrollText },
  { to: '/character', label: 'Character', icon: User },
  { to: '/loot-vault', label: 'Loot Vault', icon: ShoppingBag },
];

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { character, streak, logout } = useGame();
  const { signOut } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await signOut();
    } catch (err) {
      console.error('Error signing out:', err);
    }
    logout();
    navigate('/');
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-surface-dark/80 backdrop-blur-xl border-b border-white/5" role="navigation" aria-label="Main navigation">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/dashboard" className="flex items-center gap-2 group" aria-label="ASCEND Home">
            <Swords size={24} className="text-accent-purple group-hover:text-accent-purple-light transition-colors" />
            <span className="font-display text-xl font-bold text-gradient-hero tracking-wider">ASCEND</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map(link => {
              const isActive = location.pathname === link.to;
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`relative flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200
                    ${isActive ? 'text-white' : 'text-gray-400 hover:text-white hover:bg-surface-light/30'}`}
                >
                  <link.icon size={16} />
                  <span>{link.label}</span>
                  {isActive && (
                    <motion.div
                      layoutId="nav-active"
                      className="absolute inset-0 bg-accent-purple/10 border border-accent-purple/20 rounded-lg -z-10"
                      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                    />
                  )}
                </Link>
              );
            })}
          </div>

          {/* Right Section */}
          <div className="hidden md:flex items-center gap-4">
            <div className="flex items-center gap-1.5 text-sm text-accent-gold">
              <Flame size={16} className="text-accent-gold" />
              <span className="font-bold">{streak?.current || character?.streak || 0}</span>
            </div>
            <GoldDisplay amount={character?.gold || 0} size="sm" />
            <button
              onClick={handleLogout}
              className="p-2 text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-surface-light/30"
              aria-label="Logout"
            >
              <LogOut size={18} />
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 text-gray-400 hover:text-white transition-colors"
            aria-label="Toggle menu"
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      {mobileOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="md:hidden bg-surface-dark/95 backdrop-blur-xl border-b border-white/5"
        >
          <div className="px-4 py-4 space-y-2">
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/5">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5 text-sm text-accent-gold">
                  <Flame size={16} />
                  <span className="font-bold">{streak?.current || character?.streak || 0}</span>
                </div>
                <GoldDisplay amount={character?.gold || 0} size="sm" />
              </div>
            </div>
            {navLinks.map(link => {
              const isActive = location.pathname === link.to;
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all
                    ${isActive ? 'bg-accent-purple/10 text-white border border-accent-purple/20' : 'text-gray-400 hover:text-white hover:bg-surface-light/30'}`}
                >
                  <link.icon size={18} />
                  <span>{link.label}</span>
                </Link>
              );
            })}
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 w-full px-4 py-3 rounded-lg text-sm font-medium text-gray-400 hover:text-white hover:bg-surface-light/30 transition-all"
            >
              <LogOut size={18} />
              <span>Logout</span>
            </button>
          </div>
        </motion.div>
      )}
    </nav>
  );
}
