import type { Transaction } from '../../../services/financial';
import styles from '../Financial.module.css';

interface Props {
  transaction: Transaction;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function DeleteModal({ transaction, onConfirm, onCancel }: Props) {
  return (
    <div className={styles.overlay} onClick={onCancel}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <h2 className={styles.modalTitle}>Excluir Transação</h2>
        <p className={styles.deleteMessage}>
          Deseja mesmo deletar a transação <strong>"{transaction.description}"</strong>?
        </p>
        <div className={styles.deleteActions}>
          <button className={styles.confirmDeleteBtn} onClick={onConfirm}>
            Sim, remover
          </button>
          <button className={styles.cancelBtn} onClick={onCancel}>
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}
