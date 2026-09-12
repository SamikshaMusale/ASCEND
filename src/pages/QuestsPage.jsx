import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Filter, ScrollText } from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import PageWrapper from '../components/layout/PageWrapper';
import QuestCard from '../components/quest/QuestCard';
import QuestModal from '../components/quest/QuestModal';
import EmptyState from '../components/ui/EmptyState';
import Button from '../components/ui/Button';
import { useGame } from '../context/GameContext';

const categories = ['All', 'Learning', 'Fitness', 'Wellness', 'Creative'];
const statuses = ['All', 'Active', 'Completed'];

export default function QuestsPage() {
  const { quests, completeQuest, addQuest, updateQuest, deleteQuest } = useGame();
  const [modalOpen, setModalOpen] = useState(false);
  const [editQuest, setEditQuest] = useState(null);
  const [filterCategory, setFilterCategory] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');

  const filteredQuests = useMemo(() => {
    return quests.filter(q => {
      if (filterCategory !== 'All' && q.category !== filterCategory) return false;
      if (filterStatus === 'Active' && q.completed) return false;
      if (filterStatus === 'Completed' && !q.completed) return false;
      return true;
    });
  }, [quests, filterCategory, filterStatus]);

  const handleEdit = (quest) => {
    setEditQuest(quest);
    setModalOpen(true);
  };

  const handleSubmit = (questData) => {
    if (editQuest) {
      updateQuest(questData);
    } else {
      addQuest(questData);
    }
    setEditQuest(null);
  };

  const handleClose = () => {
    setModalOpen(false);
    setEditQuest(null);
  };

  return (
    <>
      <Navbar />
      <PageWrapper>
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="font-display text-2xl sm:text-3xl font-bold text-white tracking-wider flex items-center gap-3">
              <ScrollText size={28} className="text-accent-purple" />
              Your Quests
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              {quests.filter(q => !q.completed).length} active · {quests.filter(q => q.completed).length} completed
            </p>
          </div>
          <Button variant="primary" onClick={() => setModalOpen(true)} className="flex items-center gap-2">
            <Plus size={18} /> Create Quest
          </Button>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          {/* Category Filter */}
          <div className="flex items-center gap-2 flex-wrap">
            <Filter size={14} className="text-gray-500" />
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setFilterCategory(cat)}
                className={`text-xs font-medium px-3 py-1.5 rounded-full border transition-all
                  ${filterCategory === cat
                    ? 'bg-accent-purple/20 border-accent-purple/40 text-white'
                    : 'bg-surface-dark/50 border-white/5 text-gray-400 hover:border-white/20'
                  }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-2">
            {statuses.map(status => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`text-xs font-medium px-3 py-1.5 rounded-full border transition-all
                  ${filterStatus === status
                    ? 'bg-accent-purple/20 border-accent-purple/40 text-white'
                    : 'bg-surface-dark/50 border-white/5 text-gray-400 hover:border-white/20'
                  }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        {/* Quest List */}
        <div className="space-y-3">
          <AnimatePresence mode="popLayout">
            {filteredQuests.length > 0 ? (
              filteredQuests.map(quest => (
                <QuestCard
                  key={quest.id}
                  quest={quest}
                  onComplete={completeQuest}
                  onEdit={handleEdit}
                  onDelete={deleteQuest}
                />
              ))
            ) : (
              <EmptyState
                icon={ScrollText}
                title="No quests found"
                message={filterCategory !== 'All' || filterStatus !== 'All'
                  ? "Try adjusting your filters."
                  : "Create your first quest to begin your adventure."}
                action={() => setModalOpen(true)}
                actionLabel="Create Quest"
              />
            )}
          </AnimatePresence>
        </div>

        {/* Quest Modal */}
        <QuestModal
          isOpen={modalOpen}
          onClose={handleClose}
          onSubmit={handleSubmit}
          editQuest={editQuest}
        />
      </PageWrapper>
    </>
  );
}
