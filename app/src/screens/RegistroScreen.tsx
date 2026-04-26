import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, KeyboardAvoidingView, Platform, ScrollView, Image } from 'react-native';
import { useAuth } from '../context/AuthContext';

const RegistroScreen = ({ navigation }: any) => {
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmarPassword, setConfirmarPassword] = useState('');
  const [cargando, setCargando] = useState(false);
  const { registro } = useAuth();

  const handleRegistro = async () => {
    if (!nombre || !email || !password || !confirmarPassword) {
      Alert.alert('Error', 'Rellena todos los campos');
      return;
    }

    if (password !== confirmarPassword) {
      Alert.alert('Error', 'Las contraseñas no coinciden');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Error', 'La contraseña debe tener al menos 6 caracteres');
      return;
    }

    setCargando(true);
    try {
      await registro(nombre, email, password);
    } catch (error: any) {
      Alert.alert('Error', error.response?.data?.error || 'Error al registrarse');
    } finally {
      setCargando(false);
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.logoContainer}>
          <Image source={require('../../assets/logo.png')} style={styles.logo} resizeMode="contain" />
        </View>

        <View style={styles.formulario}>
          <Text style={styles.label}>Nombre</Text>
          <TextInput
            style={styles.input}
            placeholder="Tu nombre"
            placeholderTextColor="#666"
            value={nombre}
            onChangeText={setNombre}
          />

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
            placeholder="Mínimo 6 caracteres"
            placeholderTextColor="#666"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          <Text style={styles.label}>Confirmar contraseña</Text>
          <TextInput
            style={styles.input}
            placeholder="Repite la contraseña"
            placeholderTextColor="#666"
            value={confirmarPassword}
            onChangeText={setConfirmarPassword}
            secureTextEntry
          />

          <TouchableOpacity
            style={[styles.boton, cargando && styles.botonDesactivado]}
            onPress={handleRegistro}
            disabled={cargando}
          >
            <Text style={styles.botonTexto}>
              {cargando ? 'Registrando...' : 'Registrarse'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.enlace}>¿Ya tienes cuenta? Inicia sesión</Text>
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
    marginBottom: 20
  },
  logo: {
    width: 180,
    height: 180
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

export default RegistroScreen;