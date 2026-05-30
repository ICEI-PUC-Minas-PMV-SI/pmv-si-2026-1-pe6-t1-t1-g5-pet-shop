import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Modal,
  TextInput,
  ActivityIndicator,
  Alert,
  RefreshControl,
} from 'react-native';
import { colors, spacing, fontSize, radius, fontWeight, opacity } from '../theme';
import { financialService } from '../services';
import { useSession } from '../contexts/SessionContext';
import type { Transaction, CreateTransactionPayload } from '../types';

function formatCurrency(value: number): string {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
}

function formatAmountInput(raw: string): string {
  const digits = raw.replace(/\D/g, '');
  if (!digits) return '';
  const cents = parseInt(digits, 10);
  return (cents / 100).toLocaleString('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function parseAmount(formatted: string): number {
  const cleaned = formatted.replace(/\./g, '').replace(',', '.');
  return parseFloat(cleaned) || 0;
}

export default function FinancialScreen() {
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
      const data = await financialService.getAll(clinicId);
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
              await financialService.delete(transaction.id, transaction.clinic_id);
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
      setShowModal(false);
      setEditingTransaction(null);
      fetchTransactions();
    } catch (err) {
      Alert.alert('Erro', err instanceof Error ? err.message : 'Erro ao salvar');
    }
  };

  const renderTransaction = ({ item }: { item: Transaction }) => (
    <View style={styles.row}>
      <View style={styles.rowLeft}>
        <Text style={styles.rowDate}>{formatDate(item.created_at)}</Text>
        <Text style={styles.rowDescription} numberOfLines={1}>{item.description}</Text>
        <View style={[styles.tag, item.amount >= 0 ? styles.tagRevenue : styles.tagExpense]}>
          <Text style={[styles.tagText, item.amount >= 0 ? styles.tagTextRevenue : styles.tagTextExpense]}>
            {item.amount >= 0 ? 'Receita' : 'Despesa'}
          </Text>
        </View>
      </View>
      <View style={styles.rowRight}>
        <Text style={[styles.rowAmount, item.amount >= 0 ? styles.amountRevenue : styles.amountExpense]}>
          {item.amount >= 0 ? '+' : ''}{Math.abs(item.amount).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
        </Text>
        <View style={styles.rowActions}>
          <TouchableOpacity style={styles.editBtn} onPress={() => handleEdit(item)}>
            <Text style={styles.editBtnText}>✏️</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.deleteBtn} onPress={() => handleDelete(item)}>
            <Text style={styles.deleteBtnText}>🗑️</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.cards}>
        <View style={styles.card}>
          <Text style={styles.cardLabel}>Receita</Text>
          <Text style={[styles.cardValue, styles.amountRevenue]}>{formatCurrency(revenue)}</Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.cardLabel}>Despesas</Text>
          <Text style={[styles.cardValue, styles.amountExpense]}>{formatCurrency(expenses)}</Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.cardLabel}>Saldo</Text>
          <Text style={[styles.cardValue, { color: colors.primary }]}>{formatCurrency(balance)}</Text>
        </View>
      </View>

      <View style={styles.tableHeader}>
        <Text style={styles.sectionTitle}>Transações recentes</Text>
        <TouchableOpacity style={styles.newBtn} onPress={handleNew}>
          <Text style={styles.newBtnText}>+ Nova</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={transactions}
        keyExtractor={(item) => item.id}
        renderItem={renderTransaction}
        contentContainerStyle={styles.list}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.primary]} />}
        ListEmptyComponent={<Text style={styles.emptyText}>Nenhuma transação encontrada</Text>}
      />

      <TransactionModal
        visible={showModal}
        transaction={editingTransaction}
        onClose={() => { setShowModal(false); setEditingTransaction(null); }}
        onSave={handleSave}
      />
    </View>
  );
}

interface ModalProps {
  visible: boolean;
  transaction: Transaction | null;
  onClose: () => void;
  onSave: (payload: CreateTransactionPayload) => void;
}

