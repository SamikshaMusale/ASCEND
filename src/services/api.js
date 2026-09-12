// ========================================
// ASCEND — API Services (Backend-Connected)
// Replaces mock API with real FastAPI calls.
// Transforms snake_case responses → camelCase
// to match existing UI component contracts.
// ========================================

import { apiGet, apiPost, apiDelete } from '../utils/apiClient';
import { CATEGORY_ATTRIBUTE_MAP } from '../utils/progression';

// ============================================================
//  TRANSFORM HELPERS
//  Backend returns snake_case; UI expects camelCase with
//  specific nested structures (e.g. attributeReward, attributes).
// ============================================================

/**
 * Transform a backend quest object to match the frontend shape.
 * Backend: { id, title, description, category, difficulty, xp_reward, gold_reward, completed, created_at, completed_at }
 * Frontend: { id, name, description, category, difficulty, xpReward, goldReward, attributeReward, completed, createdAt }
 */
function transformQuest(q) {
  const attribute = CATEGORY_ATTRIBUTE_MAP[q.category] || 'intellect';
  return {
    id: q.id,
    name: q.title,
    description: q.description,
    category: q.category,
    difficulty: q.difficulty,
    xpReward: q.xp_reward,
    goldReward: q.gold_reward,
    attributeReward: {
      attribute,
      points: getDifficultyAttributePoints(q.difficulty),
    },
    completed: q.completed,
    createdAt: q.created_at,
    completedAt: q.completed_at,
  };
}

/** Attribute points by difficulty (mirrors backend services.py) */
function getDifficultyAttributePoints(difficulty) {
  const map = { Easy: 2, Medium: 4, Hard: 6, Epic: 10 };
  return map[difficulty] || 2;
}

/**
 * Transform a backend character object to match the frontend shape.
 * Backend: { id, user_id, level, xp, gold, streak, intellect, strength, vitality, creativity, ... }
 * Frontend: { id, username, level, totalXp, gold, streak, attributes: { intellect, strength, vitality, creativity } }
 */
function transformCharacter(char, user = null) {
  return {
    id: char.user_id || char.id,
    username: user?.username || '',
    characterName: user?.username || '',
    email: user?.email || '',
    level: char.level,
    totalXp: char.xp,
    gold: char.gold,
    streak: char.streak,
    lastActivityDate: char.last_activity_date,
    createdAt: char.created_at,
    attributes: {
      intellect: char.intellect,
      strength: char.strength,
      vitality: char.vitality,
      creativity: char.creativity,
    },
  };
}

/**
 * Transform a backend achievement status to match the frontend shape.
 * Backend: { id, name, description, icon, unlocked, unlocked_at }
 * Frontend: { id, name, description, icon, unlocked, unlockedAt }
 */
function transformAchievement(a) {
  return {
    id: a.id,
    name: a.name,
    description: a.description,
    icon: a.icon,
    unlocked: a.unlocked,
    unlockedAt: a.unlocked_at,
  };
}

/**
 * Transform a backend activity log to match the frontend shape.
 * Backend: { id, type, message, created_at }
 * Frontend: { id, type, text, value, timestamp }
 */
function transformActivityLog(log) {
  // Parse reward values from the message for display
  let value = '';
  if (log.type === 'quest_complete') {
    const xpMatch = log.message.match(/\+(\d+)\s*XP/);
    if (xpMatch) value = `+${xpMatch[1]} XP`;
  } else if (log.type === 'level_up') {
    const lvlMatch = log.message.match(/to (\d+)/);
    if (lvlMatch) value = `⭐ Lvl ${lvlMatch[1]}`;
  } else if (log.type === 'purchase') {
    const goldMatch = log.message.match(/(\d+)\s*Gold/);
    if (goldMatch) value = `-${goldMatch[1]} Gold`;
  } else if (log.type === 'achievement') {
    value = '🏆';
  }

  // Map backend type to the frontend display type
  let displayType = log.type;
  if (log.type === 'quest_complete') displayType = 'xp';
  else if (log.type === 'purchase') displayType = 'gold';

  return {
    id: log.id,
    type: displayType,
    text: log.message,
    value,
    timestamp: log.created_at,
  };
}

