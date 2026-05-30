import { useEffect, useState, useCallback } from 'react';
import { Alert } from 'react-native';
import { useSession } from '../../contexts/SessionContext';
import type { Transaction, CreateTransactionPayload } from '../../types';
import { fetchAllTransactions, createTransaction, updateTransaction, deleteTransaction } from './api';

export function useFinancial() {
  const { session } = useSession();
  const clinicId = session?.clinicId || '';

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);

  const fetchTransactions = useCallback(async () => {
    if (!clinicId) return;
    try {
      const data = await fetchAllTransactions(clinicId);
      setTransactions(data);
    } catch (err) {
      Alert.alert('Erro', err instanceof Error ? err.message : 'Erro ao carregar transações');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [clinicId]);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchTransactions();
  };

  const revenue = transactions.filter((t) => t.amount > 0).reduce((sum, t) => sum + t.amount, 0);
  const expenses = transactions.filter((t) => t.amount < 0).reduce((sum, t) => sum + Math.abs(t.amount), 0);
  const balance = revenue - expenses;

  const handleEdit = (transaction: Transaction) => {
    setEditingTransaction(transaction);
    setShowModal(true);
  };

  const handleDelete = (transaction: Transaction) => {
    Alert.alert(
      'Excluir Transação',
      `Deseja mesmo deletar "${transaction.description}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Sim, remover',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteTransaction(transaction.id, transaction.clinic_id);
              fetchTransactions();
            } catch (err) {
              Alert.alert('Erro', err instanceof Error ? err.message : 'Erro ao excluir');
            }
          },
        },
      ],
    );
  };

  const handleNew = () => {
    setEditingTransaction(null);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingTransaction(null);
  };

  const handleSave = async (payload: CreateTransactionPayload) => {
    try {
      if (editingTransaction) {
        await updateTransaction(editingTransaction.id, editingTransaction.clinic_id, {
          description: payload.description,
          amount: payload.amount,
          payment_method: payload.payment_method,
        });
      } else {
        await createTransaction({ ...payload, clinic_id: clinicId });
      }
      closeModal();
      fetchTransactions();
    } catch (err) {
      Alert.alert('Erro', err instanceof Error ? err.message : 'Erro ao salvar');
    }
  };

  return {
    transactions,
    loading,
    refreshing,
    showModal,
    editingTransaction,
    revenue,
    expenses,
    balance,
    onRefresh,
    handleEdit,
    handleDelete,
    handleNew,
    handleSave,
    closeModal,
  };
}
