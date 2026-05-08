import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { authStorage } from '../services/auth';
import { employeeService, type EmployeeData } from '../services/employee';

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
  const raw = localStorage.getItem(SESSION_DATA_KEY) || sessionStorage.getItem(SESSION_DATA_KEY);
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

    console.log('[SessionContext] Init - token:', !!token, 'userId:', userId);

    if (!token || !userId) {
      return;
    }

    // If we already have cached data for this user, skip fetch
    const cached = loadSessionData();
    if (cached && cached.userId === userId && cached.clinicId) {
      console.log('[SessionContext] Using cached session:', cached.name, cached.clinicId);
      setSession(cached);
      return;
    }

    // Fetch employee data
    setLoading(true);
    employeeService.getById(userId)
      .then((employee: EmployeeData) => {
        console.log('[SessionContext] Employee loaded:', employee.name, employee.clinicId);
        const sessionData: SessionData = {
          token,
          userId,
          clinicId: employee.clinicId,
          name: employee.name,
          role: employee.role,
        };
        saveSessionData(sessionData);
        setSession(sessionData);
      })
      .catch((err) => {
        console.error('[SessionContext] Failed to fetch employee:', err);
        setError(err instanceof Error ? err.message : 'Erro ao carregar sessão');
        // Fallback session
        setSession({
          token,
          userId,
          clinicId: '',
          name: 'Usuário',
          role: '',
        });
      })
      .finally(() => {
        setLoading(false);
      });
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