function TransactionModal({ visible, transaction, onClose, onSave }: ModalProps) {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState<'revenue' | 'expense'>('revenue');
  const [paymentMethod, setPaymentMethod] = useState('');

  useEffect(() => {
    if (visible) {
      setDescription(transaction?.description || '');
      setAmount(transaction ? formatAmountInput(String(Math.round(Math.abs(transaction.amount) * 100))) : '');
      setType(transaction ? (transaction.amount >= 0 ? 'revenue' : 'expense') : 'revenue');
      setPaymentMethod(transaction?.payment_method || '');
    }
  }, [visible, transaction]);

  const isValid = description.trim().length > 0 && parseAmount(amount) >= 1 && paymentMethod !== '';

  const handleSubmit = () => {
    if (!isValid) return;
    const value = parseAmount(amount);
    onSave({
      description: description.trim(),
      amount: type === 'expense' ? -Math.abs(value) : Math.abs(value),
      payment_method: paymentMethod,
      clinic_id: '',
    });
  };

  const paymentOptions = ['Cartão', 'Pix', 'Dinheiro'];

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={modalStyles.overlay}>
        <View style={modalStyles.container}>
          <Text style={modalStyles.title}>
            {transaction ? 'Editar Transação' : 'Nova Transação'}
          </Text>

          <Text style={modalStyles.label}>Descrição</Text>
          <TextInput
            style={modalStyles.input}
            value={description}
            onChangeText={setDescription}
            placeholder="Ex: Consulta veterinária"
            placeholderTextColor={colors.textPlaceholder}
          />

          <Text style={modalStyles.label}>Valor (R$)</Text>
          <TextInput
            style={modalStyles.input}
            value={amount}
            onChangeText={(text) => setAmount(formatAmountInput(text))}
            placeholder="0,00"
            placeholderTextColor={colors.textPlaceholder}
            keyboardType="numeric"
          />

          <Text style={modalStyles.label}>Tipo</Text>
          <View style={modalStyles.typeRow}>
            <TouchableOpacity
              style={[modalStyles.typeBtn, type === 'revenue' && modalStyles.typeBtnActiveRevenue]}
              onPress={() => setType('revenue')}
            >
              <Text style={[modalStyles.typeBtnText, type === 'revenue' && modalStyles.typeBtnTextActive]}>
                Receita
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[modalStyles.typeBtn, type === 'expense' && modalStyles.typeBtnActiveExpense]}
              onPress={() => setType('expense')}
            >
              <Text style={[modalStyles.typeBtnText, type === 'expense' && modalStyles.typeBtnTextActive]}>
                Despesa
              </Text>
            </TouchableOpacity>
          </View>

          <Text style={modalStyles.label}>Método de pagamento</Text>
          <View style={modalStyles.paymentRow}>
            {paymentOptions.map((option) => (
              <TouchableOpacity
                key={option}
                style={[modalStyles.paymentBtn, paymentMethod === option && modalStyles.paymentBtnActive]}
                onPress={() => setPaymentMethod(option)}
              >
                <Text style={[modalStyles.paymentBtnText, paymentMethod === option && modalStyles.paymentBtnTextActive]}>
                  {option}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={modalStyles.actions}>
            <TouchableOpacity style={modalStyles.cancelBtn} onPress={onClose}>
              <Text style={modalStyles.cancelBtnText}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[modalStyles.saveBtn, !isValid && modalStyles.saveBtnDisabled]}
              onPress={handleSubmit}
              disabled={!isValid}
            >
              <Text style={modalStyles.saveBtnText}>Salvar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bgMain,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.bgMain,
  },
  cards: {
    flexDirection: 'row',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    gap: spacing.sm,
  },
  card: {
    flex: 1,
    backgroundColor: colors.bgWhite,
    borderRadius: radius.lg,
    padding: spacing.md,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  cardLabel: {
    fontSize: fontSize.xs,
    color: colors.textPlaceholder,
    fontWeight: fontWeight.medium,
    marginBottom: 4,
  },
  cardValue: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.bold,
  },
  tableHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl,
    paddingBottom: spacing.sm,
  },
  sectionTitle: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.semibold,
    color: colors.textPrimary,
  },
  newBtn: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.round,
  },
  newBtnText: {
    color: colors.textWhite,
    fontSize: fontSize.sm,
    fontWeight: fontWeight.semibold,
  },
  list: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xxxl,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.bgWhite,
    borderRadius: radius.lg,
    padding: spacing.md,
    marginBottom: spacing.sm,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  rowLeft: {
    flex: 1,
    gap: 4,
  },
  rowDate: {
    fontSize: fontSize.xs,
    color: colors.textPlaceholder,
  },
  rowDescription: {
    fontSize: fontSize.base,
    fontWeight: fontWeight.medium,
    color: colors.textPrimary,
  },
  tag: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    marginTop: 4,
  },
  tagRevenue: {
    backgroundColor: 'rgba(125,199,103,0.15)',
  },
  tagExpense: {
    backgroundColor: 'rgba(222,103,103,0.15)',
  },
  tagText: {
    fontSize: 11,
    fontWeight: fontWeight.medium,
  },
  tagTextRevenue: {
    color: colors.success,
  },
  tagTextExpense: {
    color: colors.danger,
  },
  rowRight: {
    alignItems: 'flex-end',
    gap: 6,
  },
  rowAmount: {
    fontSize: fontSize.base,
    fontWeight: fontWeight.semibold,
  },
  amountRevenue: {
    color: colors.success,
  },
  amountExpense: {
    color: colors.danger,
  },
  rowActions: {
    flexDirection: 'row',
    gap: 6,
  },
  editBtn: {
    width: 28,
    height: 28,
    borderRadius: radius.md,
    backgroundColor: colors.primaryBg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  editBtnText: {
    fontSize: 12,
  },
  deleteBtn: {
    width: 28,
    height: 28,
    borderRadius: radius.md,
    backgroundColor: colors.dangerBg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteBtnText: {
    fontSize: 12,
  },
  emptyText: {
    textAlign: 'center',
    color: colors.textPlaceholder,
    fontSize: fontSize.base,
    paddingVertical: spacing.xxxl,
  },
});

