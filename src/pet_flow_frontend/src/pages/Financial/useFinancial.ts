import { useEffect, useState } from 'react';
import { financialService, type Transaction, type CreateTransactionPayload } from '../../services/financial';
import { useSession } from '../../contexts/SessionContext';

export function useFinancial() {
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

  const revenue = transactions.filter((t) => t.amount > 0).reduce((sum, t) => sum + t.amount, 0);
  const expenses = transactions.filter((t) => t.amount < 0).reduce((sum, t) => sum + Math.abs(t.amount), 0);
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
        const { clinic_id: _ignoredClinicId, ...rest } = payload;
        await financialService.update({
          id: editingTransaction.id,
          clinic_id: editingTransaction.clinic_id,
          description: rest.description,
          amount: rest.amount,
          payment_method: rest.payment_method,
          scheduling_id: rest.scheduling_id ?? undefined,
          employee_id: rest.employee_id ?? undefined,
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

  const displayedTransactions = showAll ? transactions : transactions.slice(0, 5);

  return {
    transactions,
    displayedTransactions,
    loading,
    error,
    showModal,
    editingTransaction,
    showAll,
    setShowAll,
    deletingTransaction,
    setDeletingTransaction,
    revenue,
    expenses,
    balance,
    balancePercentage,
    handleEdit,
    handleDelete,
    confirmDelete,
    handleNew,
    handleModalClose,
    handleSave,
  };
}
