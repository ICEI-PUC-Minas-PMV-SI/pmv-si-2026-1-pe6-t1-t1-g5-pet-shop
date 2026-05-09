import { NavLink, useNavigate } from 'react-router-dom';
import {
  MdDashboard,
  MdCalendarToday,
  MdPets,
  MdPerson,
  MdShower,
  MdInventory,
  MdAttachMoney,
  MdGroup,
  MdLogout,
  MdClose,
  MdStore
} from 'react-icons/md';
import { authStorage } from '../../services/auth';
import { useSession, clearSessionData } from '../../contexts/SessionContext';
import logoImg from '../../assets/logo-petflow.png';
import styles from './Sidebar.module.css';

const menuItems = [
  { path: '/dashboard', label: 'Dashboard', icon: MdDashboard },
  { path: '/agendamentos', label: 'Agendamentos', icon: MdCalendarToday },
  { path: '/pets', label: 'Pets', icon: MdPets },
  { path: '/tutores', label: 'Tutores', icon: MdPerson },
  { path: '/servicos', label: 'Serviços', icon: MdShower },
  { path: '/produtos', label: 'Produtos', icon: MdInventory },
  { path: '/financeiro', label: 'Financeiro', icon: MdAttachMoney },
  { path: '/funcionarios', label: 'Funcionários', icon: MdGroup },
  { path: '/Clinica', label: 'Clínica', icon: MdStore },

];

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
}

function formatRole(role: string): string {
  if (!role) return 'Funcionário';
  const roleMap: Record<string, string> = {
    admin: 'Administrador',
    administrador: 'Administrador',
    manager: 'Gerente',
    gerente: 'Gerente',
    vet: 'Veterinário',
    veterinario: 'Veterinário',
    groomer: 'Tosador',
    tosador: 'Tosador',
    receptionist: 'Recepcionista',
    recepcionista: 'Recepcionista',
    funcionario: 'Funcionário',
  };
  return roleMap[role.toLowerCase()] || role.charAt(0).toUpperCase() + role.slice(1);
}

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

export default function Sidebar({ open, onClose }: SidebarProps) {
  const navigate = useNavigate();
  const { session } = useSession();

  const handleLogout = () => {
    clearSessionData();
    authStorage.clear();
    navigate('/');
  };

  const handleNavClick = () => {
    onClose();
  };

  const displayName = session?.name || 'Carregando...';
  const displayRole = session?.role ? formatRole(session.role) : 'Funcionário';
  const initials = session?.name ? getInitials(session.name) : '...';

  return (
    <>
      {open && <div className={styles.overlay} onClick={onClose} />}
      <aside className={`${styles.sidebar} ${open ? styles.sidebarOpen : ''}`}>
        <div className={styles.topRow}>
          <div className={styles.logo}>
            <img src={logoImg} alt="PetFlow" className={styles.logoImage} />
          </div>
          <button className={styles.closeBtn} onClick={onClose} aria-label="Fechar menu">
            <MdClose size={22} />
          </button>
        </div>

        <div className={styles.userInfo}>
          <div className={styles.avatar}>{initials}</div>
          <div className={styles.userDetails}>
            <span className={styles.userName}>{displayName}</span>
            <span className={styles.userRole}>{displayRole}</span>
          </div>
        </div>

        <nav className={styles.nav}>
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `${styles.navItem} ${isActive ? styles.navItemActive : ''}`
              }
              onClick={handleNavClick}
            >
              <item.icon className={styles.navIcon} />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <button className={styles.logoutBtn} onClick={handleLogout}>
          <MdLogout className={styles.navIcon} />
          <span>Sair</span>
        </button>
      </aside>
    </>
  );
}
