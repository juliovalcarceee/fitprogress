/**
 * Pantalla de perfil del usuario
 * Permite editar datos personales, seleccionar foto y cambiar tema
 */

import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Alert, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useAuth } from '../context/AuthContext';
import { useTema } from '../context/TemaContext';

const PerfilScreen = () => {
  const { usuario, actualizarUsuario, logout } = useAuth();
  const { oscuro, cambiarTema } = useTema();
  const [editando, setEditando] = useState(false);
  const [nombre, setNombre] = useState(usuario?.nombre || '');
  const [edad, setEdad] = useState(usuario?.edad?.toString() || '');
  const [alturaCm, setAlturaCm] = useState(usuario?.alturaCm?.toString() || '');
  const [sexo, setSexo] = useState(usuario?.sexo || '');
  const [objetivo, setObjetivo] = useState(usuario?.objetivo || '');
  const [foto, setFoto] = useState(usuario?.fotoUrl || '');
  const [cargando, setCargando] = useState(false);

  const seleccionarFoto = async () => {
    const permisos = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permisos.granted) {
      Alert.alert('Permiso denegado', 'Necesitamos acceso a tu galería para cambiar la foto');
      return;
    }

    const resultado = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8
    });

    if (!resultado.canceled) {
      setFoto(resultado.assets[0].uri);
    }
  };

  const handleGuardar = async () => {
    setCargando(true);
    try {
      await actualizarUsuario({
        nombre,
        edad: edad ? parseInt(edad) : undefined,
        alturaCm: alturaCm ? parseFloat(alturaCm) : undefined,
        sexo: sexo || undefined,
        objetivo: objetivo || undefined
      });
      setEditando(false);
      Alert.alert('Éxito', 'Perfil actualizado correctamente');
    } catch (error: any) {
      Alert.alert('Error', error.response?.data?.error || 'Error al actualizar perfil');
    } finally {
      setCargando(false);
    }
  };

  const handleLogout = () => {
    Alert.alert(
      'Cerrar sesión',
      '¿Estás seguro de que quieres cerrar sesión?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Cerrar sesión', style: 'destructive', onPress: logout }
      ]
    );
  };

  const opcionesSexo = ['masculino', 'femenino', 'otro'];
  const opcionesObjetivo = [
    { valor: 'ganancia', texto: 'Ganancia muscular', icono: 'trending-up' },
    { valor: 'perdida', texto: 'Pérdida de grasa', icono: 'trending-down' },
    { valor: 'mantenimiento', texto: 'Mantenimiento', icono: 'remove' }
  ];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.avatarContainer}>
        <TouchableOpacity onPress={seleccionarFoto}>
          {foto ? (
            <Image source={{ uri: foto }} style={styles.avatarImagen} />
          ) : (
            <View style={styles.avatar}>
              <Text style={styles.avatarTexto}>
                {usuario?.nombre?.charAt(0).toUpperCase() || '?'}
              </Text>
            </View>
          )}
          <View style={styles.avatarEditar}>
            <Ionicons name="camera" size={16} color="#fff" />
          </View>
        </TouchableOpacity>
        <Text style={styles.nombreGrande}>{usuario?.nombre}</Text>
        <Text style={styles.email}>{usuario?.email}</Text>
        {usuario?.objetivo && (
          <View style={styles.objetivoBadge}>
            <Ionicons
              name={usuario.objetivo === 'ganancia' ? 'trending-up' : usuario.objetivo === 'perdida' ? 'trending-down' : 'remove'}
              size={14}
              color="#E94560"
            />
            <Text style={styles.objetivoTexto}>
              {opcionesObjetivo.find(o => o.valor === usuario.objetivo)?.texto || usuario.objetivo}
            </Text>
          </View>
        )}
      </View>

      <View style={styles.seccion}>
        <View style={styles.seccionCabecera}>
          <Text style={styles.seccionTitulo}>Datos personales</Text>
          <TouchableOpacity onPress={() => setEditando(!editando)}>
            <Text style={styles.botonEditar}>{editando ? 'Cancelar' : 'Editar'}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.campo}>
          <View style={styles.campoIcono}>
            <Ionicons name="person-outline" size={18} color="#888" />
            <Text style={styles.campoLabel}>Nombre</Text>
          </View>
          {editando ? (
            <TextInput style={styles.input} value={nombre} onChangeText={setNombre} placeholder="Tu nombre" placeholderTextColor="#666" />
          ) : (
            <Text style={styles.campoValor}>{usuario?.nombre || 'Sin definir'}</Text>
          )}
        </View>

        <View style={styles.campo}>
          <View style={styles.campoIcono}>
            <Ionicons name="calendar-outline" size={18} color="#888" />
            <Text style={styles.campoLabel}>Edad</Text>
          </View>
          {editando ? (
            <TextInput style={styles.input} value={edad} onChangeText={setEdad} placeholder="Tu edad" placeholderTextColor="#666" keyboardType="number-pad" />
          ) : (
            <Text style={styles.campoValor}>{usuario?.edad ? `${usuario.edad} años` : 'Sin definir'}</Text>
          )}
        </View>

        <View style={styles.campo}>
          <View style={styles.campoIcono}>
            <Ionicons name="resize-outline" size={18} color="#888" />
            <Text style={styles.campoLabel}>Altura</Text>
          </View>
          {editando ? (
            <TextInput style={styles.input} value={alturaCm} onChangeText={setAlturaCm} placeholder="Altura en cm" placeholderTextColor="#666" keyboardType="decimal-pad" />
          ) : (
            <Text style={styles.campoValor}>{usuario?.alturaCm ? `${usuario.alturaCm} cm` : 'Sin definir'}</Text>
          )}
        </View>

        <View style={styles.campo}>
          <View style={styles.campoIcono}>
            <Ionicons name="male-female-outline" size={18} color="#888" />
            <Text style={styles.campoLabel}>Sexo</Text>
          </View>
          {editando ? (
            <View style={styles.opcionesContainer}>
              {opcionesSexo.map(opcion => (
                <TouchableOpacity
                  key={opcion}
                  style={[styles.opcion, sexo === opcion && styles.opcionActiva]}
                  onPress={() => setSexo(opcion)}
                >
                  <Text style={[styles.opcionTexto, sexo === opcion && styles.opcionTextoActivo]}>
                    {opcion.charAt(0).toUpperCase() + opcion.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          ) : (
            <Text style={styles.campoValor}>
              {usuario?.sexo ? usuario.sexo.charAt(0).toUpperCase() + usuario.sexo.slice(1) : 'Sin definir'}
            </Text>
          )}
        </View>

        <View style={styles.campo}>
          <View style={styles.campoIcono}>
            <Ionicons name="flag-outline" size={18} color="#888" />
            <Text style={styles.campoLabel}>Objetivo</Text>
          </View>
          {editando ? (
            <View style={styles.opcionesContainer}>
              {opcionesObjetivo.map(opcion => (
                <TouchableOpacity
                  key={opcion.valor}
                  style={[styles.opcion, objetivo === opcion.valor && styles.opcionActiva]}
                  onPress={() => setObjetivo(opcion.valor)}
                >
                  <Ionicons name={opcion.icono as any} size={14} color={objetivo === opcion.valor ? '#fff' : '#ccc'} />
                  <Text style={[styles.opcionTexto, objetivo === opcion.valor && styles.opcionTextoActivo]}>
                    {opcion.texto}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          ) : (
            <Text style={styles.campoValor}>
              {usuario?.objetivo
                ? opcionesObjetivo.find(o => o.valor === usuario.objetivo)?.texto || usuario.objetivo
                : 'Sin definir'}
            </Text>
          )}
        </View>

        {editando && (
          <TouchableOpacity
            style={[styles.botonGuardar, cargando && { opacity: 0.6 }]}
            onPress={handleGuardar}
            disabled={cargando}
          >
            <Text style={styles.botonGuardarTexto}>
              {cargando ? 'Guardando...' : 'Guardar cambios'}
            </Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.seccion}>
        <Text style={styles.seccionTitulo}>Ajustes</Text>
        <TouchableOpacity style={styles.ajusteItem} onPress={cambiarTema}>
          <View style={styles.ajusteIcono}>
            <Ionicons name={oscuro ? 'moon' : 'sunny'} size={18} color="#E94560" />
            <Text style={styles.ajusteTexto}>Modo {oscuro ? 'oscuro' : 'claro'}</Text>
          </View>
          <View style={[styles.toggle, oscuro && styles.toggleActivo]}>
            <View style={[styles.toggleCirculo, oscuro && styles.toggleCirculoActivo]} />
          </View>
        </TouchableOpacity>
        <View style={styles.infoCuenta}>
          <Ionicons name="time-outline" size={18} color="#888" />
          <Text style={styles.infoCuentaTexto}>
            Miembro desde {usuario?.createdAt ? new Date(usuario.createdAt).toLocaleDateString('es-ES', {
              month: 'long', year: 'numeric'
            }) : 'fecha desconocida'}
          </Text>
        </View>
      </View>

      <TouchableOpacity style={styles.botonLogout} onPress={handleLogout}>
        <Ionicons name="log-out-outline" size={20} color="#E94560" />
        <Text style={styles.botonLogoutTexto}>Cerrar sesión</Text>
      </TouchableOpacity>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F3460' },
  avatarContainer: { alignItems: 'center', padding: 24, paddingTop: 16 },
  avatar: {
    width: 90, height: 90, borderRadius: 45,
    backgroundColor: '#E94560', justifyContent: 'center', alignItems: 'center'
  },
  avatarImagen: { width: 90, height: 90, borderRadius: 45 },
  avatarTexto: { fontSize: 36, fontWeight: 'bold', color: '#fff' },
  avatarEditar: {
    position: 'absolute', bottom: 0, right: 0,
    backgroundColor: '#1A1A2E', borderRadius: 14, width: 28, height: 28,
    justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: '#0F3460'
  },
  nombreGrande: { fontSize: 24, fontWeight: 'bold', color: '#fff', marginTop: 12, marginBottom: 4 },
  email: { fontSize: 14, color: '#888' },
  objetivoBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: '#1A1A2E', borderRadius: 12, paddingHorizontal: 12, paddingVertical: 6, marginTop: 10
  },
  objetivoTexto: { color: '#E94560', fontSize: 13, fontWeight: '600' },
  seccion: { backgroundColor: '#1A1A2E', margin: 16, marginTop: 0, borderRadius: 16, padding: 20 },
  seccionCabecera: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  seccionTitulo: { fontSize: 18, fontWeight: 'bold', color: '#fff' },
  botonEditar: { color: '#E94560', fontSize: 14, fontWeight: '600' },
  campo: { marginBottom: 16 },
  campoIcono: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 6 },
  campoLabel: { fontSize: 13, color: '#888' },
  campoValor: { fontSize: 16, color: '#fff', paddingLeft: 26 },
  input: {
    backgroundColor: '#16213E', borderRadius: 8, padding: 12, color: '#fff',
    fontSize: 15, borderWidth: 1, borderColor: '#2a2a4a', marginLeft: 26
  },
  opcionesContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginLeft: 26 },
  opcion: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: '#16213E', borderRadius: 8, paddingHorizontal: 14, paddingVertical: 8,
    borderWidth: 1, borderColor: '#2a2a4a'
  },
  opcionActiva: { backgroundColor: '#E94560', borderColor: '#E94560' },
  opcionTexto: { color: '#ccc', fontSize: 13 },
  opcionTextoActivo: { color: '#fff', fontWeight: 'bold' },
  botonGuardar: {
    backgroundColor: '#E94560', borderRadius: 10, padding: 14, alignItems: 'center', marginTop: 8
  },
  botonGuardarTexto: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  infoCuenta: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 8 },
  infoCuentaTexto: { color: '#888', fontSize: 14 },
  botonLogout: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    backgroundColor: '#3a1520', margin: 16, marginTop: 0, borderRadius: 12, padding: 16
  },
  botonLogoutTexto: { color: '#E94560', fontWeight: 'bold', fontSize: 16 },
  ajusteItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12, marginBottom: 8 },
  ajusteIcono: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  ajusteTexto: { color: '#fff', fontSize: 15 },
  toggle: { width: 50, height: 28, borderRadius: 14, backgroundColor: '#16213E', justifyContent: 'center', padding: 3 },
  toggleActivo: { backgroundColor: '#E94560' },
  toggleCirculo: { width: 22, height: 22, borderRadius: 11, backgroundColor: '#888' },
  toggleCirculoActivo: { backgroundColor: '#fff', alignSelf: 'flex-end' }
});

export default PerfilScreen;