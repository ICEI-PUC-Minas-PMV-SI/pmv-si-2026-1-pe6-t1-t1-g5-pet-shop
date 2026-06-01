import React from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, RefreshControl } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { colors } from '../../theme';
import type { Transaction } from '../../types';
import { useFinancial } from './useFinancial';
import { styles } from './styles';
import TransactionModal from './components/TransactionModal';

function formatCurrency(value: number): string {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
}

export default function FinancialScreen() {
  const {
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
  } = useFinancial();

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
            <MaterialIcons name="edit" size={14} color={colors.primary} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.deleteBtn} onPress={() => handleDelete(item)}>
            <MaterialIcons name="delete" size={14} color={colors.danger} />
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
        onClose={closeModal}
        onSave={handleSave}
      />
    </View>
  );
}
