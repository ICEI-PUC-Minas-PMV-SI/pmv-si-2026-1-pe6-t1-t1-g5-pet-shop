import { StyleSheet } from 'react-native';
import { colors, spacing, fontSize, radius, fontWeight } from '../../theme';

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

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl,
    paddingBottom: spacing.md,
  },

  searchContainer: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    marginBottom: spacing.md,
  },

  searchInput: {
    backgroundColor: colors.bgWhite,
    borderRadius: radius.lg,
    paddingHorizontal: spacing.md,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: colors.border,
    fontSize: fontSize.base,
    color: colors.textPrimary,
  },

  addButton: {
    backgroundColor: colors.primary,
    marginHorizontal: spacing.lg,
    marginBottom: spacing.md,
    paddingVertical: 12,
    borderRadius: radius.lg,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.xs,
  },

  addButtonText: {
    color: colors.textWhite,
    fontSize: fontSize.lg,
    fontWeight: fontWeight.semibold,
  },

  list: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xxxl,
  },

  card: {
    backgroundColor: colors.bgWhite,
    borderRadius: radius.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
  },

  cardContent: {
    flex: 1,
  },

  serviceName: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.semibold,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },

  serviceDescription: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },

  serviceMetadata: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  priceAndDuration: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },

  priceContainer: {
    backgroundColor: '#E8F1FF',
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: radius.sm,
  },

  price: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.semibold,
    color: colors.primary,
  },

  durationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },

  duration: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
  },

  actions: {
    flexDirection: 'row',
    gap: spacing.sm,
  },

  editBtn: {
    width: 32,
    height: 32,
    borderRadius: radius.md,
    backgroundColor: colors.primaryBg,
    justifyContent: 'center',
    alignItems: 'center',
  },

  deleteBtn: {
    width: 32,
    height: 32,
    borderRadius: radius.md,
    backgroundColor: colors.dangerBg,
    justifyContent: 'center',
    alignItems: 'center',
  },

  emptyText: {
    textAlign: 'center',
    color: colors.textPlaceholder,
    fontSize: fontSize.base,
    paddingVertical: spacing.xxxl,
  },

  formContainer: {
    backgroundColor: colors.bgWhite,
    marginHorizontal: spacing.lg,
    padding: spacing.md,
    borderRadius: radius.lg,
    marginBottom: spacing.md,
    gap: spacing.sm,
  },

  formInput: {
    backgroundColor: colors.bgMain,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: 10,
    fontSize: fontSize.base,
    color: colors.textPrimary,
    borderWidth: 1,
    borderColor: colors.border,
  },

  formButtonsContainer: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.sm,
  },

  formButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: radius.md,
    justifyContent: 'center',
    alignItems: 'center',
  },

  formButtonSave: {
    backgroundColor: colors.primary,
  },

  formButtonCancel: {
    backgroundColor: colors.border,
  },

  formButtonText: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.semibold,
    color: colors.textWhite,
  },

  formButtonCancelText: {
    color: colors.textSecondary,
  },
});
