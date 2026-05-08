import { MdMenu } from 'react-icons/md';
import styles from './Header.module.css';

interface HeaderProps {
  onMenuToggle: () => void;
}

export default function Header({ onMenuToggle }: HeaderProps) {
  return (
    <header className={styles.header}>
      <button className={styles.menuBtn} onClick={onMenuToggle} aria-label="Abrir menu">
        <MdMenu size={24} />
      </button>
      <div className={styles.actions} />
    </header>
  );
}
