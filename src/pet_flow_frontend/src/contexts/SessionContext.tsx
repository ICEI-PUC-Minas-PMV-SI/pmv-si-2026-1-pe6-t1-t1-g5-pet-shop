import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { authStorage } from '../services/auth';
import { employeeService, type Employee } from '../services/employee';

export interface SessionData {
  token: string;
  userId: string;
  clinicId: string;
  name: string;
  role: string;
}

interface SessionContextValue {
  session: SessionData | null;
  loading: boolean;
  error: string;
}

const SessionContext = createContext<SessionContextValue>({
  session: null,
  loading: false,
  error: '',
});

const SESSION_DATA_KEY = 'petflow_session_data';

function saveSessionData(data: SessionData): void {
  const storage = localStorage.getItem('petflow_remember') === 'true'
    ? localStorage
    : sessionStorage;
  storage.setItem(SESSION_DATA_KEY, JSON.stringify(data));
}

function loadSessionData(): SessionData | null {
  const raw =
    localStorage.getItem(SESSION_DATA_KEY) ||
    sessionStorage.getItem(SESSION_DATA_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as SessionData;
  } catch {
    return null;
  }
}

export function clearSessionData(): void {
  localStorage.removeItem(SESSION_DATA_KEY);
  sessionStorage.removeItem(SESSION_DATA_KEY);
}

export function SessionProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<SessionData | null>(loadSessionData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const token = authStorage.getToken();
    const userId = authStorage.getUserId();

    if (!token || !userId) return;

    const cached = loadSessionData();
    if (cached && cached.userId === userId && cached.clinicId) {
      setSession(cached);
      return;
    }

    setLoading(true);
    employeeService.getAll()
      .then((employees: Employee[]) => {
        const found = employees.find(
          (e) => e.id === userId
        );

        const sessionData: SessionData = {
          token,
          userId,
          clinicId: found?.clinicId || '',
          name:     found?.name     || 'Usuário',
          role:     found?.role     || '',
        };

        console.log('[SessionContext] Session resolved:', sessionData.name, '| clinicId:', sessionData.clinicId);
        saveSessionData(sessionData);
        setSession(sessionData);
      })
      .catch((err) => {
        console.warn('[SessionContext] Failed to load employees, using fallback');
        const fallback: SessionData = {
          token,
          userId,
          clinicId: '',
          name: 'Usuário',
          role: '',
        };
        saveSessionData(fallback);
        setSession(fallback);
        setError(err instanceof Error ? err.message : 'Erro ao carregar sessão');
      })
      .finally(() => setLoading(false));

  }, []);

  return (
    <SessionContext.Provider value={{ session, loading, error }}>
      {children}
    </SessionContext.Provider>
  );
}

export function useSession(): SessionContextValue {
  return useContext(SessionContext);
}
