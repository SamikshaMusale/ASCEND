// ========================================
// ASCEND — Mock Data
// Structured to mirror future FastAPI API responses.
// ========================================

import { totalXpForLevel, xpForNextLevel } from '../utils/progression';

// ---- Character / User Profile ----
// Mirrors: GET /auth/me + GET /character
export const mockCharacter = {
  id: 'user-001',
  username: 'ArcaneWanderer',
  email: 'wanderer@ascend.io',
  characterName: 'The Persistent Explorer',
  level: 7,
  totalXp: totalXpForLevel(7) + 720, // 720 XP into level 7
  gold: 1280,
  streak: 7,
  createdAt: '2025-08-01T10:00:00Z',
  attributes: {
    intellect: 82,
    strength: 64,
    vitality: 71,
    creativity: 53,
  },
};

// ---- Quests ----
// Mirrors: GET /quests
export const mockQuests = [
  {
    id: 'quest-001',
    name: 'Complete 2 DSA Problems',
    description: 'Solve two data structure & algorithm problems on LeetCode or Codeforces.',
    category: 'Learning',
    difficulty: 'Hard',
    xpReward: 100,
    goldReward: 50,
    attributeReward: { attribute: 'intellect', points: 12 },
    completed: false,
    createdAt: '2025-09-12T06:00:00Z',
  },
  {
    id: 'quest-002',
    name: '30 Minute Workout',
    description: 'Complete a 30-minute workout session — gym, run, or bodyweight.',
    category: 'Fitness',
    difficulty: 'Medium',
    xpReward: 60,
    goldReward: 30,
    attributeReward: { attribute: 'strength', points: 8 },
    completed: false,
    createdAt: '2025-09-12T06:00:00Z',
  },
  {
    id: 'quest-003',
    name: 'Read 20 Pages',
    description: 'Read 20 pages of any non-fiction or technical book.',
    category: 'Learning',
    difficulty: 'Easy',
    xpReward: 30,
    goldReward: 15,
    attributeReward: { attribute: 'intellect', points: 5 },
    completed: false,
    createdAt: '2025-09-12T06:00:00Z',
  },
  {
    id: 'quest-004',
    name: 'Meditate for 15 Minutes',
    description: 'Practice mindfulness or guided meditation.',
    category: 'Wellness',
    difficulty: 'Easy',
    xpReward: 30,
    goldReward: 15,
    attributeReward: { attribute: 'vitality', points: 6 },
    completed: true,
    createdAt: '2025-09-12T06:00:00Z',
  },
  {
    id: 'quest-005',
    name: 'Sketch a Character Design',
    description: 'Draw or digitally sketch a character concept for your portfolio.',
    category: 'Creative',
    difficulty: 'Medium',
    xpReward: 60,
    goldReward: 30,
    attributeReward: { attribute: 'creativity', points: 10 },
    completed: false,
    createdAt: '2025-09-12T06:00:00Z',
  },
  {
    id: 'quest-006',
    name: 'Build a React Component',
    description: 'Create a polished, reusable React component for your project.',
    category: 'Learning',
    difficulty: 'Hard',
    xpReward: 100,
    goldReward: 50,
    attributeReward: { attribute: 'intellect', points: 12 },
    completed: true,
    createdAt: '2025-09-11T06:00:00Z',
  },
];

// ---- Achievements ----
// Mirrors: GET /character (embedded)
export const mockAchievements = [
  {
    id: 'ach-001',
    name: 'First Blood',
    description: 'Complete your first quest.',
    icon: '⚔️',
    unlocked: true,
    unlockedAt: '2025-08-01T12:00:00Z',
  },
  {
    id: 'ach-002',
    name: 'On Fire',
    description: 'Reach a 7-day streak.',
    icon: '🔥',
    unlocked: true,
    unlockedAt: '2025-09-07T12:00:00Z',
  },
  {
    id: 'ach-003',
    name: 'Quest Master',
    description: 'Complete 10 quests.',
    icon: '🏆',
    unlocked: false,
    unlockedAt: null,
  },
  {
    id: 'ach-004',
    name: 'Treasure Hunter',
    description: 'Earn 500 Gold.',
    icon: '💰',
    unlocked: true,
    unlockedAt: '2025-08-20T12:00:00Z',
  },
  {
    id: 'ach-005',
    name: 'Level Up',
    description: 'Reach Level 5.',
    icon: '⭐',
    unlocked: true,
    unlockedAt: '2025-08-15T12:00:00Z',
  },
  {
    id: 'ach-006',
    name: 'Iron Will',
    description: 'Complete 5 Hard quests.',
    icon: '🛡️',
    unlocked: false,
    unlockedAt: null,
  },
];

// ---- Loot Vault Items ----
// Mirrors: GET /shop
export const mockLootItems = [
  {
    id: 'loot-001',
    name: 'Iron Frame',
    description: 'For those who keep going. A badge of persistence.',
    price: 250,
    type: 'badge',
    rarity: 'Common',
    purchased: false,
  },
  {
    id: 'loot-002',
    name: 'Void Theme',
    description: 'Enter the unknown. Unlock a dark void visual theme.',
    price: 500,
    type: 'theme',
    rarity: 'Rare',
    purchased: false,
  },
  {
    id: 'loot-003',
    name: 'Champion Badge',
    description: 'Earned, never given. Display your champion status.',
    price: 400,
    type: 'badge',
    rarity: 'Rare',
    purchased: true,
  },
  {
    id: 'loot-004',
    name: 'Warrior Aura',
    description: 'Strength leaves a mark. A glowing aura effect.',
    price: 750,
    type: 'aura',
    rarity: 'Epic',
    purchased: false,
  },
  {
    id: 'loot-005',
    name: 'Legendary Title',
    description: 'Become the legend. The ultimate title for your character.',
    price: 1000,
    type: 'title',
    rarity: 'Legendary',
    purchased: false,
  },
];

// ---- Activity Log ----
// Mirrors: GET /dashboard (embedded)
export const mockActivity = [
  { id: 'act-001', type: 'xp', text: 'DSA Quest completed', value: '+100 XP', timestamp: '2025-09-12T08:30:00Z' },
  { id: 'act-002', type: 'xp', text: 'Workout completed', value: '+60 XP', timestamp: '2025-09-12T07:15:00Z' },
  { id: 'act-003', type: 'gold', text: 'Quest reward', value: '+30 Gold', timestamp: '2025-09-12T07:15:00Z' },
  { id: 'act-004', type: 'xp', text: 'Meditation completed', value: '+30 XP', timestamp: '2025-09-11T21:00:00Z' },
  { id: 'act-005', type: 'achievement', text: 'Achievement unlocked: On Fire', value: '🔥', timestamp: '2025-09-11T20:00:00Z' },
];

// ---- Streak Data ----
export const mockStreak = {
  current: 7,
  days: [
    { day: 'Mon', completed: true },
    { day: 'Tue', completed: true },
    { day: 'Wed', completed: true },
    { day: 'Thu', completed: true },
    { day: 'Fri', completed: true },
    { day: 'Sat', completed: true },
    { day: 'Sun', completed: false },
  ],
};

// ---- Daily Boss ----
export const mockDailyBoss = {
  name: 'The Procrastination Beast',
  totalQuests: 3,
  description: 'Complete 3 quests today to defeat the boss.',
};
