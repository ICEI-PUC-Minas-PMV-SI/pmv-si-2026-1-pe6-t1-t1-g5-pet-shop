import { useEffect, useState } from 'react';
import { MdEdit, MdAdd } from 'react-icons/md';
import { financialService, type Transaction, type CreateTransactionPayload } from '../../services/financial';
import styles from './Financial.module.css';

// Temporary clinic_id — in production this would come from user context
const CLINIC_ID = 'default-clinic';

function formatCurrency(value: number): string {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
}

export default function Financial() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);

  const fetchTransactions = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await financialService.getAll(CLINIC_ID);
      setTransactions(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar transações');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const revenue = transactions
    .filter((t) => t.amount > 0)
    .reduce((sum, t) => sum + t.amount, 0);

  const expenses = transactions
    .filter((t) => t.amount < 0)
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);

  const balance = revenue - expenses;

  const handleEdit = (transaction: Transaction) => {
    setEditingTransaction(transaction);
    setShowModal(true);
  };

  const handleNew = () => {
    setEditingTransaction(null);
    setShowModal(true);
  };

  const handleModalClose = () => {
    setShowModal(false);
    setEditingTransaction(null);
  };

  const handleSave = async (payload: CreateTransactionPayload) => {
    try {
      if (editingTransaction) {
        await financialService.update({
          id: editingTransaction.id,
          clinic_id: editingTransaction.clinic_id,
          ...payload,
        });
      } else {
        await financialService.create(payload);
      }
      handleModalClose();
      fetchTransactions();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Erro ao salvar');
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>Financeiro</h1>
        <button className={styles.newBtn} onClick={handleNew}>
          <MdAdd size={16} />
          + Nova transação
        </button>
      </div>

      {/* Summary Cards */}
      <div className={styles.cards}>
        <div className={styles.card}>
          <span className={styles.cardLabel}>Receita do mês</span>
          <span className={`${styles.cardValue} ${styles.revenue}`}>{formatCurrency(revenue)}</span>
        </div>
        <div className={styles.card}>
          <span className={styles.cardLabel}>Despesas do mês</span>
          <span className={`${styles.cardValue} ${styles.expense}`}>{formatCurrency(expenses)}</span>
        </div>
        <div className={styles.card}>
          <span className={styles.cardLabel}>Saldo</span>
          <span className={`${styles.cardValue} ${balance >= 0 ? styles.revenue : styles.expense}`}>
            {formatCurrency(balance)}
          </span>
        </div>
      </div>

      {/* Transactions Table */}
      <div className={styles.tableSection}>
        <h2 className={styles.sectionTitle}>Transações recentes</h2>

        {loading && <p className={styles.loadingText}>Carregando...</p>}
        {error && <p className={styles.errorText}>{error}</p>}

        {!loading && !error && (
          <div className={styles.tableContainer}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Data</th>
                  <th>Descrição</th>
                  <th>Método</th>
                  <th>Tipo</th>
                  <th>Valor</th>
                  <th>Ação</th>
                </tr>
              </thead>
              <tbody>
                {transactions.length === 0 && (
                  <tr>
                    <td colSpan={6} className={styles.emptyRow}>
                      Nenhuma transação encontrada
                    </td>
                  </tr>
                )}
                {transactions.map((t) => (
                  <tr key={t.id}>
                    <td>{formatDate(t.created_at)}</td>
                    <td>{t.description}</td>
                    <td>{t.payment_method}</td>
                    <td>
                      <span className={t.amount >= 0 ? styles.tagRevenue : styles.tagExpense}>
                        {t.amount >= 0 ? 'Receita' : 'Despesa'}
                      </span>
                    </td>
                    <td className={t.amount >= 0 ? styles.revenue : styles.expense}>
                      {t.amount >= 0 ? '+' : ''}{formatCurrency(t.amount)}
                    </td>
                    <td>
                      <button className={styles.editBtn} onClick={() => handleEdit(t)} aria-label="Editar">
                        <MdEdit size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <TransactionModal
          transaction={editingTransaction}
          onClose={handleModalClose}
          onSave={handleSave}
        />
      )}
    </div>
  );
}

/* ===== MODAL COMPONENT ===== */
interface ModalProps {
  transaction: Transaction | null;
  onClose: () => void;
  onSave: (payload: CreateTransactionPayload) => void;
}

function TransactionModal({ transaction, onClose, onSave }: ModalProps) {
  const [form, setForm] = useState({
    description: transaction?.description || '',
    amount: transaction ? String(Math.abs(transaction.amount)) : '',
    payment_method: transaction?.payment_method || '',
    type: transaction ? (transaction.amount >= 0 ? 'revenue' : 'expense') : 'revenue',
  });

  const handleChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(form.amount);
    if (!form.description || isNaN(amount) || !form.payment_method) return;

    onSave({
      description: form.description,
      amount: form.type === 'expense' ? -Math.abs(amount) : Math.abs(amount),
      payment_method: form.payment_method,
      clinic_id: transaction?.clinic_id || CLINIC_ID,
    });
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <h2 className={styles.modalTitle}>
          {transaction ? 'Editar Transação' : 'Nova Transação'}
        </h2>

        <form className={styles.modalForm} onSubmit={handleSubmit}>
          <div className={styles.formField}>
            <label>Descrição</label>
            <input
              type="text"
              value={form.description}
              onChange={handleChange('description')}
              placeholder="Ex: Consulta veterinária"
            />
          </div>

          <div className={styles.formRow}>
            <div className={styles.formField}>
              <label>Valor (R$)</label>
              <input
                type="number"
                step="0.01"
                value={form.amount}
                onChange={handleChange('amount')}
                placeholder="0.00"
              />
            </div>
            <div className={styles.formField}>
              <label>Tipo</label>
              <select value={form.type} onChange={handleChange('type')}>
                <option value="revenue">Receita</option>
                <option value="expense">Despesa</option>
              </select>
            </div>
          </div>

          <div className={styles.formField}>
            <label>Método de pagamento</label>
            <input
              type="text"
              value={form.payment_method}
              onChange={handleChange('payment_method')}
              placeholder="Ex: PIX, Cartão, Dinheiro"
            />
          </div>

          <div className={styles.modalActions}>
            <button type="button" className={styles.cancelBtn} onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className={styles.saveBtn}>
              Salvar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
