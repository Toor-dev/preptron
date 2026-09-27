import { createContext, type ReactNode, useContext, useMemo, useState } from 'react';
import type { AuthSession, User } from '../types';

const SESSION_KEY = 'preptron-session';

const defaultUser: User = {
  id: 'u-1',
  name: 'Ahmed Ali',
  email: 'ahmed@preptron.pk',
  avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
  role: 'student',
};

const defaultSession: AuthSession = {
  token: 'mock-token-123',
  user: defaultUser,
};

interface AuthContextValue {
  session: AuthSession | null;
  login: (email: string, password: string) => Promise<AuthSession>;
  logout: () => void;
  setSession: (value: AuthSession | null) => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<AuthSession | null>(() => {
    const raw = sessionStorage.getItem(SESSION_KEY);
    return raw ? (JSON.parse(raw) as AuthSession) : defaultSession;
  });

  const login = async (email: string, password: string): Promise<AuthSession> => {
    const normalized = email.trim().toLowerCase();
    const mockStudent = {
      id: 'u-1',
      name: 'Ahmed Ali',
      email: 'ahmed@preptron.pk',
      avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
      role: 'student' as const,
    };
    const mockAdmin = {
      id: 'u-2',
      name: 'Nadia Khan',
      email: 'admin@preptron.pk',
      avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
      role: 'coaching_admin' as const,
      coachingCenterId: 'center-1',
    };

    await new Promise((resolve) => setTimeout(resolve, 700));

    if (normalized === 'ahmed@preptron.pk' && password === 'password123') {
      const nextSession = { token: 'token-student-1', user: mockStudent };
      setSession(nextSession);
      sessionStorage.setItem(SESSION_KEY, JSON.stringify(nextSession));
      return nextSession;
    }

    if (normalized === 'admin@preptron.pk' && password === 'password123') {
      const nextSession = { token: 'token-admin-1', user: mockAdmin };
      setSession(nextSession);
      sessionStorage.setItem(SESSION_KEY, JSON.stringify(nextSession));
      return nextSession;
    }

    throw new Error('Invalid email or password');
  };

  const logout = () => {
    setSession(null);
    sessionStorage.removeItem(SESSION_KEY);
  };

  const value = useMemo<AuthContextValue>(
    () => ({ session, login, logout, setSession: (next) => {
       setSession(next);
       if (next) sessionStorage.setItem(SESSION_KEY, JSON.stringify(next));
       else sessionStorage.removeItem(SESSION_KEY);
    } }),
    [session],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
