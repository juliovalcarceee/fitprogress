import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useAuth } from '../context/AuthContext';

const PerfilScreen = () => {
  const { usuario, actualizarUsuario, logout } = useAuth();
  const [editando, setEditando] = useState(false);
  const [nombre, setNombre] = useState(usuario?.nombre || '');
  const [edad, setEdad] = useState(usuario?.edad?.toString() || '');
  const [alturaCm, setAlturaCm] = useState(usuario?.alturaCm?.toString() || '');
  const [sexo, setSexo] = useState(usuario?.sexo || '');
  const [objetivo, setObjetivo] = useState(usuario?.objetivo || '');
  const [cargando, setCargando] = useState(false);

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
    { valor: 'ganancia', texto: 'Ganancia muscular' },
    { valor: 'perdida', texto: 'Pérdida de grasa' },
    { valor: 'mantenimiento', texto: 'Mantenimiento' }
  ];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.avatarContainer}>
        <View style={styles.avatar}>
          <Text style={styles.avatarTexto}>
            {usuario?.nombre?.charAt(0).toUpperCase() || '?'}
          </Text>
        </View>
        <Text style={styles.nombreGrande}>{usuario?.nombre}</Text>
        <Text style={styles.email}>{usuario?.email}</Text>
      </View>

      <View style={styles.seccion}>
        <View style={styles.seccionCabecera}>
          <Text style={styles.seccionTitulo}>Datos personales</Text>
          <TouchableOpacity onPress={() => setEditando(!editando)}>
            <Text style={styles.botonEditar}>{editando ? 'Cancelar' : 'Editar'}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.campo}>
          <Text style={styles.campoLabel}>Nombre</Text>
          {editando ? (
            <TextInput
              style={styles.input}
              value={nombre}
              onChangeText={setNombre}
              placeholder="Tu nombre"
              placeholderTextColor="#666"
            />
          ) : (
            <Text style={styles.campoValor}>{usuario?.nombre || 'Sin definir'}</Text>
          )}
        </View>

        <View style={styles.campo}>
          <Text style={styles.campoLabel}>Edad</Text>
          {editando ? (
            <TextInput
              style={styles.input}
              value={edad}
              onChangeText={setEdad}
              placeholder="Tu edad"
              placeholderTextColor="#666"
              keyboardType="number-pad"
            />
          ) : (
            <Text style={styles.campoValor}>{usuario?.edad ? `${usuario.edad} años` : 'Sin definir'}</Text>
          )}
        </View>

        <View style={styles.campo}>
          <Text style={styles.campoLabel}>Altura</Text>
          {editando ? (
            <TextInput
              style={styles.input}
              value={alturaCm}
              onChangeText={setAlturaCm}
              placeholder="Altura en cm"
              placeholderTextColor="#666"
              keyboardType="decimal-pad"
            />
          ) : (
            <Text style={styles.campoValor}>{usuario?.alturaCm ? `${usuario.alturaCm} cm` : 'Sin definir'}</Text>
          )}
        </View>

        <View style={styles.campo}>
          <Text style={styles.campoLabel}>Sexo</Text>
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
          <Text style={styles.campoLabel}>Objetivo</Text>
          {editando ? (
            <View style={styles.opcionesContainer}>
              {opcionesObjetivo.map(opcion => (
                <TouchableOpacity
                  key={opcion.valor}
                  style={[styles.opcion, objetivo === opcion.valor && styles.opcionActiva]}
                  onPress={() => setObjetivo(opcion.valor)}
                >
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
        <Text style={styles.seccionTitulo}>Cuenta</Text>
        <Text style={styles.infoCuenta}>
          Miembro desde {usuario?.createdAt ? new Date(usuario.createdAt).toLocaleDateString('es-ES', {
            month: 'long', year: 'numeric'
          }) : 'fecha desconocida'}
        </Text>
      </View>

      <TouchableOpacity style={styles.botonLogout} onPress={handleLogout}>
        <Text style={styles.botonLogoutTexto}>Cerrar sesión</Text>
      </TouchableOpacity>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F3460'
  },
  avatarContainer: {
    alignItems: 'center',
    padding: 24,
    paddingTop: 16
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#E94560',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12
  },
  avatarTexto: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff'
  },
  nombreGrande: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4
  },
  email: {
    fontSize: 14,
    color: '#888'
  },
  seccion: {
    backgroundColor: '#1A1A2E',
    margin: 16,
    marginTop: 0,
    borderRadius: 16,
    padding: 20
  },
  seccionCabecera: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16
  },
  seccionTitulo: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff'
  },
  botonEditar: {
    color: '#E94560',
    fontSize: 14,
    fontWeight: '600'
  },
  campo: {
    marginBottom: 16
  },
  campoLabel: {
    fontSize: 13,
    color: '#888',
    marginBottom: 6
  },
  campoValor: {
    fontSize: 16,
    color: '#fff'
  },
  input: {
    backgroundColor: '#16213E',
    borderRadius: 8,
    padding: 12,
    color: '#fff',
    fontSize: 15,
    borderWidth: 1,
    borderColor: '#2a2a4a'
  },
  opcionesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8
  },
  opcion: {
    backgroundColor: '#16213E',
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#2a2a4a'
  },
  opcionActiva: {
    backgroundColor: '#E94560',
    borderColor: '#E94560'
  },
  opcionTexto: {
    color: '#ccc',
    fontSize: 13
  },
  opcionTextoActivo: {
    color: '#fff',
    fontWeight: 'bold'
  },
  botonGuardar: {
    backgroundColor: '#E94560',
    borderRadius: 10,
    padding: 14,
    alignItems: 'center',
    marginTop: 8
  },
  botonGuardarTexto: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16
  },
  infoCuenta: {
    color: '#888',
    fontSize: 14,
    marginTop: 8
  },
  botonLogout: {
    backgroundColor: '#3a1520',
    margin: 16,
    marginTop: 0,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center'
  },
  botonLogoutTexto: {
    color: '#E94560',
    fontWeight: 'bold',
    fontSize: 16
  }
});

export default PerfilScreen;