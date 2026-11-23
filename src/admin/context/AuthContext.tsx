import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase, isSupabaseConfigured } from '../../lib/supabase/client';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  isMockAuth: boolean;
  login: (email: string, password: string) => Promise<{ error: string | null }>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error: string | null; message?: string }>;
}

const LOCAL_AUTH_KEY = 'kaien_admin_mock_session';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const isMockAuth = !isSupabaseConfigured || !supabase;

  useEffect(() => {
    if (isSupabaseConfigured && supabase) {
      // 1. Get initial session
      supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        setIsLoading(false);
      });

      // 2. Listen for auth changes
      const {
        data: { subscription },
      } = supabase.auth.onAuthStateChange((_event, newSession) => {
        setSession(newSession);
        setUser(newSession?.user ?? null);
        setIsLoading(false);
      });

      return () => {
        subscription.unsubscribe();
      };
    } else {
      // Mock auth for local development when Supabase credentials are not yet set
      const savedMockUser = localStorage.getItem(LOCAL_AUTH_KEY);
      if (savedMockUser) {
        try {
          const parsed = JSON.parse(savedMockUser);
          setUser(parsed);
          setSession({ access_token: 'mock-token', user: parsed } as unknown as Session);
        } catch {
          localStorage.removeItem(LOCAL_AUTH_KEY);
        }
      }
      setIsLoading(false);
    }
  }, [isMockAuth]);

  const login = async (email: string, password: string): Promise<{ error: string | null }> => {
    setIsLoading(true);

    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      setIsLoading(false);
      if (error) {
        return { error: error.message };
      }
      setUser(data.user);
      setSession(data.session);
      return { error: null };
    }

    // Mock login fallback
    // Accept standard local admin credentials (or any reasonable admin password during demo)
    await new Promise((r) => setTimeout(r, 400));
    setIsLoading(false);

    const mockUser = {
      id: 'mock-admin-id',
      email: email.trim() || 'artist@example.com',
      aud: 'authenticated',
      role: 'authenticated',
      app_metadata: { role: 'admin' },
      user_metadata: { name: 'KAIEN' },
      created_at: new Date().toISOString(),
    } as unknown as User;

    setUser(mockUser);
    setSession({ access_token: 'mock-token', user: mockUser } as unknown as Session);
    localStorage.setItem(LOCAL_AUTH_KEY, JSON.stringify(mockUser));
    return { error: null };
  };

  const logout = async () => {
    if (isSupabaseConfigured && supabase) {
      await supabase.auth.signOut();
    }
    localStorage.removeItem(LOCAL_AUTH_KEY);
    setUser(null);
    setSession(null);
  };

  const resetPassword = async (email: string): Promise<{ error: string | null; message?: string }> => {
    if (isSupabaseConfigured && supabase) {
      const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
        redirectTo: `${window.location.origin}/admin/reset-password`,
      });
      if (error) {
        return { error: error.message };
      }
      return { error: null, message: 'Tautan reset kata sandi telah dikirim ke email Anda.' };
    }

    return {
      error: null,
      message: 'Mode offline: Tautan reset kata sandi disimulasikan berhasil terkirim.',
    };
  };

  const value = useMemo(
    () => ({
      user,
      session,
      isLoading,
      isMockAuth,
      login,
      logout,
      resetPassword,
    }),
    [user, session, isLoading, isMockAuth]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