/**
 * Transform a backend shop item to match the frontend shape.
 * Backend: { id, name, description, price, type, purchased }
 * Frontend: { id, name, description, price, type, rarity, purchased }
 */
function transformShopItem(item) {
  // Derive rarity from price (matches seed data expectations)
  let rarity = 'Common';
  if (item.price >= 5000) rarity = 'Legendary';
  else if (item.price >= 2500) rarity = 'Epic';
  else if (item.price >= 500) rarity = 'Rare';

  return {
    id: item.id,
    name: item.name,
    description: item.description,
    price: item.price,
    type: item.type,
    rarity,
    purchased: item.purchased,
  };
}


// ============================================================
//  AUTH SERVICES
// ============================================================

/**
 * POST /auth/register — Initialize backend profile after Supabase signup.
 */
export async function registerUser({ username, email }) {
  const data = await apiPost('/auth/register', { username, email });
  return data;
}

/**
 * GET /auth/me — Get the authenticated user's profile.
 */
export async function getCurrentUser() {
  const data = await apiGet('/auth/me');
  return data;
}


// ============================================================
//  DASHBOARD SERVICES
// ============================================================

/**
 * GET /dashboard — Aggregated dashboard data.
 * Also fetches /auth/me for user profile info.
 */
export async function getDashboard() {
  const [dashboard, user] = await Promise.all([
    apiGet('/dashboard'),
    apiGet('/auth/me'),
  ]);

  return {
    character: transformCharacter(dashboard.character, user),
    todayQuests: dashboard.active_quests.map(transformQuest),
    activity: dashboard.recent_activity.map(transformActivityLog),
    streak: {
      current: dashboard.streak.current,
      lastActivityDate: dashboard.streak.last_activity_date,
    },
  };
}


// ============================================================
//  QUEST SERVICES
// ============================================================

/**
 * GET /quests — List all quests for the authenticated user.
 */
export async function getQuests() {
  const data = await apiGet('/quests');
  return data.map(transformQuest);
}

/**
 * POST /quests — Create a new quest.
 * Only sends title, description, category, difficulty.
 * Rewards are set server-side.
 */
export async function createQuest(questData) {
  const data = await apiPost('/quests', {
    title: questData.name || questData.title,
    description: questData.description || '',
    category: questData.category,
    difficulty: questData.difficulty,
  });
  return transformQuest(data);
}

/**
 * DELETE /quests/{id} — Delete an incomplete quest.
 */
export async function deleteQuest(id) {
  await apiDelete(`/quests/${id}`);
  return { success: true };
}

/**
 * POST /quests/{id}/complete — Complete a quest (server-authoritative).
 * Returns transformed quest + rewards.
 */
export async function completeQuest(id) {
  const data = await apiPost(`/quests/${id}/complete`);
  return {
    quest: transformQuest(data.quest),
    rewards: {
      xp: data.rewards.xp,
      gold: data.rewards.gold,
      attribute: data.rewards.attribute,
      attributePoints: data.rewards.attribute_points,
    },
    newLevel: data.new_level,
    leveledUp: data.leveled_up,
    newAchievements: data.new_achievements || [],
  };
}


// ============================================================
//  CHARACTER SERVICES
// ============================================================

/**
 * GET /character — Character stats + achievements.
 * Also fetches /auth/me for user profile info.
 */
export async function getCharacter() {
  const [charData, user] = await Promise.all([
    apiGet('/character'),
    apiGet('/auth/me'),
  ]);

  return {
    character: transformCharacter(charData.character, user),
    achievements: charData.achievements.map(transformAchievement),
  };
}


// ============================================================
//  SHOP SERVICES
// ============================================================

/**
 * GET /shop — List all shop items with purchase status.
 */
export async function getShop() {
  const data = await apiGet('/shop');
  return data.map(transformShopItem);
}

/**
 * POST /shop/{item_id}/buy — Purchase an item.
 */
export async function purchaseItem(itemId) {
  const data = await apiPost(`/shop/${itemId}/buy`);
  return {
    item: transformShopItem(data.item),
    remainingGold: data.remaining_gold,
  };
}
