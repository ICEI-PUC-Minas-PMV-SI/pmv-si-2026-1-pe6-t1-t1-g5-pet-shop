import styles from './StatCard.module.css';

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  subtitle?: string;
  subtitleColor?: 'success' | 'danger' | 'default';
}

export default function StatCard({ icon, label, value, subtitle, subtitleColor = 'success' }: StatCardProps) {
  return (
    <div className={styles.card}>
      <div className={styles.iconWrapper}>{icon}</div>
      <span className={styles.label}>{label}</span>
      <span className={styles.value}>{value}</span>
      {subtitle && (
        <span className={`${styles.subtitle} ${styles[subtitleColor]}`}>
          {subtitle}
        </span>
      )}
    </div>
  );
}
