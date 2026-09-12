// ========================================
// ASCEND — Game Context (Global State)
// MOCK FRONTEND LOGIC — state management for demo.
// Authoritative game logic will move to FastAPI.
// ========================================

import { createContext, useContext, useReducer, useCallback } from 'react';
import { mockCharacter, mockQuests, mockAchievements, mockLootItems, mockActivity, mockStreak, mockDailyBoss } from '../data/mockData';
import { getLevelFromTotalXp, getLevelProgress } from '../utils/progression';

const GameContext = createContext(null);

const initialState = {
  // Auth
  isAuthenticated: false,
  user: null,

  // Character
  character: { ...mockCharacter },

  // Quests
  quests: [...mockQuests],

  // Achievements
  achievements: [...mockAchievements],

  // Loot
  lootItems: [...mockLootItems],

  // Activity
  activity: [...mockActivity],

  // Streak
  streak: { ...mockStreak },

  // Daily Boss
  dailyBoss: { ...mockDailyBoss },

  // UI State
  toasts: [],
  showLevelUp: false,
  levelUpData: null,
};

function gameReducer(state, action) {
  switch (action.type) {
    // ---- AUTH ----
    case 'LOGIN': {
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload,
      };
    }
    case 'LOGOUT': {
      return {
        ...state,
        isAuthenticated: false,
        user: null,
      };
    }

    // ---- QUEST COMPLETION ----
    // MOCK FRONTEND LOGIC: XP/Gold/Attribute updates computed client-side
    case 'COMPLETE_QUEST': {
      const quest = state.quests.find(q => q.id === action.payload);
      if (!quest || quest.completed) return state;

      const updatedQuests = state.quests.map(q =>
        q.id === action.payload ? { ...q, completed: true } : q
      );

      const oldLevel = getLevelFromTotalXp(state.character.totalXp);
      const newTotalXp = state.character.totalXp + quest.xpReward;
      const newGold = state.character.gold + quest.goldReward;
      const newLevel = getLevelFromTotalXp(newTotalXp);

      const newAttributes = { ...state.character.attributes };
      if (quest.attributeReward) {
        const attr = quest.attributeReward.attribute;
        newAttributes[attr] = (newAttributes[attr] || 0) + quest.attributeReward.points;
      }

      const newActivity = [
        {
          id: 'act-' + Date.now(),
          type: 'xp',
          text: `${quest.name} completed`,
          value: `+${quest.xpReward} XP`,
          timestamp: new Date().toISOString(),
        },
        {
          id: 'act-' + (Date.now() + 1),
          type: 'gold',
          text: 'Quest reward',
          value: `+${quest.goldReward} Gold`,
          timestamp: new Date().toISOString(),
        },
        ...state.activity,
      ].slice(0, 10);

      const newToast = {
        id: 'toast-' + Date.now(),
        type: 'success',
        title: 'Quest Complete!',
        message: `+${quest.xpReward} XP  •  +${quest.goldReward} Gold`,
      };

      let showLevelUp = false;
      let levelUpData = null;
      if (newLevel > oldLevel) {
        showLevelUp = true;
        levelUpData = { oldLevel, newLevel };
      }

      return {
        ...state,
        quests: updatedQuests,
        character: {
          ...state.character,
          totalXp: newTotalXp,
          gold: newGold,
          level: newLevel,
          attributes: newAttributes,
        },
        activity: newActivity,
        toasts: [...state.toasts, newToast],
        showLevelUp,
        levelUpData,
      };
    }

    // ---- QUEST CRUD ----
    case 'ADD_QUEST': {
      return {
        ...state,
        quests: [action.payload, ...state.quests],
      };
    }
    case 'UPDATE_QUEST': {
      return {
        ...state,
        quests: state.quests.map(q =>
          q.id === action.payload.id ? { ...q, ...action.payload } : q
        ),
      };
    }
    case 'DELETE_QUEST': {
      return {
        ...state,
        quests: state.quests.filter(q => q.id !== action.payload),
      };
    }

    // ---- LOOT PURCHASE ----
    // MOCK FRONTEND LOGIC: Gold deduction computed client-side
    case 'PURCHASE_ITEM': {
      const item = state.lootItems.find(i => i.id === action.payload);
      if (!item || item.purchased || state.character.gold < item.price) return state;

      return {
        ...state,
        character: {
          ...state.character,
          gold: state.character.gold - item.price,
        },
        lootItems: state.lootItems.map(i =>
          i.id === action.payload ? { ...i, purchased: true } : i
        ),
        toasts: [
          ...state.toasts,
          {
            id: 'toast-' + Date.now(),
            type: 'gold',
            title: 'Item Acquired!',
            message: `${item.name} unlocked for ${item.price} Gold`,
          },
        ],
      };
    }

    // ---- UI ----
    case 'DISMISS_TOAST': {
      return {
        ...state,
        toasts: state.toasts.filter(t => t.id !== action.payload),
      };
    }
    case 'DISMISS_LEVEL_UP': {
      return {
        ...state,
        showLevelUp: false,
        levelUpData: null,
      };
    }
    case 'ADD_TOAST': {
      return {
        ...state,
        toasts: [...state.toasts, action.payload],
      };
    }

    default:
      return state;
  }
}

export function GameProvider({ children }) {
  const [state, dispatch] = useReducer(gameReducer, initialState);

  const completeQuest = useCallback((questId) => {
    dispatch({ type: 'COMPLETE_QUEST', payload: questId });
  }, []);

  const addQuest = useCallback((quest) => {
    const newQuest = {
      id: 'quest-' + Date.now(),
      ...quest,
      completed: false,
      createdAt: new Date().toISOString(),
    };
    dispatch({ type: 'ADD_QUEST', payload: newQuest });
  }, []);

  const updateQuest = useCallback((quest) => {
    dispatch({ type: 'UPDATE_QUEST', payload: quest });
  }, []);

  const deleteQuest = useCallback((questId) => {
    dispatch({ type: 'DELETE_QUEST', payload: questId });
  }, []);

  const purchaseItem = useCallback((itemId) => {
    dispatch({ type: 'PURCHASE_ITEM', payload: itemId });
  }, []);

  const login = useCallback((userData) => {
    dispatch({ type: 'LOGIN', payload: userData });
  }, []);

  const logout = useCallback(() => {
    dispatch({ type: 'LOGOUT' });
  }, []);

  const dismissToast = useCallback((toastId) => {
    dispatch({ type: 'DISMISS_TOAST', payload: toastId });
  }, []);

  const dismissLevelUp = useCallback(() => {
    dispatch({ type: 'DISMISS_LEVEL_UP' });
  }, []);

  const value = {
    ...state,
    completeQuest,
    addQuest,
    updateQuest,
    deleteQuest,
    purchaseItem,
    login,
    logout,
    dismissToast,
    dismissLevelUp,
    dispatch,
  };

  return (
    <GameContext.Provider value={value}>
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
}

export default GameContext;