const modalStyles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  container: {
    backgroundColor: colors.bgWhite,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: spacing.xxl,
    paddingBottom: 40,
  },
  title: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.semibold,
    color: colors.textPrimary,
    marginBottom: spacing.xl,
  },
  label: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.medium,
    color: colors.textPrimary,
    marginBottom: 6,
    marginTop: spacing.md,
  },
  input: {
    backgroundColor: colors.bgCard,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: 12,
    fontSize: fontSize.base,
    color: colors.textPrimary,
    borderWidth: 1,
    borderColor: colors.border,
  },
  typeRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  typeBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
  },
  typeBtnActiveRevenue: {
    backgroundColor: colors.success,
    borderColor: colors.success,
  },
  typeBtnActiveExpense: {
    backgroundColor: colors.danger,
    borderColor: colors.danger,
  },
  typeBtnText: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.medium,
    color: colors.textPrimary,
  },
  typeBtnTextActive: {
    color: colors.textWhite,
  },
  paymentRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  paymentBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
  },
  paymentBtnActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  paymentBtnText: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.medium,
    color: colors.textPrimary,
  },
  paymentBtnTextActive: {
    color: colors.textWhite,
  },
  actions: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.xxl,
  },
  cancelBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: radius.md,
    backgroundColor: colors.bgCard,
    alignItems: 'center',
  },
  cancelBtnText: {
    fontSize: fontSize.base,
    fontWeight: fontWeight.medium,
    color: colors.textPrimary,
  },
  saveBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: radius.md,
    backgroundColor: colors.primary,
    alignItems: 'center',
  },
  saveBtnDisabled: {
    opacity: 0.5,
  },
  saveBtnText: {
    fontSize: fontSize.base,
    fontWeight: fontWeight.semibold,
    color: colors.textWhite,
  },
});
