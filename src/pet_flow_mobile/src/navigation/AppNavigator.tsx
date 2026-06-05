import React from 'react';
import { ActivityIndicator, View, Text, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useSession } from '../contexts/SessionContext';
import { colors, fontSize, fontWeight } from '../theme';
import LoginScreen from '../screens/login';
import DashboardScreen from '../screens/dashboard';
import FinancialScreen from '../screens/financial';
import SchedulingScreen from '../screens/scheduling';
import DrawerContent from './DrawerContent';
import { AuthRoutes, AppRoutes } from './routes';
import EmployeesScreen from '../screens/employees';
import ServiceScreen from '../screens/service';

const Drawer = createDrawerNavigator();
const Stack = createNativeStackNavigator();

function RegisterPlaceholder() {
  return (
    <View style={placeholderStyles.container}>
      <Text style={placeholderStyles.text}>Tela de registro em construção...</Text>
    </View>
  );
}

function PagePlaceholder({ route }: { route: { params?: { title?: string } } }) {
  const title = route.params?.title || 'Em construção';

  return (
    <View style={placeholderStyles.container}>
      <Text style={placeholderStyles.text}>{title}</Text>
      <Text style={[placeholderStyles.text, { marginTop: 8 }]}>Esta página ainda não foi implementada.</Text>
    </View>
  );
}

const placeholderStyles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.bgMain },
  text: { fontSize: fontSize.lg, color: colors.textPlaceholder },
});

function AuthStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name={AuthRoutes.LOGIN} component={LoginScreen} />
      <Stack.Screen name={AuthRoutes.REGISTER} component={RegisterPlaceholder} />
    </Stack.Navigator>
  );
}

function AuthenticatedDrawer() {
  const { session } = useSession();

  return (
    <Drawer.Navigator
      drawerContent={(props) => <DrawerContent {...props} />}
      screenOptions={{
        headerStyle: { backgroundColor: colors.bgWhite },
        headerTintColor: colors.textPrimary,
        headerTitleStyle: { fontWeight: fontWeight.semibold },
        drawerType: 'front',
      }}
    >
      <Drawer.Screen
        name={AppRoutes.DASHBOARD}
        component={DashboardScreen}
        options={{ title: 'PetFlow' }}
      />

      <Drawer.Screen
        name={AppRoutes.SCHEDULING}
        component={SchedulingScreen}
        options={{ headerShown: false, title: 'Agendamentos' }}
      />

      <Drawer.Screen
        name={AppRoutes.FINANCIAL}
        component={FinancialScreen}
        options={{ title: 'Financeiro' }}
      />

      <Drawer.Screen
        name={AppRoutes.PETS}
        component={PagePlaceholder}
        initialParams={{ title: 'Pets' }}
        options={{ title: 'Pets' }}
      />

      <Drawer.Screen
        name={AppRoutes.TUTORS}
        component={PagePlaceholder}
        initialParams={{ title: 'Tutores' }}
        options={{ title: 'Tutores' }}
      />

      <Drawer.Screen
        name={AppRoutes.PRODUCTS}
        component={PagePlaceholder}
        initialParams={{ title: 'Produtos' }}
        options={{ title: 'Produtos' }}
      />

      <Drawer.Screen
        name={AppRoutes.SERVICES}
        component={ServiceScreen}
        options={{ title: 'Serviços' }}
      />

      {(
        session?.role?.toLowerCase().trim() === 'dono' ||
        session?.role?.toLowerCase().trim() === 'admin' ||
        session?.role?.toLowerCase().trim() === 'administrador'
      ) && (
        <Drawer.Screen
          name={AppRoutes.EMPLOYEES}
          component={EmployeesScreen}
          options={{ title: 'Funcionários' }}
        />
      )}
    </Drawer.Navigator>
  );
}

export default function AppNavigator() {
  const { session, loading } = useSession();

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.bgMain }}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {session ? <AuthenticatedDrawer /> : <AuthStack />}
    </NavigationContainer>
  );
}
