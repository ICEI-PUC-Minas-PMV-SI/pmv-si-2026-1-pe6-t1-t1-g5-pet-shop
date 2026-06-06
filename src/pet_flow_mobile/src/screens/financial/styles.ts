import { StyleSheet } from 'react-native';
import { colors, spacing, fontSize, radius, fontWeight } from '../../theme';

// Summary/Dashboard view styles
export const styles = StyleSheet.create({
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
  listContent: {
    paddingHorizontal: spacing.xl,
    paddingBottom: 100,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.bgWhite,
    borderRadius: radius.lg,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    marginBottom: spacing.lg,
    marginTop: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  searchInput: {
    flex: 1,
    marginLeft: spacing.sm,
    fontSize: fontSize.base,
    color: colors.textPrimary,
  },
  summaryRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  summaryCard: {
    flex: 1,
    backgroundColor: colors.bgWhite,
    borderRadius: radius.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  summaryLabel: {
    fontSize: fontSize.xs,
    color: colors.textPlaceholder,
    fontWeight: fontWeight.medium,
    marginBottom: 4,
  },
  summaryValue: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
  },
  revenueColor: {
    color: colors.success,
  },
  expenseColor: {
    color: colors.danger,
  },
  balanceCard: {
    backgroundColor: colors.bgWhite,
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginBottom: spacing.xl,
    borderWidth: 1,
    borderColor: colors.border,
  },
  balanceValue: {
    fontSize: fontSize.xxl,
    fontWeight: fontWeight.bold,
  },
  balancePercentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    gap: 4,
  },
  balancePercent: {
    fontSize: fontSize.xs,
    color: colors.success,
    fontWeight: fontWeight.medium,
  },
  sectionTitle: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.semibold,
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  transactionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.bgWhite,
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  transactionIcon: {
    width: 40,
    height: 40,
    borderRadius: radius.lg,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  iconBgRevenue: {
    backgroundColor: 'rgba(125,199,103,0.15)',
  },
  iconBgExpense: {
    backgroundColor: 'rgba(222,103,103,0.15)',
  },
  transactionContent: {
    flex: 1,
  },
  transactionDesc: {
    fontSize: fontSize.base,
    fontWeight: fontWeight.semibold,
    color: colors.textPrimary,
    marginBottom: 2,
  },
  transactionSub: {
    fontSize: fontSize.xs,
    color: colors.textPlaceholder,
  },
  transactionAmount: {
    fontSize: fontSize.base,
    fontWeight: fontWeight.bold,
  },
  viewAllBtn: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
  },
  viewAllText: {
    fontSize: fontSize.base,
    color: colors.primary,
    fontWeight: fontWeight.semibold,
  },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  emptyText: {
    textAlign: 'center',
    color: colors.textPlaceholder,
    fontSize: fontSize.base,
    paddingVertical: spacing.xxxl,
  },
});

// All Transactions view styles
export const allTransactionsStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bgMain,
  },
  header: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xl,
    paddingBottom: spacing.md,
  },
  title: {
    fontSize: fontSize.xxl,
    fontWeight: fontWeight.bold,
    color: colors.textPrimary,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: fontSize.sm,
    color: colors.textPlaceholder,
  },
  filters: {
    flexDirection: 'row',
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.lg,
    gap: spacing.sm,
  },
  filterBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.round,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.bgWhite,
    gap: 4,
  },
  filterBtnActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  filterText: {
    fontSize: fontSize.sm,
    color: colors.textPrimary,
    fontWeight: fontWeight.medium,
  },
  filterTextActive: {
    color: colors.textWhite,
  },
  sectionHeader: {
    paddingTop: spacing.lg,
    paddingBottom: spacing.sm,
  },
  sectionTitle: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.semibold,
    color: colors.textPlaceholder,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  list: {
    paddingHorizontal: spacing.xl,
    paddingBottom: 40,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.bgWhite,
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginBottom: spacing.sm,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
  },
  cardIcon: {
    width: 44,
    height: 44,
    borderRadius: radius.lg,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  iconRevenue: {
    backgroundColor: 'rgba(125,199,103,0.15)',
  },
  iconExpense: {
    backgroundColor: 'rgba(222,103,103,0.15)',
  },
  cardContent: {
    flex: 1,
  },
  cardDesc: {
    fontSize: fontSize.base,
    fontWeight: fontWeight.semibold,
    color: colors.textPrimary,
    marginBottom: 2,
  },
  cardSub: {
    fontSize: fontSize.xs,
    color: colors.textPlaceholder,
  },
  cardRight: {
    alignItems: 'flex-end',
  },
  cardAmount: {
    fontSize: fontSize.base,
    fontWeight: fontWeight.bold,
    marginBottom: 2,
  },
  amountRevenue: {
    color: colors.success,
  },
  amountExpense: {
    color: colors.danger,
  },
  cardPayment: {
    fontSize: fontSize.xs,
    color: colors.textPlaceholder,
  },
  emptyText: {
    textAlign: 'center',
    color: colors.textPlaceholder,
    fontSize: fontSize.base,
    paddingVertical: spacing.xxxl,
  },
});

