import React, { useState } from 'react';
import { StatusBar } from 'react-native';
import { AuthProvider } from './src/context/AuthContext';
import { TemaProvider } from './src/context/TemaContext';
import AppNavigator from './src/navigation/AppNavigator';
import SplashScreen from './src/screens/SplashScreen';

export default function App() {
  const [mostrarSplash, setMostrarSplash] = useState(true);

  if (mostrarSplash) {
    return (
      <>
        <StatusBar barStyle="light-content" backgroundColor="#0F3460" />
        <SplashScreen onFinish={() => setMostrarSplash(false)} />
      </>
    );
  }

  return (
    <TemaProvider>
      <AuthProvider>
        <StatusBar barStyle="light-content" backgroundColor="#0F3460" />
        <AppNavigator />
      </AuthProvider>
    </TemaProvider>
  );
}