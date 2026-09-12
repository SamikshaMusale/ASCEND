import { motion } from 'framer-motion';
import { ShoppingBag, Coins } from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import PageWrapper from '../components/layout/PageWrapper';
import LootCard from '../components/loot/LootCard';
import GoldDisplay from '../components/ui/GoldDisplay';
import { useGame } from '../context/GameContext';

export default function LootVaultPage() {
  const { lootItems, character, purchaseItem } = useGame();

  return (
    <>
      <Navbar />
      <PageWrapper>
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="font-display text-2xl sm:text-3xl font-bold text-white tracking-wider flex items-center gap-3">
              <ShoppingBag size={28} className="text-accent-gold" />
              The Loot Vault
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Spend your hard-earned Gold on rewards and customizations.
            </p>
          </div>
          <div className="glass-card px-5 py-3 flex items-center gap-3">
            <span className="text-xs text-gray-500 uppercase tracking-wider">Your Gold</span>
            <GoldDisplay amount={character.gold} size="lg" />
          </div>
        </div>

        {/* Items Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {lootItems.map((item, i) => (
            <LootCard
              key={item.id}
              item={item}
              onPurchase={purchaseItem}
              canAfford={character.gold >= item.price}
              index={i}
            />
          ))}
        </div>
      </PageWrapper>
    </>
  );
}
