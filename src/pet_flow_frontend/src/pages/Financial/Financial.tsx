import { MdEdit, MdAdd, MdDelete } from 'react-icons/md';
import { useFinancial } from './useFinancial';
import { formatCurrency, formatDate, getLast6Months, getMonthlyData } from './utils';
import TransactionModal from './components/TransactionModal';
import DeleteModal from './components/DeleteModal';
import styles from './Financial.module.css';

export default function Financial() {
  const {
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
  } = useFinancial();

  const monthLabels = getLast6Months();
  const monthlyData = getMonthlyData(transactions);
  const maxChartValue = Math.max(...monthlyData.revenue, ...monthlyData.expenses, 1);

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
        <DeleteModal
          transaction={deletingTransaction}
          onConfirm={confirmDelete}
          onCancel={() => setDeletingTransaction(null)}
        />
      )}
    </div>
  );
}
