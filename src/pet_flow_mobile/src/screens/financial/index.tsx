import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, RefreshControl, TextInput } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { colors } from '../../theme';
import type { Transaction } from '../../types';
import { useFinancial } from './useFinancial';
import { styles, allTransactionsStyles } from './styles';
import TransactionModal from './components/TransactionModal';
import DeleteModal from './components/DeleteModal';

function formatCurrency(value: number): string {
  return 'R$ ' + Math.abs(value).toLocaleString('pt-BR', { minimumFractionDigits: 2 });
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
}

function formatTime(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
}

function getDateLabel(dateStr: string): string {
  const date = new Date(dateStr);
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  if (date.toDateString() === today.toDateString()) {
    return 'HOJE, ' + date.toLocaleDateString('pt-BR', { day: 'numeric', month: 'long' }).toUpperCase();
  }
  if (date.toDateString() === yesterday.toDateString()) {
    return 'ONTEM, ' + date.toLocaleDateString('pt-BR', { day: 'numeric', month: 'long' }).toUpperCase();
  }
  return date.toLocaleDateString('pt-BR', { day: 'numeric', month: 'long' }).toUpperCase();
}

function getIconForTransaction(transaction: Transaction): { name: string; color: string } {
  const desc = transaction.description.toLowerCase();
  if (desc.includes('banho') || desc.includes('tosa')) return { name: 'content-cut', color: colors.primary };
  if (desc.includes('vacina')) return { name: 'medical-services', color: colors.success };
  if (desc.includes('ração') || desc.includes('racao')) return { name: 'restaurant', color: '#F59E0B' };
  if (desc.includes('conta') || desc.includes('luz') || desc.includes('água')) return { name: 'bolt', color: '#8B5CF6' };
  if (desc.includes('fornecedor')) return { name: 'local-shipping', color: '#EF4444' };
  if (desc.includes('consulta') || desc.includes('clínica')) return { name: 'local-hospital', color: colors.success };
  if (desc.includes('venda') || desc.includes('medicamento')) return { name: 'inventory-2', color: colors.primary };
  if (transaction.amount >= 0) return { name: 'attach-money', color: colors.success };
  return { name: 'shopping-cart', color: colors.danger };
}

