import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Swords, Mail, Lock, ArrowRight, Eye, EyeOff } from 'lucide-react';
import Button from '../components/ui/Button';
import { useGame } from '../context/GameContext';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useGame();
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    // MOCK: simulate login delay
    await new Promise(r => setTimeout(r, 800));
    login({ email: form.email });
    setLoading(false);
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-surface-dark flex items-center justify-center px-4 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-accent-purple/5 rounded-full blur-[120px]" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative w-full max-w-md"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-4 group">
            <Swords size={28} className="text-accent-purple group-hover:text-accent-purple-light transition-colors" />
            <span className="font-display text-2xl font-bold text-gradient-hero tracking-wider">ASCEND</span>
          </Link>
          <h1 className="font-display text-xl font-bold text-white tracking-wider mb-1">Welcome Back</h1>
          <p className="text-sm text-gray-500">Continue your journey.</p>
        </div>

        {/* Form Card */}
        <div className="glass-card p-6 sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="login-email" className="label-text mb-2 block">Email</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  id="login-email"
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm(f => ({ ...f, email: e.target.value }))}
                  placeholder="adventurer@ascend.io"
                  className="input-field !pl-10"
                  required
                  autoFocus
                />
              </div>
            </div>

            <div>
              <label htmlFor="login-password" className="label-text mb-2 block">Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  value={form.password}
                  onChange={(e) => setForm(f => ({ ...f, password: e.target.value }))}
                  placeholder="••••••••"
                  className="input-field !pl-10 !pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <Button type="submit" variant="primary" className="w-full flex items-center justify-center gap-2" disabled={loading}>
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>Login <ArrowRight size={16} /></>
              )}
            </Button>
          </form>
        </div>

        {/* Footer */}
        <p className="text-center text-sm text-gray-500 mt-6">
          New adventurer?{' '}
          <Link to="/register" className="text-accent-purple-light hover:text-accent-purple transition-colors font-medium">
            Create Character
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
