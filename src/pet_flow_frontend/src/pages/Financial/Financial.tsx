import { useEffect, useState } from 'react';
import { MdEdit, MdAdd, MdDelete } from 'react-icons/md';
import { financialService, type Transaction, type CreateTransactionPayload } from '../../services/financial';
import { useSession } from '../../contexts/SessionContext';
import styles from './Financial.module.css';

function formatCurrency(value: number): string {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
}

function formatAmountDisplay(value: number): string {
  return value.toLocaleString('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function getLast6Months(): string[] {
  const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
  const now = new Date();
  const result: string[] = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    result.push(months[d.getMonth()]);
  }
  return result;
}

function getMonthlyData(transactions: Transaction[]): { revenue: number[]; expenses: number[] } {
  const now = new Date();
  const revenue = Array(6).fill(0);
  const expenses = Array(6).fill(0);

  transactions.forEach((t) => {
    const date = new Date(t.created_at);
    for (let i = 5; i >= 0; i--) {
      const monthStart = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthEnd = new Date(now.getFullYear(), now.getMonth() - i + 1, 0);
      if (date >= monthStart && date <= monthEnd) {
        const idx = 5 - i;
        if (t.amount >= 0) {
          revenue[idx] += t.amount;
        } else {
          expenses[idx] += Math.abs(t.amount);
        }
        break;
      }
    }
  });

  return { revenue, expenses };
}

