import { useEffect, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { authStorage } from '../services/auth';

interface RequireAuthProps {
  children: React.ReactNode;
}

export default function RequireAuth({ children }: RequireAuthProps) {
  const navigate = useNavigate();
  const [checking, setChecking] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    async function verify() {
      if (!authStorage.getToken()) {
        setChecking(false);
        return;
      }

      if (authStorage.isExpired()) {
        const refreshed = await authStorage.tryRefresh();
        if (!refreshed) {
          navigate('/', { replace: true });
          setChecking(false);
          return;
        }
      }

      setAuthenticated(true);
      setChecking(false);
    }
    verify();
  }, [navigate]);

  if (checking) return null;
  if (!authenticated) return <Navigate to="/" replace />;
  return <>{children}</>;
}
