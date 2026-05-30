import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SessionProvider } from './src/contexts/SessionContext';
import AppNavigator from './src/navigation/AppNavigator';

export default function App() {
  return (
    <SessionProvider>
      <StatusBar style="dark" />
      <AppNavigator />
    </SessionProvider>
  );
}