// Summary/Dashboard view (initial)
function FinancialSummary({
  transactions,
  revenue,
  expenses,
  balance,
  balancePercentage,
  refreshing,
  onRefresh,
  onViewAll,
  onNew,
  handleEdit,
}: {
  transactions: Transaction[];
  revenue: number;
  expenses: number;
  balance: number;
  balancePercentage: number;
  refreshing: boolean;
  onRefresh: () => void;
  onViewAll: () => void;
  onNew: () => void;
  handleEdit: (t: Transaction) => void;
}) {
  const recent = transactions.slice(0, 4);

  return (
    <View style={styles.container}>
      <FlatList
        data={recent}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={
          <>
            {/* Search */}
            <View style={styles.searchContainer}>
              <MaterialIcons name="search" size={20} color={colors.textPlaceholder} />
              <TextInput
                style={styles.searchInput}
                placeholder="Buscar transação..."
                placeholderTextColor={colors.textPlaceholder}
                editable={false}
              />
            </View>

            {/* Summary Cards */}
            <View style={styles.summaryRow}>
              <View style={styles.summaryCard}>
                <Text style={styles.summaryLabel}>Receita</Text>
                <Text style={[styles.summaryValue, styles.revenueColor]}>{formatCurrency(revenue)}</Text>
              </View>
              <View style={styles.summaryCard}>
                <Text style={styles.summaryLabel}>Despesas</Text>
                <Text style={[styles.summaryValue, styles.expenseColor]}>{formatCurrency(expenses)}</Text>
              </View>
            </View>

            {/* Balance Card */}
            <View style={styles.balanceCard}>
              <Text style={styles.summaryLabel}>Saldo</Text>
              <Text style={[styles.balanceValue, styles.revenueColor]}>{formatCurrency(balance)}</Text>
              <View style={styles.balancePercentRow}>
                <MaterialIcons name="trending-up" size={14} color={colors.success} />
                <Text style={styles.balancePercent}>+{balancePercentage}%</Text>
              </View>
            </View>

            {/* Section title */}
            <Text style={styles.sectionTitle}>Transações recentes</Text>
          </>
        }
        renderItem={({ item }) => {
          const icon = getIconForTransaction(item);
          return (
            <TouchableOpacity style={styles.transactionCard} onPress={() => handleEdit(item)}>
              <View style={[styles.transactionIcon, item.amount >= 0 ? styles.iconBgRevenue : styles.iconBgExpense]}>
                <MaterialIcons name={icon.name as any} size={20} color={icon.color} />
              </View>
              <View style={styles.transactionContent}>
                <Text style={styles.transactionDesc} numberOfLines={1}>{item.description}</Text>
                <Text style={styles.transactionSub}>{formatDate(item.created_at)}</Text>
              </View>
              <Text style={[styles.transactionAmount, item.amount >= 0 ? styles.revenueColor : styles.expenseColor]}>
                {item.amount >= 0 ? '+ ' : '- '}{formatCurrency(item.amount)}
              </Text>
            </TouchableOpacity>
          );
        }}
        ListFooterComponent={
          <TouchableOpacity style={styles.viewAllBtn} onPress={onViewAll}>
            <Text style={styles.viewAllText}>Ver todas as transações</Text>
          </TouchableOpacity>
        }
        contentContainerStyle={styles.listContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.primary]} />}
        ListEmptyComponent={<Text style={styles.emptyText}>Nenhuma transação encontrada</Text>}
      />

      <TouchableOpacity style={styles.fab} onPress={onNew}>
        <MaterialIcons name="add" size={28} color={colors.textWhite} />
      </TouchableOpacity>
    </View>
  );
}

