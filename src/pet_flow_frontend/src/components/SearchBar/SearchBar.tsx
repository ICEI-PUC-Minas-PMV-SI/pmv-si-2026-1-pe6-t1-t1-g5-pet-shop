import { MdSearch } from 'react-icons/md';
import styles from './SearchBar.module.css';

interface SearchBarProps {
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
}

export default function SearchBar({ placeholder = 'Buscar...', value, onChange }: SearchBarProps) {
  return (
    <div className={styles.searchBar}>
      <MdSearch className={styles.icon} />
      <input
        type="text"
        className={styles.input}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
