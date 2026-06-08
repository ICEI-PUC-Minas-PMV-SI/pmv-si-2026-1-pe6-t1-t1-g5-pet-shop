import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { DrawerContentScrollView, type DrawerContentComponentProps } from '@react-navigation/drawer';
import { colors, spacing, fontSize, fontWeight, radius } from '../theme';
import { useSession } from '../contexts/SessionContext';
import { authStorage } from '../services';
import { MaterialIcons } from '@expo/vector-icons';
import { AppRoutes } from './routes';

const allMenuItems = [
  { label: 'Dashboard', route: AppRoutes.DASHBOARD, icon: 'dashboard' },
  { label: 'Agendamentos', route: AppRoutes.SCHEDULING, icon: 'calendar-today' },
  { label: 'Pets', route: AppRoutes.PETS, icon: 'pets' },
  { label: 'Tutores', route: AppRoutes.TUTORS, icon: 'person' },
  { label: 'Serviços', route: AppRoutes.SERVICES, icon: 'content-cut' },
  { label: 'Produtos', route: AppRoutes.PRODUCTS, icon: 'inventory-2' },
  { label: 'Financeiro', route: AppRoutes.FINANCIAL, icon: 'attach-money' },
  { label: 'Funcionários', route: AppRoutes.EMPLOYEES, icon: 'groups' },
];

export default function DrawerContent(props: DrawerContentComponentProps) {
  const { session, setSession } = useSession();

  const handleLogout = async () => {
    await authStorage.clear();
    setSession(null);
  };
  
  const role = session?.role
    ?.toLowerCase()
    .trim();

  const canAccessEmployees =
    role === 'dono' ||
    role === 'admin' ||
    role === 'administrador';

  const menuItems = allMenuItems.filter((item) => {
    if (
      item.route === AppRoutes.EMPLOYEES &&
      !canAccessEmployees
    ) {
      return false;
    }

    return true;
  });
    return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.logoRow}>
          <MaterialIcons name="pets" size={24} color={colors.primary} />
          <Text style={styles.logo}> PetFlow</Text>
        </View>
        <Text style={styles.userName}>{session?.name || 'Usuário'}</Text>
        <Text style={styles.userRole}>{session?.role || 'Administrador'}</Text>
      </View>

      <DrawerContentScrollView {...props} contentContainerStyle={styles.scrollContent}>
        {menuItems.map((item) => {
          return (
            <TouchableOpacity
              key={item.route}
              style={[styles.menuItem]}
              onPress={() => {
                props.navigation.closeDrawer();
                props.navigation.navigate(item.route as any);
              }}
            >
              <MaterialIcons
                name={item.icon as any}
                size={20}
                color={colors.textPrimary}
                style={styles.menuIcon}
              />
              <Text style={styles.menuLabel}>
                {item.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </DrawerContentScrollView>

      <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
        <MaterialIcons name="logout" size={20} color={colors.danger} style={styles.logoutIcon} />
        <Text style={styles.logoutText}>Sair</Text>
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
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  logo: {
    fontSize: fontSize.xl,
    fontWeight: fontWeight.bold,
    color: colors.primary,
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
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.xl,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    marginBottom: 30,
  },
  logoutIcon: {
    marginRight: spacing.sm,
  },
  logoutText: {
    fontSize: fontSize.base,
    color: colors.danger,
    fontWeight: fontWeight.medium,
  },
});
