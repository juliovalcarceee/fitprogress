import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useAuth } from '../context/AuthContext';

const LoginScreen = ({ navigation }: any) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [cargando, setCargando] = useState(false);
  const { login } = useAuth();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Rellena todos los campos');
      return;
    }

    setCargando(true);
    try {
      await login(email, password);
    } catch (error: any) {
      Alert.alert('Error', error.response?.data?.error || 'Error al iniciar sesión');
    } finally {
      setCargando(false);
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.logoContainer}>
          <Text style={styles.logo}>💪</Text>
          <Text style={styles.titulo}>FitProgress</Text>
          <Text style={styles.subtitulo}>Tu entrenamiento. Tu progreso.</Text>
        </View>

        <View style={styles.formulario}>
          <Text style={styles.label}>Correo electrónico</Text>
          <TextInput
            style={styles.input}
            placeholder="tu@email.com"
            placeholderTextColor="#666"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <Text style={styles.label}>Contraseña</Text>
          <TextInput
            style={styles.input}
            placeholder="Tu contraseña"
            placeholderTextColor="#666"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          <TouchableOpacity
            style={[styles.boton, cargando && styles.botonDesactivado]}
            onPress={handleLogin}
            disabled={cargando}
          >
            <Text style={styles.botonTexto}>
              {cargando ? 'Iniciando sesión...' : 'Iniciar sesión'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate('Registro')}>
            <Text style={styles.enlace}>¿No tienes cuenta? Regístrate</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F3460'
  },
  scroll: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 24
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 40
  },
  logo: {
    fontSize: 64,
    marginBottom: 12
  },
  titulo: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#E94560',
    marginBottom: 8
  },
  subtitulo: {
    fontSize: 16,
    color: '#ccc'
  },
  formulario: {
    backgroundColor: '#1A1A2E',
    borderRadius: 16,
    padding: 24
  },
  label: {
    color: '#fff',
    fontSize: 14,
    marginBottom: 6,
    marginTop: 12
  },
  input: {
    backgroundColor: '#16213E',
    borderRadius: 10,
    padding: 14,
    color: '#fff',
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#2a2a4a'
  },
  boton: {
    backgroundColor: '#E94560',
    borderRadius: 10,
    padding: 16,
    alignItems: 'center',
    marginTop: 24
  },
  botonDesactivado: {
    opacity: 0.6
  },
  botonTexto: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold'
  },
  enlace: {
    color: '#E94560',
    textAlign: 'center',
    marginTop: 20,
    fontSize: 15
  }
});

export default LoginScreen;