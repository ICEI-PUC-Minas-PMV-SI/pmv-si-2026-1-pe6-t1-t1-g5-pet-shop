import { Routes, Route, Navigate } from 'react-router-dom';
import { SessionProvider } from '../contexts/SessionContext';
import AuthRedirect from './AuthRedirect';
import RequireAuth from './RequireAuth';
import Register from '../pages/Register/Register';
import AppLayout from '../layouts/AppLayout';
import Dashboard from '../pages/Dashboard/Dashboard';
import Financial from '../pages/Financial/Financial';
import Scheduling from '../pages/Scheduling/Scheduling';
import Employees from '../pages/Employees/Employees';
import Placeholder from '../pages/Placeholder/Placeholder';

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={<AuthRedirect />} />
      <Route path="/register" element={<Register />} />

      {/* Authenticated */}
      <Route
        element={
          <RequireAuth>
            <SessionProvider>
              <AppLayout />
            </SessionProvider>
          </RequireAuth>
        }
      >
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/agendamentos" element={<Scheduling />} />
        <Route path="/pets" element={<Placeholder title="Pets" />} />
        <Route path="/tutores" element={<Placeholder title="Tutores" />} />
        <Route path="/servicos" element={<Placeholder title="Serviços" />} />
        <Route path="/produtos" element={<Placeholder title="Produtos" />} />
        <Route path="/financeiro" element={<Financial />} />
        <Route path="/funcionarios" element={<Employees />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
