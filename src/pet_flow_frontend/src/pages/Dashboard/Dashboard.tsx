import { useSession } from '../../contexts/SessionContext';
import styles from './Dashboard.module.css';

export default function Dashboard() {
  const { session } = useSession();

  const firstName = session?.name?.split(' ')[0] || 'Usuário';

  return (
    <div className={styles.page}>
      <h1 className={styles.greeting}>Bem vindo de volta, {firstName}</h1>
      <p className={styles.placeholder}>Dashboard em construção...</p>
    </div>
  );
}
