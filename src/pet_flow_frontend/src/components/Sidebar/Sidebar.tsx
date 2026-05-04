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
} from 'react-icons/md';
import { authStorage } from '../../services/auth';
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
];

export default function Sidebar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    authStorage.clear();
    navigate('/');
  };

  return (
    <aside className={styles.sidebar}>
      <div className={styles.logo}>
        <img src={logoImg} alt="PetFlow" className={styles.logoImage} />
      </div>

      <div className={styles.userInfo}>
        <div className={styles.avatar}>MS</div>
        <div className={styles.userDetails}>
          <span className={styles.userName}>Marcos Silva</span>
          <span className={styles.userRole}>Administrador</span>
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
  );
}
