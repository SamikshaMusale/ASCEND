// ========================================
// ASCEND — Game Context (Global State)
// Backend-connected: fetches from FastAPI,
// delegates authoritative logic to the server.
// ========================================

import { createContext, useContext, useReducer, useCallback, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { getLevelFromTotalXp } from '../utils/progression';
import * as api from '../services/api';

const GameContext = createContext(null);

const initialState = {
  // Auth
  isAuthenticated: false,
  user: null,

  // Character
  character: {
    id: '',
    username: '',
    characterName: '',
    email: '',
    level: 1,
    totalXp: 0,
    gold: 0,
    streak: 0,
    lastActivityDate: null,
    attributes: {
      intellect: 0,
      strength: 0,
      vitality: 0,
      creativity: 0,
    },
  },

  // Quests
  quests: [],

  // Achievements
  achievements: [],

  // Loot
  lootItems: [],

  // Activity
  activity: [],

  // Streak
  streak: { current: 0, lastActivityDate: null },

  // Daily Boss (computed client-side from quests)
  dailyBoss: {
    name: 'The Procrastination Beast',
    totalQuests: 3,
    description: 'Complete 3 quests today to defeat the boss.',
  },

  // UI State
  toasts: [],
  showLevelUp: false,
  levelUpData: null,

  // Loading
  loading: true,
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
        ...initialState,
        isAuthenticated: false,
        loading: false,
      };
    }

    // ---- DATA LOADED FROM BACKEND ----
    case 'SET_DASHBOARD': {
      const { character, todayQuests, activity, streak } = action.payload;
      return {
        ...state,
        character,
        activity,
        streak,
        loading: false,
      };
    }
    case 'SET_QUESTS': {
      return { ...state, quests: action.payload, loading: false };
    }
    case 'SET_CHARACTER': {
      return {
        ...state,
        character: action.payload.character,
        achievements: action.payload.achievements,
        loading: false,
      };
    }
    case 'SET_SHOP': {
      return { ...state, lootItems: action.payload, loading: false };
    }
    case 'SET_LOADING': {
      return { ...state, loading: action.payload };
    }

    // ---- QUEST COMPLETION (from backend response) ----
    case 'COMPLETE_QUEST': {
      const { quest, rewards, newLevel, leveledUp } = action.payload;

      // Update quest in local list
      const updatedQuests = state.quests.map(q =>
        q.id === quest.id ? quest : q
      );

      // Update character with new values
      const newCharacter = {
        ...state.character,
        totalXp: state.character.totalXp + rewards.xp,
        gold: state.character.gold + rewards.gold,
        level: newLevel,
        attributes: {
          ...state.character.attributes,
          [rewards.attribute]: (state.character.attributes[rewards.attribute] || 0) + rewards.attributePoints,
        },
      };

      // Add activity entries
      const newActivity = [
        {
          id: 'act-' + Date.now(),
          type: 'xp',
          text: `${quest.name} completed`,
          value: `+${rewards.xp} XP`,
          timestamp: new Date().toISOString(),
        },
        {
          id: 'act-' + (Date.now() + 1),
          type: 'gold',
          text: 'Quest reward',
          value: `+${rewards.gold} Gold`,
          timestamp: new Date().toISOString(),
        },
        ...state.activity,
      ].slice(0, 10);

      // Toast
      const newToast = {
        id: 'toast-' + Date.now(),
        type: 'success',
        title: 'Quest Complete!',
        message: `+${rewards.xp} XP  •  +${rewards.gold} Gold`,
      };

      let showLevelUp = false;
      let levelUpData = null;
      if (leveledUp) {
        showLevelUp = true;
        levelUpData = { oldLevel: state.character.level, newLevel };
      }

      return {
        ...state,
        quests: updatedQuests,
        character: newCharacter,
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

    // ---- LOOT PURCHASE (from backend response) ----
    case 'PURCHASE_ITEM': {
      const { item, remainingGold } = action.payload;

      return {
        ...state,
        character: {
          ...state.character,
          gold: remainingGold,
        },
        lootItems: state.lootItems.map(i =>
          i.id === item.id ? { ...i, purchased: true } : i
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
  const { user: authUser, session } = useAuth();

  // ---- Fetch data from backend when authenticated ----
  useEffect(() => {
    if (!session?.access_token) {
      dispatch({ type: 'LOGOUT' });
      return;
    }

    let cancelled = false;

    async function loadData() {
      dispatch({ type: 'SET_LOADING', payload: true });
      try {
        // Fetch all data in parallel
        const [dashData, questsData, charData, shopData] = await Promise.all([
          api.getDashboard(),
          api.getQuests(),
          api.getCharacter(),
          api.getShop(),
        ]);

        if (cancelled) return;

        dispatch({ type: 'LOGIN', payload: authUser });
        dispatch({ type: 'SET_DASHBOARD', payload: dashData });
        dispatch({ type: 'SET_QUESTS', payload: questsData });
        dispatch({ type: 'SET_CHARACTER', payload: charData });
        dispatch({ type: 'SET_SHOP', payload: shopData });
      } catch (err) {
        // If user profile doesn't exist yet (e.g. existing Supabase user before backend was added)
        if (err.status === 404 && authUser?.email) {
          try {
            console.log('Backend profile missing. Auto-registering...');
            await api.registerUser({
              username: authUser.email.split('@')[0],
              email: authUser.email
            });
            
            // Retry fetching data
            const [dashData, questsData, charData, shopData] = await Promise.all([
              api.getDashboard(),
              api.getQuests(),
              api.getCharacter(),
              api.getShop(),
            ]);

            if (cancelled) return;

            dispatch({ type: 'LOGIN', payload: authUser });
            dispatch({ type: 'SET_DASHBOARD', payload: dashData });
            dispatch({ type: 'SET_QUESTS', payload: questsData });
            dispatch({ type: 'SET_CHARACTER', payload: charData });
            dispatch({ type: 'SET_SHOP', payload: shopData });
            return;
          } catch (retryErr) {
            console.error('Auto-registration failed:', retryErr);
          }
        }

        console.error('Failed to load game data:', err);
        if (!cancelled) {
          dispatch({ type: 'SET_LOADING', payload: false });
          if (err.status === 404) {
            dispatch({ type: 'LOGIN', payload: authUser });
          }
        }
      }
    }

    loadData();

    return () => { cancelled = true; };
  }, [session?.access_token, authUser]);

  // ---- ACTIONS: delegate to backend, then update local state ----

  const completeQuest = useCallback(async (questId) => {
    try {
      const result = await api.completeQuest(questId);
      dispatch({ type: 'COMPLETE_QUEST', payload: result });
    } catch (err) {
      console.error('Failed to complete quest:', err);
      dispatch({
        type: 'ADD_TOAST',
        payload: {
          id: 'toast-err-' + Date.now(),
          type: 'error',
          title: 'Error',
          message: err.message || 'Failed to complete quest.',
        },
      });
    }
  }, []);

  const addQuest = useCallback(async (questData) => {
    try {
      const newQuest = await api.createQuest(questData);
      dispatch({ type: 'ADD_QUEST', payload: newQuest });
    } catch (err) {
      console.error('Failed to create quest:', err);
      dispatch({
        type: 'ADD_TOAST',
        payload: {
          id: 'toast-err-' + Date.now(),
          type: 'error',
          title: 'Error',
          message: err.message || 'Failed to create quest.',
        },
      });
    }
  }, []);

  const updateQuest = useCallback((quest) => {
    // Update locally; backend doesn't have PUT /quests/{id} yet
    dispatch({ type: 'UPDATE_QUEST', payload: quest });
  }, []);

  const deleteQuest = useCallback(async (questId) => {
    try {
      await api.deleteQuest(questId);
      dispatch({ type: 'DELETE_QUEST', payload: questId });
    } catch (err) {
      console.error('Failed to delete quest:', err);
      dispatch({
        type: 'ADD_TOAST',
        payload: {
          id: 'toast-err-' + Date.now(),
          type: 'error',
          title: 'Error',
          message: err.message || 'Failed to delete quest.',
        },
      });
    }
  }, []);

  const purchaseItem = useCallback(async (itemId) => {
    try {
      const result = await api.purchaseItem(itemId);
      dispatch({ type: 'PURCHASE_ITEM', payload: result });
    } catch (err) {
      console.error('Failed to purchase item:', err);
      dispatch({
        type: 'ADD_TOAST',
        payload: {
          id: 'toast-err-' + Date.now(),
          type: 'error',
          title: 'Error',
          message: err.message || 'Failed to purchase item.',
        },
      });
    }
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
