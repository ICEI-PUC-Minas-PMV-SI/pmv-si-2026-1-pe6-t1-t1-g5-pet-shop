import { MdClose } from 'react-icons/md';
import type { SchedulingRow } from '../types';
import styles from './SchedulingDeleteConfirmModal.module.css';

interface SchedulingDeleteConfirmModalProps {
  open: boolean;
  item: SchedulingRow | null;
  loading?: boolean;
  onCancel: () => void;
  onConfirm: () => Promise<void>;
}

export default function SchedulingDeleteConfirmModal({
  open,
  item,
  loading = false,
  onCancel,
  onConfirm,
}: SchedulingDeleteConfirmModalProps) {
  if (!open || !item) return null;

  return (
    <div className={styles.overlay} role="presentation" onClick={onCancel}>
      <div
        className={styles.modal}
        role="dialog"
        aria-modal="true"
        aria-label="Confirmar exclusão"
        onClick={(event) => event.stopPropagation()}
      >
        <header className={styles.header}>
          <h2 className={styles.title}>Confirmar exclusão</h2>
          <button
            className={styles.closeButton}
            type="button"
            onClick={onCancel}
            aria-label="Fechar modal"
            disabled={loading}
          >
            <MdClose size={28} />
          </button>
        </header>

        <div className={styles.body}>
          <p className={styles.message}>
            Deseja realmente excluir o agendamento de <strong>{item.petName}</strong>?
          </p>
          <p className={styles.subMessage}>Esta ação não pode ser desfeita.</p>
        </div>

        <footer className={styles.footer}>
          <button
            type="button"
            className={styles.cancelButton}
            onClick={onCancel}
            disabled={loading}
          >
            Cancelar
          </button>
          <button
            type="button"
            className={styles.deleteButton}
            onClick={() => {
              void onConfirm();
            }}
            disabled={loading}
          >
            {loading ? 'Excluindo...' : 'Excluir'}
          </button>
        </footer>
      </div>
    </div>
  );
}
