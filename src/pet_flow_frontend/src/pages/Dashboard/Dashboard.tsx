import styles from './Dashboard.module.css';

export default function Dashboard() {
  return (
    <div className={styles.page}>
      <h1 className={styles.greeting}>Bem vindo de volta, Marcos</h1>
      <p className={styles.placeholder}>Dashboard em construção...</p>
    </div>
  );
}
