import React from 'react';
import { ActivityIndicator, View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { NavigationContainer, getFocusedRouteNameFromRoute } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { MaterialIcons } from '@expo/vector-icons';
import { useSession } from '../contexts/SessionContext';
import { colors, fontSize, fontWeight } from '../theme';
import LoginScreen from '../screens/login';
import RegisterScreen from '../screens/register';
import DashboardScreen from '../screens/dashboard';
import FinancialScreen from '../screens/financial';
import SchedulingScreen from '../screens/scheduling';
import DrawerContent from './DrawerContent';
import { AuthRoutes, AppRoutes } from './routes';
import EmployeesScreen from '../screens/employees';
import ServiceScreen from '../screens/service';
import ProductScreen from '../screens/product';
import PetsScreen from '../screens/pets/pets';
import VaccinesScreen from '../screens/pets/vaccines';
import TutorsScreen from '../screens/tutor/tutor';

const Drawer = createDrawerNavigator();
const Stack = createNativeStackNavigator();

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
      <Stack.Screen name={AuthRoutes.REGISTER} component={RegisterScreen} />
    </Stack.Navigator>
  );
}

function PetsStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="PetsList" component={PetsScreen} />
      <Stack.Screen name={AppRoutes.VACCINES} component={VaccinesScreen} />
    </Stack.Navigator>
  );
}

function AuthenticatedDrawer() {
  const { session } = useSession();

  function MainStack() {
    return (
      <Stack.Navigator
        screenOptions={{
          headerShadowVisible: false,
          headerTintColor: colors.textPrimary,
          headerTitleStyle: { fontWeight: fontWeight.bold, fontSize: 20, color: colors.textPrimary },
          headerBackTitle: ' ',
          headerTransparent: true,
          headerBlurEffect: undefined,
        }}
      >
        <Stack.Screen
          name={AppRoutes.SCHEDULING}
          component={SchedulingScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name={AppRoutes.FINANCIAL}
          component={FinancialScreen}
          options={({ navigation }) => ({
            headerTitle: 'Financeiro',
            headerBackVisible: false,
            headerTransparent: false,
            headerStyle: { backgroundColor: colors.bgMain },
            headerLeft: () => (
              <TouchableOpacity onPress={() => navigation.goBack()} hitSlop={8}>
                <MaterialIcons name="chevron-left" size={28} color={colors.textPrimary} />
              </TouchableOpacity>
            ),
          })}
        />
        <Stack.Screen
          name={AppRoutes.EMPLOYEES}
          component={EmployeesScreen}
          options={({ navigation }) => ({
            headerTitle: 'Funcionários',
            headerBackVisible: false,
            headerTransparent: false,
            headerStyle: { backgroundColor: colors.bgMain },
            headerLeft: () => (
              <TouchableOpacity onPress={() => navigation.goBack()} hitSlop={8}>
                <MaterialIcons name="chevron-left" size={28} color={colors.textPrimary} />
              </TouchableOpacity>
            ),
          })}
        />
        
        {/* CORREÇÃO AQUI: Tutores dentro da MainStack */}
        <Stack.Screen
          name={AppRoutes.TUTORS}
          component={TutorsScreen}
          options={{ headerShown: false }}
        />

        {/* CORREÇÃO AQUI: Pets também movido para dentro da MainStack! */}
        <Stack.Screen
          name={AppRoutes.PETS}
          component={PetsStack}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    );
  }

  return (
    <Drawer.Navigator drawerContent={(props) => <DrawerContent {...props} />}>
      
      {/* Esta é a gaveta 'Main' principal */}
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
        component={ProductScreen}
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