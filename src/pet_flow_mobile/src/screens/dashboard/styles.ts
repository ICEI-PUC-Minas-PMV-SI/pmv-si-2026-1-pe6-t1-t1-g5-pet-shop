import { StyleSheet } from 'react-native';
import { colors, spacing, fontSize, fontWeight, radius } from '../../theme';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bgMain,
  },
  content: {
    width: '100%',
    maxWidth: 440,
    alignSelf: 'center',
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
  },
  header: {
    marginBottom: spacing.xl,
  },
  greeting: {
    fontSize: fontSize.xxl,
    fontWeight: fontWeight.bold,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    justifyContent: 'space-between',
  },
  statCard: {
    width: '48%',
    minHeight: 120,
    borderRadius: radius.lg,
    backgroundColor: colors.bgWhite,
    padding: spacing.md,
    justifyContent: 'flex-start',
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  statCardIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  statCardTop: {
    marginBottom: spacing.md,
  },
  statCardLabel: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    textTransform: 'uppercase',
    fontWeight: fontWeight.semibold,
    letterSpacing: 0.5,
    textAlign: 'left',
  },
  statCardValue: {
    fontSize: fontSize.xxl,
    fontWeight: fontWeight.bold,
    color: colors.textPrimary,
    textAlign: 'left',
    marginTop: spacing.sm,
  },
  section: {
    marginTop: spacing.xl,
  },
  sectionHeader: {
    marginBottom: spacing.sm,
  },
  sectionTitle: {
    fontSize: fontSize.xl,
    fontWeight: fontWeight.bold,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  sectionSubtitle: {
    fontSize: fontSize.sm,
    color: colors.textPlaceholder,
  },
  appointmentList: {
    gap: spacing.sm,
  },
  appointmentCard: {
    backgroundColor: colors.bgWhite,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  appointmentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  appointmentTitle: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
    color: colors.textPrimary,
  },
  appointmentTime: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
    color: '#005cab',
  },
  appointmentMeta: {
    fontSize: fontSize.md,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },
  appointmentLabelStrong: {
    fontWeight: fontWeight.bold,
    color: colors.textPrimary,
  },
  appointmentValue: {
    fontSize: fontSize.md,
    color: colors.textSecondary,
  },
  viewCompleteLink: {
    marginTop: spacing.md,
    paddingVertical: spacing.sm,
    alignItems: 'center',
  },
  viewCompleteLinkText: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.semibold,
    color: '#005cab',
  },
  emptyState: {
    padding: spacing.xl,
    backgroundColor: colors.bgWhite,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
  },
  emptyStateText: {
    color: colors.textPlaceholder,
    textAlign: 'center',
    marginTop: spacing.sm,
    lineHeight: 20,
  },
  loadingContainer: {
    marginTop: spacing.xl,
  },
});