export default function Financial() {
  const { session } = useSession();
  const clinicId = session?.clinicId || '';

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [showAll, setShowAll] = useState(false);
  const [deletingTransaction, setDeletingTransaction] = useState<Transaction | null>(null);

  const fetchTransactions = async () => {
    if (!clinicId) return;
    setLoading(true);
    setError('');
    try {
      const data = await financialService.getAll(clinicId);
      setTransactions(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar transações');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [clinicId]);

  const revenue = transactions
    .filter((t) => t.amount > 0)
    .reduce((sum, t) => sum + t.amount, 0);

  const expenses = transactions
    .filter((t) => t.amount < 0)
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);

  const balance = revenue - expenses;
  const balancePercentage = revenue > 0 ? Math.round((balance / revenue) * 100) : 0;

  const handleEdit = (transaction: Transaction) => {
    setEditingTransaction(transaction);
    setShowModal(true);
  };

  const handleDelete = (transaction: Transaction) => {
    setDeletingTransaction(transaction);
  };

  const confirmDelete = async () => {
    if (!deletingTransaction) return;
    try {
      await financialService.delete(deletingTransaction.id, deletingTransaction.clinic_id);
      setDeletingTransaction(null);
      fetchTransactions();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Erro ao excluir');
    }
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
        await financialService.create({ ...payload, clinic_id: clinicId });
      }
      handleModalClose();
      fetchTransactions();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Erro ao salvar');
    }
  };

  const monthLabels = getLast6Months();
  const monthlyData = getMonthlyData(transactions);
  const maxChartValue = Math.max(...monthlyData.revenue, ...monthlyData.expenses, 1);
  const displayedTransactions = showAll ? transactions : transactions.slice(0, 5);

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>Financeiro</h1>
      </div>

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
          <span className={`${styles.cardValue} ${styles.balancePositive}`}>{formatCurrency(balance)}</span>
          <span className={styles.cardSubtext}>
            {balancePercentage >= 0 ? '+' : ''}{balancePercentage}% esse mês
          </span>
        </div>
      </div>

      <div className={styles.bottomRow}>
        <div className={styles.chartSection}>
          <div className={styles.chartHeader}>
            <h2 className={styles.sectionTitle}>Resumo (últimos 6 meses)</h2>
            <div className={styles.chartLegend}>
              <span className={styles.legendItem}>
                <span className={`${styles.legendDot} ${styles.legendRevenue}`} />
                Receita
              </span>
              <span className={styles.legendItem}>
                <span className={`${styles.legendDot} ${styles.legendExpense}`} />
                Despesas
              </span>
            </div>
          </div>

          <div className={styles.chart}>
            <div className={styles.chartYAxis}>
              {[100, 80, 60, 40, 20, 0].map((val) => (
                <span key={val} className={styles.chartYLabel}>
                  {Math.round((val / 100) * maxChartValue / 1000)}k
                </span>
              ))}
            </div>
            <div className={styles.chartBars}>
              {monthLabels.map((month, idx) => (
                <div key={month} className={styles.chartBarGroup}>
                  <div className={styles.chartBarContainer}>
                    <div
                      className={`${styles.chartBar} ${styles.barRevenue}`}
                      style={{ height: `${(monthlyData.revenue[idx] / maxChartValue) * 100}%` }}
                    />
                    <div
                      className={`${styles.chartBar} ${styles.barExpense}`}
                      style={{ height: `${(monthlyData.expenses[idx] / maxChartValue) * 100}%` }}
                    />
                  </div>
                  <span className={styles.chartXLabel}>{month}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className={styles.tableSection}>
          <div className={styles.tableHeader}>
            <h2 className={styles.sectionTitle}>Transações recentes</h2>
            <button className={styles.newBtn} onClick={handleNew}>
              <MdAdd size={14} />
              Nova transação
            </button>
          </div>

          {loading && <p className={styles.loadingText}>Carregando...</p>}
          {error && <p className={styles.errorText}>{error}</p>}

          {!loading && !error && (
            <>
              <div className={styles.tableContainer}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>Data</th>
                      <th>Descrição</th>
                      <th>Tipo</th>
                      <th>Valor</th>
                      <th>Ação</th>
                    </tr>
                  </thead>
                  <tbody>
                    {displayedTransactions.length === 0 && (
                      <tr>
                        <td colSpan={5} className={styles.emptyRow}>
                          Nenhuma transação encontrada
                        </td>
                      </tr>
                    )}
                    {displayedTransactions.map((t) => (
                      <tr key={t.id}>
                        <td>{formatDate(t.created_at)}</td>
                        <td>{t.description}</td>
                        <td>
                          <span className={t.amount >= 0 ? styles.tagRevenue : styles.tagExpense}>
                            {t.amount >= 0 ? 'Receita' : 'Despesa'}
                          </span>
                        </td>
                        <td className={t.amount >= 0 ? styles.revenue : styles.expense}>
                          {t.amount >= 0 ? '+' : ''}{Math.abs(t.amount).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </td>
                        <td>
                          <button className={styles.editBtn} onClick={() => handleEdit(t)} aria-label="Editar">
                            <MdEdit size={14} />
                          </button>
                          <button className={styles.deleteBtn} onClick={() => handleDelete(t)} aria-label="Excluir">
                            <MdDelete size={14} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {!showAll && transactions.length > 5 && (
                <button className={styles.viewAllBtn} onClick={() => setShowAll(true)}>
                  Ver todas transações
                </button>
              )}
            </>
          )}
        </div>
      </div>

      {showModal && (
        <TransactionModal
          transaction={editingTransaction}
          onClose={handleModalClose}
          onSave={handleSave}
        />
      )}

      {deletingTransaction && (
        <div className={styles.overlay} onClick={() => setDeletingTransaction(null)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <h2 className={styles.modalTitle}>Excluir Transação</h2>
            <p className={styles.deleteMessage}>
              Deseja mesmo deletar a transação <strong>"{deletingTransaction.description}"</strong>?
            </p>
            <div className={styles.deleteActions}>
              <button className={styles.confirmDeleteBtn} onClick={confirmDelete}>
                Sim, remover
              </button>
              <button className={styles.cancelBtn} onClick={() => setDeletingTransaction(null)}>
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

interface ModalProps {
  transaction: Transaction | null;
  onClose: () => void;
  onSave: (payload: CreateTransactionPayload) => void;
}

function TransactionModal({ transaction, onClose, onSave }: ModalProps) {
  const [form, setForm] = useState({
    description: transaction?.description || '',
    amount: transaction ? formatAmountDisplay(Math.abs(transaction.amount)) : '',
    payment_method: transaction?.payment_method || '',
    type: transaction ? (transaction.amount >= 0 ? 'revenue' : 'expense') : 'revenue',
  });

  const handleChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, '');
    if (!raw) {
      setForm((prev) => ({ ...prev, amount: '' }));
      return;
    }
    const cents = parseInt(raw, 10);
    const formatted = (cents / 100).toLocaleString('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
    setForm((prev) => ({ ...prev, amount: formatted }));
  };

  const getAmountNumber = (): number => {
    const cleaned = form.amount.replace(/\./g, '').replace(',', '.');
    return parseFloat(cleaned) || 0;
  };

  const isFormValid = () => {
    return (
      form.description.trim().length > 0 &&
      getAmountNumber() >= 1 &&
      form.payment_method !== ''
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid()) return;

    const amount = getAmountNumber();

    onSave({
      description: form.description.trim(),
      amount: form.type === 'expense' ? -Math.abs(amount) : Math.abs(amount),
      payment_method: form.payment_method,
      clinic_id: transaction?.clinic_id || '',
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
                type="text"
                inputMode="numeric"
                value={form.amount}
                onChange={handleAmountChange}
                placeholder="0,00"
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
            <select value={form.payment_method} onChange={handleChange('payment_method')}>
              <option value="">Selecione...</option>
              <option value="Cartão">Cartão</option>
              <option value="Pix">Pix</option>
              <option value="Dinheiro">Dinheiro</option>
            </select>
          </div>

          <div className={styles.modalActions}>
            <button type="button" className={styles.cancelBtn} onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className={styles.saveBtn} disabled={!isFormValid()}>
              Salvar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
