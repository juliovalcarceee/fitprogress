import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useAuth } from '../context/AuthContext';
import { ActivityIndicator, View } from 'react-native';

// Pantallas Auth
import LoginScreen from '../screens/LoginScreen';
import RegistroScreen from '../screens/RegistroScreen';

// Pantallas principales
import InicioScreen from '../screens/InicioScreen';
import EjerciciosScreen from '../screens/EjerciciosScreen';
import RutinasScreen from '../screens/RutinasScreen';
import ProgresoScreen from '../screens/ProgresoScreen';
import PerfilScreen from '../screens/PerfilScreen';

// Pantallas secundarias
import EntrenamientoScreen from '../screens/EntrenamientoScreen';
import CrearRutinaScreen from '../screens/CrearRutinaScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: '#E94560',
        tabBarInactiveTintColor: '#888',
        tabBarStyle: {
          backgroundColor: '#1A1A2E',
          borderTopColor: '#16213E',
          height: 60,
          paddingBottom: 8,
          paddingTop: 8
        },
        headerStyle: {
          backgroundColor: '#1A1A2E'
        },
        headerTintColor: '#fff'
      }}
    >
      <Tab.Screen
        name="Inicio"
        component={InicioScreen}
        options={{ tabBarLabel: 'Inicio', title: 'FitProgress' }}
      />
      <Tab.Screen
        name="Ejercicios"
        component={EjerciciosScreen}
        options={{ tabBarLabel: 'Ejercicios', title: 'Catálogo' }}
      />
      <Tab.Screen
        name="Rutinas"
        component={RutinasScreen}
        options={{ tabBarLabel: 'Rutinas', title: 'Mis rutinas' }}
      />
      <Tab.Screen
        name="Progreso"
        component={ProgresoScreen}
        options={{ tabBarLabel: 'Progreso', title: 'Mi progreso' }}
      />
      <Tab.Screen
        name="Perfil"
        component={PerfilScreen}
        options={{ tabBarLabel: 'Perfil', title: 'Mi perfil' }}
      />
    </Tab.Navigator>
  );
};

const AppNavigator = () => {
  const { token, cargando } = useAuth();

  if (cargando) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#0F3460' }}>
        <ActivityIndicator size="large" color="#E94560" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {token ? (
          <>
            <Stack.Screen name="Main" component={TabNavigator} />
            <Stack.Screen
              name="Entrenamiento"
              component={EntrenamientoScreen}
              options={{
                headerShown: true,
                headerStyle: { backgroundColor: '#1A1A2E' },
                headerTintColor: '#fff',
                title: 'Entrenamiento'
              }}
            />
            <Stack.Screen
              name="CrearRutina"
              component={CrearRutinaScreen}
              options={{
                headerShown: true,
                headerStyle: { backgroundColor: '#1A1A2E' },
                headerTintColor: '#fff',
                title: 'Nueva rutina'
              }}
            />
          </>
        ) : (
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Registro" component={RegistroScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;