// Transaction Modal styles
export const modalStyles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  container: {
    backgroundColor: colors.bgWhite,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: spacing.xxl,
    paddingBottom: 40,
    maxHeight: '90%',
  },
  title: {
    fontSize: fontSize.xl,
    fontWeight: fontWeight.bold,
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  formCard: {
    backgroundColor: colors.bgCard,
    borderRadius: radius.lg,
    padding: spacing.xl,
    marginBottom: spacing.xl,
  },
  label: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.medium,
    color: colors.textPrimary,
    marginBottom: 6,
    marginTop: spacing.md,
  },
  labelFirst: {
    marginTop: 0,
  },
  input: {
    backgroundColor: colors.bgWhite,
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
    backgroundColor: colors.bgMain,
    borderRadius: radius.md,
    padding: 4,
  },
  typeBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: radius.sm,
    alignItems: 'center',
  },
  typeBtnActive: {
    backgroundColor: colors.bgWhite,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  typeBtnText: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.medium,
    color: colors.textPlaceholder,
  },
  typeBtnTextActive: {
    color: colors.primary,
    fontWeight: fontWeight.semibold,
  },
  paymentRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    flexWrap: 'wrap',
  },
  paymentBtn: {
    paddingHorizontal: spacing.md,
    paddingVertical: 10,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    backgroundColor: colors.bgWhite,
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
  saveBtn: {
    backgroundColor: colors.primary,
    borderRadius: radius.round,
    paddingVertical: 16,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.sm,
  },
  saveBtnDisabled: {
    opacity: 0.5,
  },
  saveBtnText: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.semibold,
    color: colors.textWhite,
  },
  cancelBtn: {
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: spacing.md,
  },
  cancelBtnText: {
    fontSize: fontSize.base,
    fontWeight: fontWeight.medium,
    color: colors.textPlaceholder,
  },
});

// Delete Modal styles
export const deleteModalStyles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  container: {
    backgroundColor: colors.bgWhite,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: spacing.xxl,
    paddingBottom: 40,
    alignItems: 'center',
  },
  title: {
    fontSize: fontSize.xl,
    fontWeight: fontWeight.bold,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
    marginTop: spacing.md,
  },
  message: {
    fontSize: fontSize.base,
    color: colors.textPlaceholder,
    textAlign: 'center',
    marginBottom: spacing.xxl,
    lineHeight: 22,
  },
  deleteBtn: {
    backgroundColor: colors.danger,
    borderRadius: radius.round,
    paddingVertical: 16,
    alignItems: 'center',
    width: '100%',
    marginBottom: spacing.md,
  },
  deleteBtnText: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.semibold,
    color: colors.textWhite,
  },
  cancelBtn: {
    borderRadius: radius.round,
    paddingVertical: 16,
    alignItems: 'center',
    width: '100%',
    borderWidth: 1,
    borderColor: colors.border,
  },
  cancelBtnText: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.medium,
    color: colors.primary,
  },
});
