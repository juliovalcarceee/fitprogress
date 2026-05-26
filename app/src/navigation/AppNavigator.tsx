import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
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
import HistorialScreen from '../screens/HistorialScreen';

// Pantallas secundarias
import EntrenamientoScreen from '../screens/EntrenamientoScreen';
import CrearRutinaScreen from '../screens/CrearRutinaScreen';
import DetalleSesionScreen from '../screens/DetalleSesionScreen';
import CrearEjercicioScreen from '../screens/CrearEjercicioScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap = 'home';

          if (route.name === 'Inicio') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Rutinas') {
            iconName = focused ? 'barbell' : 'barbell-outline';
          } else if (route.name === 'Ejercicios') {
            iconName = focused ? 'fitness' : 'fitness-outline';
          } else if (route.name === 'Historial') {
            iconName = focused ? 'time' : 'time-outline';
          } else if (route.name === 'Progreso') {
            iconName = focused ? 'trending-up' : 'trending-up-outline';
          } else if (route.name === 'Perfil') {
            iconName = focused ? 'person' : 'person-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#E94560',
        tabBarInactiveTintColor: '#888',
        tabBarStyle: {
          backgroundColor: '#1A1A2E',
          borderTopColor: '#16213E',
          height: 65,
          paddingBottom: 10,
          paddingTop: 8
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600'
        },
        headerStyle: {
          backgroundColor: '#1A1A2E'
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold'
        }
      })}
    >
      <Tab.Screen
        name="Inicio"
        component={InicioScreen}
        options={{ title: 'FitProgress' }}
      />
      <Tab.Screen
        name="Rutinas"
        component={RutinasScreen}
        options={{ title: 'Mis rutinas' }}
      />
      <Tab.Screen
        name="Ejercicios"
        component={EjerciciosScreen}
        options={{ title: 'Catálogo' }}
      />
      <Tab.Screen
        name="Historial"
        component={HistorialScreen}
        options={{ title: 'Historial' }}
      />
      <Tab.Screen
        name="Progreso"
        component={ProgresoScreen}
        options={{ title: 'Mi progreso' }}
      />
      <Tab.Screen
        name="Perfil"
        component={PerfilScreen}
        options={{ title: 'Mi perfil' }}
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
            <Stack.Screen name="Volver" component={TabNavigator} />
            <Stack.Screen
              name="Entrenamiento"
              component={EntrenamientoScreen}
              options={{
                headerShown: true,
                headerStyle: { backgroundColor: '#1A1A2E' },
                headerTintColor: '#fff',
                headerBackTitle: '',
                title: 'Entrenamiento'
              }}
            />
            <Stack.Screen
              name="CrearRutina"
              component={CrearRutinaScreen}
              options={({ route }: any) => ({
                headerShown: true,
                headerStyle: { backgroundColor: '#1A1A2E' },
                headerTintColor: '#fff',
                headerBackTitle: '',
                title: route.params?.rutinaId ? 'Editar rutina' : 'Nueva rutina'
              })}
            />
            <Stack.Screen
              name="DetalleSesion"
              component={DetalleSesionScreen}
              options={{
                headerShown: true,
                headerStyle: { backgroundColor: '#1A1A2E' },
                headerTintColor: '#fff',
                headerBackTitle: '',
                title: 'Detalle de sesión'
              }}
            />
            <Stack.Screen
              name="CrearEjercicio"
              component={CrearEjercicioScreen}
              options={{
                headerShown: true,
                headerStyle: { backgroundColor: '#1A1A2E' },
                headerTintColor: '#fff',
                headerBackTitle: '',
                title: 'Nuevo ejercicio'
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