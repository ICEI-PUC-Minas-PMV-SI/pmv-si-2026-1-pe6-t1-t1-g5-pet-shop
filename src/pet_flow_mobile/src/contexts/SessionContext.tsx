import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { authStorage, authRequest } from '../services';
import type { SessionData, Employee } from '../types';

interface SessionContextValue {
  session: SessionData | null;
  loading: boolean;
  setSession: (data: SessionData | null) => void;
}

const SessionContext = createContext<SessionContextValue>({
  session: null,
  loading: true,
  setSession: () => {},
});

export function SessionProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<SessionData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSession();
  }, []);

  async function loadSession() {
    try {
      const isAuth = await authStorage.isAuthenticated();
      if (!isAuth) {
        setLoading(false);
        return;
      }

      const userId = await authStorage.getUserId();
      const token = await authStorage.getToken();
      if (!userId || !token) {
        setLoading(false);
        return;
      }

      const cached = await authStorage.getSessionData();
      if (cached && cached.userId === userId && cached.clinicId) {
        setSession(cached);
        setLoading(false);
        return;
      }

      try {
        const employees = await authRequest<Employee[]>('/employee', { method: 'GET' });
        const found = employees.find((e) => e.id === userId);

        const sessionData: SessionData = {
          token,
          userId,
          clinicId: found?.clinicId || '',
          name: found?.name || 'Usuário',
          role: found?.role || '',
        };

        await authStorage.saveSessionData(sessionData);
        setSession(sessionData);
      } catch {
        const fallback: SessionData = {
          token,
          userId,
          clinicId: '',
          name: 'Usuário',
          role: '',
        };
        await authStorage.saveSessionData(fallback);
        setSession(fallback);
      }
    } catch {
      await authStorage.clear();
      setSession(null);
    } finally {
      setLoading(false);
    }
  }

  return (
    <SessionContext.Provider value={{ session, loading, setSession }}>
      {children}
    </SessionContext.Provider>
  );
}

export function useSession(): SessionContextValue {
  return useContext(SessionContext);
}
