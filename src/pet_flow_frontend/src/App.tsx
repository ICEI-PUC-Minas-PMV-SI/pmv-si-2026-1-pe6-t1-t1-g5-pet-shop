import { useEffect, useState } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { authStorage } from './services/auth';
import Login from './pages/Login/Login';
import Register from './pages/Register/Register';
import AppLayout from './layouts/AppLayout';
import Dashboard from './pages/Dashboard/Dashboard';

function AuthRedirect() {
  return authStorage.isAuthenticated() ? <Navigate to="/dashboard" replace /> : <Login />;
}

function RequireAuth({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const [checking, setChecking] = useState(true);
  const [ok, setOk] = useState(false);

  useEffect(() => {
    async function check() {
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

      setOk(true);
      setChecking(false);
    }
    check();
  }, [navigate]);

  if (checking) return null;
  if (!ok) return <Navigate to="/" replace />;
  return <>{children}</>;
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<AuthRedirect />} />
      <Route path="/register" element={<Register />} />

      <Route element={<RequireAuth><AppLayout /></RequireAuth>}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/agendamentos" element={<Placeholder title="Agendamentos" />} />
        <Route path="/pets" element={<Placeholder title="Pets" />} />
        <Route path="/tutores" element={<Placeholder title="Tutores" />} />
        <Route path="/servicos" element={<Placeholder title="Serviços" />} />
        <Route path="/produtos" element={<Placeholder title="Produtos" />} />
        <Route path="/financeiro" element={<Placeholder title="Financeiro" />} />
        <Route path="/funcionarios" element={<Placeholder title="Funcionários" />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function Placeholder({ title }: { title: string }) {
  return (
    <div>
      <h1 style={{ fontSize: 17, fontWeight: 600, color: '#141313' }}>{title}</h1>
      <p style={{ fontSize: 13, color: 'rgba(20,19,19,0.57)', marginTop: 8 }}>Em construção...</p>
    </div>
  );
}
