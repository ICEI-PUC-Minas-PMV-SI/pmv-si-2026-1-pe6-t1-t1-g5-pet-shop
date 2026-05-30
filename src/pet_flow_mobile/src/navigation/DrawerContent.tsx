import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { DrawerContentScrollView, type DrawerContentComponentProps } from '@react-navigation/drawer';
import { colors, spacing, fontSize, fontWeight, radius } from '../theme';
import { useSession } from '../contexts/SessionContext';
import { authStorage } from '../services';
import { AppRoutes } from './routes';

const menuItems = [
  { label: 'Dashboard', route: AppRoutes.DASHBOARD, icon: '📊' },
  { label: 'Agendamentos', route: AppRoutes.SCHEDULING, icon: '📅' },
  { label: 'Pets', route: AppRoutes.PETS, icon: '🐾' },
  { label: 'Tutores', route: AppRoutes.TUTORS, icon: '👤' },
  { label: 'Serviços', route: AppRoutes.SERVICES, icon: '✂️' },
  { label: 'Produtos', route: AppRoutes.PRODUCTS, icon: '📦' },
  { label: 'Financeiro', route: AppRoutes.FINANCIAL, icon: '💰' },
  { label: 'Funcionários', route: AppRoutes.EMPLOYEES, icon: '👥' },
];

export default function DrawerContent(props: DrawerContentComponentProps) {
  const { session, setSession } = useSession();
  const currentRoute = props.state.routes[props.state.index]?.name;

  const handleLogout = async () => {
    await authStorage.clear();
    setSession(null);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.logo}>🐾 PetFlow</Text>
        <Text style={styles.userName}>{session?.name || 'Usuário'}</Text>
        <Text style={styles.userRole}>{session?.role || 'Administrador'}</Text>
      </View>

      <DrawerContentScrollView {...props} contentContainerStyle={styles.scrollContent}>
        {menuItems.map((item) => {
          const isActive = currentRoute === item.route;
          return (
            <TouchableOpacity
              key={item.route}
              style={[styles.menuItem, isActive && styles.menuItemActive]}
              onPress={() => props.navigation.navigate(item.route)}
            >
              <Text style={styles.menuIcon}>{item.icon}</Text>
              <Text style={[styles.menuLabel, isActive && styles.menuLabelActive]}>
                {item.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </DrawerContentScrollView>

      <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
        <Text style={styles.logoutText}>🚪 Sair</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bgWhite,
  },
  header: {
    paddingTop: 60,
    paddingBottom: spacing.xl,
    paddingHorizontal: spacing.xl,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  logo: {
    fontSize: fontSize.xl,
    fontWeight: fontWeight.bold,
    color: colors.primary,
    marginBottom: spacing.md,
  },
  userName: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.semibold,
    color: colors.textPrimary,
  },
  userRole: {
    fontSize: fontSize.xs,
    color: colors.textPlaceholder,
    marginTop: 2,
  },
  scrollContent: {
    paddingTop: spacing.md,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    marginHorizontal: spacing.sm,
    borderRadius: radius.lg,
  },
  menuItemActive: {
    backgroundColor: colors.primaryBg,
  },
  menuIcon: {
    fontSize: 18,
    marginRight: spacing.md,
  },
  menuLabel: {
    fontSize: fontSize.base,
    color: colors.textPrimary,
    fontWeight: fontWeight.medium,
  },
  menuLabelActive: {
    color: colors.primary,
    fontWeight: fontWeight.semibold,
  },
  logoutBtn: {
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.xl,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    marginBottom: 30,
  },
  logoutText: {
    fontSize: fontSize.base,
    color: colors.danger,
    fontWeight: fontWeight.medium,
  },
});
