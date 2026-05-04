import { MdNotifications } from 'react-icons/md';
import styles from './Header.module.css';

export default function Header() {
  return (
    <header className={styles.header}>
      <div />
      <div className={styles.actions}>
        <button className={styles.notificationBtn} aria-label="Notificações">
          <MdNotifications size={20} />
        </button>
        <div className={styles.headerAvatar}>MS</div>
      </div>
    </header>
  );
}
