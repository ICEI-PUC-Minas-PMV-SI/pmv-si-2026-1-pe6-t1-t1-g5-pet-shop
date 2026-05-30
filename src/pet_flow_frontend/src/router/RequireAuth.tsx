import { Navigate } from 'react-router-dom';
import { authStorage } from '../services/auth';

interface RequireAuthProps {
  children: React.ReactNode;
}

export default function RequireAuth({ children }: RequireAuthProps) {
  if (!authStorage.isAuthenticated()) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
