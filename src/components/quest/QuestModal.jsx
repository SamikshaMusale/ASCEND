import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Zap, Swords } from 'lucide-react';
import Button from '../ui/Button';
import { calculateQuestRewards } from '../../utils/progression';

const categories = ['Learning', 'Fitness', 'Wellness', 'Creative'];
const difficulties = ['Easy', 'Medium', 'Hard', 'Epic'];

export default function QuestModal({ isOpen, onClose, onSubmit, editQuest = null }) {
  const [form, setForm] = useState({
    name: '',
    description: '',
    category: 'Learning',
    difficulty: 'Medium',
  });

  useEffect(() => {
    if (editQuest) {
      setForm({
        name: editQuest.name,
        description: editQuest.description || '',
        category: editQuest.category,
        difficulty: editQuest.difficulty,
      });
    } else {
      setForm({ name: '', description: '', category: 'Learning', difficulty: 'Medium' });
    }
  }, [editQuest, isOpen]);

  const rewards = calculateQuestRewards(form.category, form.difficulty);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    onSubmit({
      ...(editQuest ? { id: editQuest.id } : {}),
      name: form.name.trim(),
      description: form.description.trim(),
      category: form.category,
      difficulty: form.difficulty,
      xpReward: rewards.xp,
      goldReward: rewards.gold,
      attributeReward: { attribute: rewards.attribute, points: rewards.attributePoints },
    });
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-lg glass-card p-6 sm:p-8"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display text-xl font-bold text-white tracking-wider">
                {editQuest ? 'Edit Quest' : 'Create Quest'}
              </h2>
              <button onClick={onClose} className="p-2 text-gray-400 hover:text-white transition-colors" aria-label="Close modal">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Quest Name */}
              <div>
                <label htmlFor="quest-name" className="label-text mb-2 block">Quest Name</label>
                <input
                  id="quest-name"
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm(f => ({ ...f, name: e.target.value }))}
                  placeholder="e.g. Complete 2 DSA Problems"
                  className="input-field"
                  required
                  autoFocus
                />
              </div>

              {/* Description */}
              <div>
                <label htmlFor="quest-desc" className="label-text mb-2 block">Description</label>
                <textarea
                  id="quest-desc"
                  value={form.description}
                  onChange={(e) => setForm(f => ({ ...f, description: e.target.value }))}
                  placeholder="Describe your quest..."
                  className="input-field resize-none h-20"
                  rows={3}
                />
              </div>

              {/* Category */}
              <div>
                <label className="label-text mb-2 block">Category</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {categories.map(cat => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setForm(f => ({ ...f, category: cat }))}
                      className={`px-3 py-2 rounded-lg text-sm font-medium border transition-all
                        ${form.category === cat
                          ? 'bg-accent-purple/20 border-accent-purple/40 text-white'
                          : 'bg-surface-dark/50 border-white/5 text-gray-400 hover:border-white/20'
                        }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Difficulty */}
              <div>
                <label className="label-text mb-2 block">Difficulty</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {difficulties.map(diff => (
                    <button
                      key={diff}
                      type="button"
                      onClick={() => setForm(f => ({ ...f, difficulty: diff }))}
                      className={`px-3 py-2 rounded-lg text-sm font-medium border transition-all
                        ${form.difficulty === diff
                          ? 'bg-accent-purple/20 border-accent-purple/40 text-white'
                          : 'bg-surface-dark/50 border-white/5 text-gray-400 hover:border-white/20'
                        }`}
                    >
                      {diff}
                    </button>
                  ))}
                </div>
              </div>

              {/* Calculated Rewards */}
              <div className="flex items-center gap-6 py-3 px-4 bg-surface-dark/60 rounded-lg border border-white/5">
                <span className="text-xs text-gray-500 uppercase tracking-wider">Rewards</span>
                <span className="flex items-center gap-1 text-sm text-accent-purple-light font-semibold">
                  <Zap size={14} /> +{rewards.xp} XP
                </span>
                <span className="flex items-center gap-1 text-sm text-accent-gold font-semibold">
                  <Swords size={14} /> +{rewards.gold} Gold
                </span>
                <span className="text-sm text-gray-400">
                  +{rewards.attributePoints} {rewards.attribute.charAt(0).toUpperCase() + rewards.attribute.slice(1)}
                </span>
              </div>

              {/* Submit */}
              <div className="flex gap-3 pt-2">
                <Button type="submit" variant="primary" className="flex-1">
                  {editQuest ? 'Update Quest' : 'Create Quest'}
                </Button>
                <Button type="button" variant="secondary" onClick={onClose}>
                  Cancel
                </Button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