// All Transactions view (full list with filters, grouped by date)
function AllTransactions({
  transactions,
  refreshing,
  onRefresh,
  onBack,
  handleEdit,
  handleDelete,
  filter,
  setFilter,
}: {
  transactions: Transaction[];
  refreshing: boolean;
  onRefresh: () => void;
  onBack: () => void;
  handleEdit: (t: Transaction) => void;
  handleDelete: (t: Transaction) => void;
  filter: string;
  setFilter: (f: 'all' | 'revenue' | 'expense') => void;
}) {
  const filtered = transactions.filter((t) => {
    if (filter === 'revenue') return t.amount >= 0;
    if (filter === 'expense') return t.amount < 0;
    return true;
  });

  // Group by date
  const grouped: { title: string; data: Transaction[] }[] = [];
  const groupMap: Record<string, Transaction[]> = {};
  for (const t of filtered) {
    const label = getDateLabel(t.created_at);
    if (!groupMap[label]) {
      groupMap[label] = [];
      grouped.push({ title: label, data: groupMap[label] });
    }
    groupMap[label].push(t);
  }

  return (
    <View style={allTransactionsStyles.container}>
      <View style={allTransactionsStyles.header}>
        <Text style={allTransactionsStyles.title}>Todas as Transações</Text>
        <Text style={allTransactionsStyles.subtitle}>Histórico completo de receitas e despesas</Text>
      </View>

      <View style={allTransactionsStyles.filters}>
        <TouchableOpacity
          style={[allTransactionsStyles.filterBtn, filter === 'revenue' && allTransactionsStyles.filterBtnActive]}
          onPress={() => setFilter(filter === 'revenue' ? 'all' : 'revenue')}
        >
          <MaterialIcons name="trending-up" size={14} color={filter === 'revenue' ? colors.textWhite : colors.success} />
          <Text style={[allTransactionsStyles.filterText, filter === 'revenue' && allTransactionsStyles.filterTextActive]}>
            Receitas
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[allTransactionsStyles.filterBtn, filter === 'expense' && allTransactionsStyles.filterBtnActive]}
          onPress={() => setFilter(filter === 'expense' ? 'all' : 'expense')}
        >
          <MaterialIcons name="trending-down" size={14} color={filter === 'expense' ? colors.textWhite : colors.danger} />
          <Text style={[allTransactionsStyles.filterText, filter === 'expense' && allTransactionsStyles.filterTextActive]}>
            Despesas
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={allTransactionsStyles.filterBtn}>
          <MaterialIcons name="date-range" size={14} color={colors.textPrimary} />
          <Text style={allTransactionsStyles.filterText}>Período</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={grouped}
        keyExtractor={(item) => item.title}
        renderItem={({ item: section }) => (
          <View>
            <View style={allTransactionsStyles.sectionHeader}>
              <Text style={allTransactionsStyles.sectionTitle}>{section.title}</Text>
            </View>
            {section.data.map((item) => {
              const icon = getIconForTransaction(item);
              return (
                <TouchableOpacity
                  key={item.id}
                  style={allTransactionsStyles.card}
                  onPress={() => handleEdit(item)}
                  onLongPress={() => handleDelete(item)}
                >
                  <View style={[allTransactionsStyles.cardIcon, item.amount >= 0 ? allTransactionsStyles.iconRevenue : allTransactionsStyles.iconExpense]}>
                    <MaterialIcons name={icon.name as any} size={22} color={icon.color} />
                  </View>
                  <View style={allTransactionsStyles.cardContent}>
                    <Text style={allTransactionsStyles.cardDesc} numberOfLines={1}>{item.description}</Text>
                    <Text style={allTransactionsStyles.cardSub}>
                      {item.payment_method} • {formatTime(item.created_at)}
                    </Text>
                  </View>
                  <View style={allTransactionsStyles.cardRight}>
                    <Text style={[allTransactionsStyles.cardAmount, item.amount >= 0 ? allTransactionsStyles.amountRevenue : allTransactionsStyles.amountExpense]}>
                      {item.amount >= 0 ? '+ ' : '- '}R$ {Math.abs(item.amount).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </Text>
                    <Text style={allTransactionsStyles.cardPayment}>{item.payment_method}</Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        )}
        contentContainerStyle={allTransactionsStyles.list}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.primary]} />}
        ListEmptyComponent={<Text style={allTransactionsStyles.emptyText}>Nenhuma transação encontrada</Text>}
      />
    </View>
  );
}

export default function FinancialScreen() {
  const {
    transactions,
    loading,
    refreshing,
    showModal,
    editingTransaction,
    deletingTransaction,
    filter,
    setFilter,
    onRefresh,
    handleEdit,
    handleDelete,
    confirmDelete,
    cancelDelete,
    handleNew,
    handleSave,
    closeModal,
    revenue,
    expenses,
    balance,
    balancePercentage,
  } = useFinancial();

  const [viewAll, setViewAll] = useState(false);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      {viewAll ? (
        <AllTransactions
          transactions={transactions}
          refreshing={refreshing}
          onRefresh={onRefresh}
          onBack={() => setViewAll(false)}
          handleEdit={handleEdit}
          handleDelete={handleDelete}
          filter={filter}
          setFilter={setFilter}
        />
      ) : (
        <FinancialSummary
          transactions={transactions}
          revenue={revenue}
          expenses={expenses}
          balance={balance}
          balancePercentage={balancePercentage}
          refreshing={refreshing}
          onRefresh={onRefresh}
          onViewAll={() => setViewAll(true)}
          onNew={handleNew}
          handleEdit={handleEdit}
        />
      )}

      <TransactionModal
        visible={showModal}
        transaction={editingTransaction}
        onClose={closeModal}
        onSave={handleSave}
      />

      <DeleteModal
        visible={!!deletingTransaction}
        transaction={deletingTransaction}
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
      />
    </View>
  );
}
