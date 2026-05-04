import styles from './PageHeader.module.css';

interface PageHeaderProps {
  title: string;
  buttonLabel?: string;
  onButtonClick?: () => void;
  children?: React.ReactNode;
}

export default function PageHeader({ title, buttonLabel, onButtonClick, children }: PageHeaderProps) {
  return (
    <div className={styles.pageHeader}>
      <h1 className={styles.title}>{title}</h1>
      <div className={styles.toolbar}>
        {children}
        {buttonLabel && (
          <button className={styles.primaryBtn} onClick={onButtonClick}>
            {buttonLabel}
          </button>
        )}
      </div>
    </div>
  );
}
