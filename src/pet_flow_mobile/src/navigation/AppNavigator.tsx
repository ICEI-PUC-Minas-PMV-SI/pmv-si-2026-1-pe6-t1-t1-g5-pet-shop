import React from 'react';
import { ActivityIndicator, View, StyleSheet, TouchableOpacity } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
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
const RootStack = createNativeStackNavigator();

function AuthStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name={AuthRoutes.LOGIN} component={LoginScreen} />
      <Stack.Screen name={AuthRoutes.REGISTER} component={RegisterScreen} />
    </Stack.Navigator>
  );
}

function DashboardWithDrawer() {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <DrawerContent {...props} />}
      screenOptions={{
        headerStyle: { backgroundColor: colors.bgWhite },
        headerTintColor: colors.textPrimary,
        headerTitleStyle: { fontWeight: fontWeight.bold, fontSize: 20, color: colors.primary },
        drawerType: 'front',
      }}
    >
      <Drawer.Screen
        name="DashboardDrawer"
        component={DashboardScreen}
        options={({ navigation }) => ({
          headerTitle: 'PetFlow',
          headerTitleStyle: { color: colors.primary, fontWeight: fontWeight.bold, fontSize: 20 },
          headerLeft: () => (
            <TouchableOpacity onPress={() => navigation.openDrawer()} style={{ marginLeft: 8 }}>
              <MaterialIcons name="menu" size={26} color={colors.textPrimary} />
            </TouchableOpacity>
          ),
        })}
      />
    </Drawer.Navigator>
  );
}

function backButton(navigation: any) {
  return (
    <TouchableOpacity onPress={() => navigation.navigate(AppRoutes.DASHBOARD)} hitSlop={8}>
      <MaterialIcons name="chevron-left" size={28} color={colors.textPrimary} />
    </TouchableOpacity>
  );
}

function AuthenticatedStack() {
  return (
    <RootStack.Navigator
      screenOptions={{
        headerShadowVisible: false,
        headerStyle: { backgroundColor: colors.bgWhite },
        headerTintColor: colors.textPrimary,
        headerTitleStyle: { fontWeight: fontWeight.bold, fontSize: 18, color: colors.textPrimary },
        headerBackVisible: false,
      }}
    >
      <RootStack.Screen
        name={AppRoutes.DASHBOARD}
        component={DashboardWithDrawer}
        options={{ headerShown: false }}
      />
      <RootStack.Screen
        name={AppRoutes.SCHEDULING}
        component={SchedulingScreen}
        options={{ headerShown: false }}
      />
      <RootStack.Screen
        name={AppRoutes.FINANCIAL}
        component={FinancialScreen}
        options={({ navigation }) => ({
          headerTitle: 'Financeiro',
          headerLeft: () => backButton(navigation),
        })}
      />
      <RootStack.Screen
        name={AppRoutes.EMPLOYEES}
        component={EmployeesScreen}
        options={({ navigation }) => ({
          headerTitle: 'Funcionários',
          headerLeft: () => backButton(navigation),
        })}
      />
      <RootStack.Screen
        name={AppRoutes.SERVICES}
        component={ServiceScreen}
        options={({ navigation }) => ({
          headerTitle: 'Serviços',
          headerLeft: () => backButton(navigation),
        })}
      />
      <RootStack.Screen
        name={AppRoutes.PRODUCTS}
        component={ProductScreen}
        options={({ navigation }) => ({
          headerTitle: 'Produtos',
          headerLeft: () => backButton(navigation),
        })}
      />
      <RootStack.Screen
        name={AppRoutes.PETS}
        component={PetsScreen}
        options={{ headerShown: false }}
      />
      <RootStack.Screen
        name={AppRoutes.VACCINES}
        component={VaccinesScreen}
        options={{ headerShown: false }}
      />
      <RootStack.Screen
        name={AppRoutes.TUTORS}
        component={TutorsScreen}
        options={{ headerShown: false }}
      />
    </RootStack.Navigator>
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
      {session ? <AuthenticatedStack /> : <AuthStack />}
    </NavigationContainer>
  );
}
