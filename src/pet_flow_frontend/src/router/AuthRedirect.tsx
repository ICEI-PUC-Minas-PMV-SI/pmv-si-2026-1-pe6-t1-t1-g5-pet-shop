import { Navigate } from 'react-router-dom';
import { authStorage } from '../services/auth';
import Login from '../pages/Login/Login';

export default function AuthRedirect() {
  return authStorage.isAuthenticated() ? <Navigate to="/dashboard" replace /> : <Login />;
}
