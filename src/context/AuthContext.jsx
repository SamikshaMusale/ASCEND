import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { authService } from '../services/authService';
import { registerUser } from '../services/api';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function getInitialSession() {
      try {
        const currentSession = await authService.getCurrentSession();
        if (mounted) {
          setSession(currentSession);
          setUser(currentSession?.user ?? null);
        }
      } catch (error) {
        console.error('Error getting session:', error);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    getInitialSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, currentSession) => {
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      setLoading(false);
    });

    return () => {
      mounted = false;
      subscription?.unsubscribe();
    };
  }, []);

  /**
   * Sign up via Supabase Auth, then initialize the backend profile.
   * The backend POST /auth/register creates rows in users + characters.
   */
  const signUp = async (email, password, username = '') => {
    const data = await authService.signUp(email, password);

    // If the signup returned a session (auto-confirm enabled),
    // immediately register the backend profile.
    if (data.session?.access_token) {
      try {
        await registerUser({
          username: username || email.split('@')[0],
          email,
        });
      } catch (err) {
        // 409/duplicate is fine — means user already registered on backend
        if (err.status !== 409 && err.status !== 400) {
          console.error('Backend registration failed:', err);
        }
      }
    }

    return data;
  };

  const value = {
    user,
    session,
    loading,
    signIn: authService.signIn,
    signUp,
    signOut: authService.signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  return useContext(AuthContext);
};
