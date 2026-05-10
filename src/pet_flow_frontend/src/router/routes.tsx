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
import Services from '../pages/Services/Services';
import Products from '../pages/Products/Products';
import Placeholder from '../pages/Placeholder/Placeholder';
import Pets from '../pages/Pets/Pets';
import Clinica from '../pages/Clinica/clinica'; 

export default function AppRoutes() {
  return (
    <Routes>
      {/* ─── ROTAS PÚBLICAS (TELA CHEIA) ────────────────────────────── */}
      <Route path="/" element={<AuthRedirect />} />
      <Route path="/register" element={<Register />} />
      



      {/* ─── ROTAS PRIVADAS (COM MENU LATERAL E TOPBAR) ─────────────── */}
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
        <Route path="/pets" element={<Pets />} />
        <Route path="/tutores" element={<Placeholder title="Tutores" />} />
        <Route path="/servicos" element={<Services />} />
        <Route path="/produtos" element={<Products />} />
        <Route path="/financeiro" element={<Financial />} />
        <Route path="/funcionarios" element={<Employees />} />
        <Route path="/clinica" element={<Clinica />} />
      </Route>

      {/* ─── FALLBACK (REDIRECIONAMENTO) ───────────────────────────── */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}