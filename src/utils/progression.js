// ========================================
// ASCEND — XP & Level Progression Utilities
// MOCK FRONTEND LOGIC — will be replaced by FastAPI backend
// ========================================

/**
 * Non-linear XP progression curve.
 * Returns XP required to advance FROM `level` TO `level + 1`.
 * Formula: 100 * level^1.5 (rounded)
 */
export function xpForNextLevel(level) {
  return Math.floor(100 * Math.pow(level, 1.5));
}

/**
 * Total XP accumulated to reach a given level (from level 1).
 */
export function totalXpForLevel(level) {
  let total = 0;
  for (let i = 1; i < level; i++) {
    total += xpForNextLevel(i);
  }
  return total;
}

/**
 * Derive current level from total XP.
 */
export function getLevelFromTotalXp(totalXp) {
  let level = 1;
  let accumulated = 0;
  while (accumulated + xpForNextLevel(level) <= totalXp) {
    accumulated += xpForNextLevel(level);
    level++;
  }
  return level;
}

/**
 * Get XP progress within current level.
 * Returns { currentXp, requiredXp, percentage }
 */
export function getLevelProgress(totalXp) {
  const level = getLevelFromTotalXp(totalXp);
  const xpAtCurrentLevel = totalXpForLevel(level);
  const currentXp = totalXp - xpAtCurrentLevel;
  const requiredXp = xpForNextLevel(level);
  const percentage = Math.min((currentXp / requiredXp) * 100, 100);
  return { level, currentXp, requiredXp, percentage };
}

/**
 * MOCK: Calculate rewards for quest completion.
 * Difficulty multipliers for XP and Gold.
 */
const DIFFICULTY_MULTIPLIERS = {
  Easy: { xp: 1, gold: 1 },
  Medium: { xp: 1.5, gold: 1.5 },
  Hard: { xp: 2.5, gold: 2 },
  Epic: { xp: 4, gold: 3 },
};

const CATEGORY_ATTRIBUTE_MAP = {
  Learning: 'intellect',
  Fitness: 'strength',
  Wellness: 'vitality',
  Creative: 'creativity',
};

const BASE_XP = 40;
const BASE_GOLD = 20;
const BASE_ATTRIBUTE = 5;

export function calculateQuestRewards(category, difficulty) {
  const mult = DIFFICULTY_MULTIPLIERS[difficulty] || DIFFICULTY_MULTIPLIERS.Easy;
  const xp = Math.floor(BASE_XP * mult.xp);
  const gold = Math.floor(BASE_GOLD * mult.gold);
  const attribute = CATEGORY_ATTRIBUTE_MAP[category] || 'intellect';
  const attributePoints = Math.floor(BASE_ATTRIBUTE * mult.xp);
  return { xp, gold, attribute, attributePoints };
}

export { DIFFICULTY_MULTIPLIERS, CATEGORY_ATTRIBUTE_MAP };
