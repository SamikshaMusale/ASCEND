// ========================================
// ASCEND — Mock API Services
// MOCK FRONTEND LOGIC — mirrors future FastAPI endpoints.
// Replace these with real fetch/axios calls when backend is ready.
// ========================================

import {
  mockCharacter,
  mockQuests,
  mockAchievements,
  mockLootItems,
  mockActivity,
  mockStreak,
  mockDailyBoss,
} from '../data/mockData';

// Simulate async API delay
const delay = (ms = 300) => new Promise(resolve => setTimeout(resolve, ms));

// ---- AUTH SERVICES ----
// POST /auth/register
export async function registerUser({ username, email, password }) {
  await delay(500);
  return {
    id: 'user-001',
    username,
    email,
    token: 'mock-jwt-token-' + Date.now(),
  };
}

// POST /auth/login
export async function loginUser({ email, password }) {
  await delay(500);
  return {
    id: mockCharacter.id,
    username: mockCharacter.username,
    email: mockCharacter.email,
    token: 'mock-jwt-token-' + Date.now(),
  };
}

// GET /auth/me
export async function getCurrentUser() {
  await delay(200);
  return { ...mockCharacter };
}

// ---- DASHBOARD SERVICES ----
// GET /dashboard
export async function getDashboard() {
  await delay(300);
  return {
    character: { ...mockCharacter },
    todayQuests: mockQuests.filter(q => q.createdAt.startsWith('2025-09-12')),
    activity: [...mockActivity],
    streak: { ...mockStreak },
    dailyBoss: { ...mockDailyBoss },
  };
}

// ---- QUEST SERVICES ----
// GET /quests
export async function getQuests() {
  await delay(300);
  return [...mockQuests];
}

// POST /quests
export async function createQuest(questData) {
  await delay(300);
  return {
    id: 'quest-' + Date.now(),
    ...questData,
    completed: false,
    createdAt: new Date().toISOString(),
  };
}

// PUT /quests/{id}
export async function updateQuest(id, questData) {
  await delay(300);
  return { id, ...questData };
}

// DELETE /quests/{id}
export async function deleteQuest(id) {
  await delay(200);
  return { success: true };
}

// POST /quests/{id}/complete
export async function completeQuest(id) {
  await delay(300);
  const quest = mockQuests.find(q => q.id === id);
  if (!quest) throw new Error('Quest not found');
  return {
    quest: { ...quest, completed: true },
    rewards: {
      xp: quest.xpReward,
      gold: quest.goldReward,
      attribute: quest.attributeReward,
    },
  };
}

// ---- CHARACTER SERVICES ----
// GET /character
export async function getCharacter() {
  await delay(300);
  return {
    character: { ...mockCharacter },
    achievements: [...mockAchievements],
  };
}

// ---- SHOP SERVICES ----
// GET /shop
export async function getShop() {
  await delay(300);
  return [...mockLootItems];
}

// POST /shop/{item_id}/buy
export async function purchaseItem(itemId) {
  await delay(400);
  const item = mockLootItems.find(i => i.id === itemId);
  if (!item) throw new Error('Item not found');
  return {
    item: { ...item, purchased: true },
    remainingGold: mockCharacter.gold - item.price,
  };
}
