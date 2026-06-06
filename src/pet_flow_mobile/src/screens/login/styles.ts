import { StyleSheet } from 'react-native';
import { colors, spacing, fontSize, fontWeight, radius } from '../../theme';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EDF4FA',
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: spacing.xxl,
    paddingVertical: 40,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  logoIcon: {
    width: 60,
    height: 60,
    marginBottom: spacing.sm,
  },
  logoText: {
    fontSize: fontSize.xl,
    fontWeight: fontWeight.bold,
    color: colors.primary,
  },
  logoTextFlow: {
    color: colors.primary,
    fontWeight: fontWeight.regular,
  },
  formContainer: {
    width: '100%',
  },
  title: {
    fontSize: 26,
    fontWeight: fontWeight.bold,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: fontSize.md,
    color: colors.textPlaceholder,
    marginBottom: 32,
    textAlign: 'center',
  },
  label: {
    fontSize: fontSize.base,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
    fontWeight: fontWeight.medium,
  },
  input: {
    backgroundColor: colors.bgWhite,
    borderRadius: radius.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: 14,
    fontSize: fontSize.base,
    color: colors.textPrimary,
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  passwordWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.bgWhite,
    borderRadius: radius.md,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  passwordInput: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    paddingVertical: 14,
    fontSize: fontSize.base,
    color: colors.textPrimary,
  },
  eyeBtn: {
    paddingHorizontal: 14,
    paddingVertical: 14,
  },
  rememberRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 28,
  },
  checkbox: {
    width: 18,
    height: 18,
    borderRadius: 3,
    borderWidth: 1.5,
    borderColor: colors.border,
    marginRight: spacing.sm,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  rememberText: {
    fontSize: fontSize.sm,
    color: colors.textPrimary,
  },
  error: {
    color: colors.danger,
    backgroundColor: colors.dangerBg,
    padding: spacing.md,
    borderRadius: radius.sm,
    fontSize: fontSize.sm,
    marginBottom: spacing.lg,
    fontWeight: fontWeight.medium,
    overflow: 'hidden',
  },
  button: {
    backgroundColor: colors.primary,
    borderRadius: radius.round,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: spacing.sm,
    elevation: 2,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    color: colors.textWhite,
    fontSize: fontSize.lg,
    fontWeight: fontWeight.semibold,
  },
  registerLink: {
    marginTop: spacing.xxl,
    alignItems: 'center',
  },
  registerText: {
    fontSize: fontSize.sm,
    color: colors.textPlaceholder,
  },
  registerBold: {
    color: colors.primary,
    fontWeight: fontWeight.semibold,
  },
});
