import React from 'react';
import { ActivityIndicator, View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { NavigationContainer, getFocusedRouteNameFromRoute } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useSession } from '../contexts/SessionContext';
import { colors, fontSize, fontWeight } from '../theme';
import LoginScreen from '../screens/login';
import FinancialScreen from '../screens/financial';
import SchedulingScreen from '../screens/scheduling';
import DrawerContent from './DrawerContent';
import { AuthRoutes, AppRoutes } from './routes';
import EmployeesScreen from '../screens/employees';
import { MaterialIcons } from '@expo/vector-icons';

const Drawer = createDrawerNavigator();
const Stack = createNativeStackNavigator();

function RegisterPlaceholder() {
  return (
    <View style={placeholderStyles.container}>
      <Text style={placeholderStyles.text}>Tela de registro em construção...</Text>
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
    </Stack.Navigator>
  );
}

function AuthenticatedDrawer() {
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
        name="Main"
        component={MainStack}
        options={({ route }) => {
          const routeName = getFocusedRouteNameFromRoute(route) ?? AppRoutes.SCHEDULING;
          // Only show drawer header (PetFlow + hamburger) on the dashboard/scheduling screen
          if (routeName === AppRoutes.SCHEDULING) {
            return {
              headerShown: true,
              headerTitle: 'PetFlow',
              headerTitleStyle: { color: colors.primary, fontWeight: fontWeight.bold, fontSize: 20 },
            };
          }
          // Hide drawer header for all inner screens (they have their own stack header with back arrow)
          return {
            headerShown: false,
          };
        }}
      />
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
