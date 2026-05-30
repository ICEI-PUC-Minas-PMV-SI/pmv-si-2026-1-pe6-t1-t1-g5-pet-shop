import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
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
  refreshSession: () => Promise<void>;
}

const SessionContext = createContext<SessionContextValue>({
  session: null,
  loading: false,
  error: '',
  refreshSession: async () => {},
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

  const resolveSession = useCallback(async () => {
    const token = authStorage.getToken();
    const userId = authStorage.getUserId();

    if (!token || !userId) return;

    const cached = loadSessionData();
    if (cached && cached.userId === userId && cached.clinicId) {
      setSession(cached);
      return;
    }

    setLoading(true);
    setError('');
    try {
      const employee: Employee = await employeeService.getMe();
      const sessionData: SessionData = {
        token,
        userId,
        clinicId: employee.clinicId || '',
        name:     employee.name     || 'Usuário',
        role:     employee.role     || '',
      };
      saveSessionData(sessionData);
      setSession(sessionData);
    } catch (err) {
      console.warn('[SessionContext] Failed to load employee/me');
      setError(err instanceof Error ? err.message : 'Erro ao carregar sessão');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    resolveSession();
  }, [resolveSession]);

  return (
    <SessionContext.Provider value={{ session, loading, error, refreshSession: resolveSession }}>
      {children}
    </SessionContext.Provider>
  );
}

export function useSession(): SessionContextValue {
  return useContext(SessionContext);
}
