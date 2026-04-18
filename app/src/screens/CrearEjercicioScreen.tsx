import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Alert } from 'react-native';
import { crearEjercicio } from '../services/api';

const gruposMusculares = ['pecho', 'espalda', 'hombros', 'brazos', 'piernas', 'core', 'cardio'];

const CrearEjercicioScreen = ({ navigation }: any) => {
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [grupoMuscular, setGrupoMuscular] = useState('');
  const [imagenUrl, setImagenUrl] = useState('');
  const [cargando, setCargando] = useState(false);

  const handleGuardar = async () => {
    if (!nombre.trim()) {
      Alert.alert('Error', 'El nombre del ejercicio es obligatorio');
      return;
    }

    if (!grupoMuscular) {
      Alert.alert('Error', 'Selecciona un grupo muscular');
      return;
    }

    setCargando(true);
    try {
      await crearEjercicio({
        nombre: nombre.trim(),
        descripcion: descripcion.trim(),
        grupoMuscular,
        imagenUrl: imagenUrl.trim() || undefined
      });

      Alert.alert('Éxito', 'Ejercicio creado correctamente');
      navigation.goBack();
    } catch (error: any) {
      Alert.alert('Error', error.response?.data?.error || 'Error al crear ejercicio');
    } finally {
      setCargando(false);
    }
  };

  const obtenerColorGrupo = (grupo: string): string => {
    const colores: { [key: string]: string } = {
      pecho: '#E94560',
      espalda: '#0F3460',
      hombros: '#F59E0B',
      brazos: '#10B981',
      piernas: '#8B5CF6',
      core: '#EC4899',
      cardio: '#06B6D4'
    };
    return colores[grupo] || '#666';
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.seccion}>
        <Text style={styles.titulo}>Nuevo ejercicio</Text>
        <Text style={styles.subtitulo}>Crea un ejercicio personalizado para tus rutinas</Text>
      </View>

      <View style={styles.formulario}>
        <Text style={styles.label}>Nombre del ejercicio</Text>
        <TextInput
          style={styles.input}
          placeholder="Ej: Press Arnold"
          placeholderTextColor="#666"
          value={nombre}
          onChangeText={setNombre}
        />

        <Text style={styles.label}>Descripción</Text>
        <TextInput
          style={[styles.input, styles.inputMultilinea]}
          placeholder="Describe cómo se realiza el ejercicio..."
          placeholderTextColor="#666"
          value={descripcion}
          onChangeText={setDescripcion}
          multiline
          numberOfLines={4}
        />

        <Text style={styles.label}>Grupo muscular</Text>
        <View style={styles.gruposContainer}>
          {gruposMusculares.map(grupo => (
            <TouchableOpacity
              key={grupo}
              style={[
                styles.grupoBoton,
                grupoMuscular === grupo && { backgroundColor: obtenerColorGrupo(grupo), borderColor: obtenerColorGrupo(grupo) }
              ]}
              onPress={() => setGrupoMuscular(grupo)}
            >
              <Text style={[
                styles.grupoTexto,
                grupoMuscular === grupo && styles.grupoTextoActivo
              ]}>
                {grupo.charAt(0).toUpperCase() + grupo.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.label}>URL de imagen (opcional)</Text>
        <TextInput
          style={styles.input}
          placeholder="https://ejemplo.com/imagen.jpg"
          placeholderTextColor="#666"
          value={imagenUrl}
          onChangeText={setImagenUrl}
          autoCapitalize="none"
          keyboardType="url"
        />

        <TouchableOpacity
          style={[styles.botonGuardar, cargando && { opacity: 0.6 }]}
          onPress={handleGuardar}
          disabled={cargando}
        >
          <Text style={styles.botonGuardarTexto}>
            {cargando ? 'Guardando...' : 'Crear ejercicio'}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F3460' },
  seccion: { padding: 20, paddingBottom: 10 },
  titulo: { fontSize: 24, fontWeight: 'bold', color: '#fff', marginBottom: 6 },
  subtitulo: { fontSize: 14, color: '#888' },
  formulario: { backgroundColor: '#1A1A2E', margin: 16, borderRadius: 16, padding: 20 },
  label: { color: '#fff', fontSize: 14, marginBottom: 6, marginTop: 14 },
  input: {
    backgroundColor: '#16213E',
    borderRadius: 10,
    padding: 14,
    color: '#fff',
    fontSize: 15,
    borderWidth: 1,
    borderColor: '#2a2a4a'
  },
  inputMultilinea: { minHeight: 100, textAlignVertical: 'top' },
  gruposContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  grupoBoton: {
    backgroundColor: '#16213E',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#2a2a4a'
  },
  grupoTexto: { color: '#ccc', fontSize: 13, fontWeight: '600' },
  grupoTextoActivo: { color: '#fff', fontWeight: 'bold' },
  botonGuardar: {
    backgroundColor: '#E94560',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 24
  },
  botonGuardarTexto: { color: '#fff', fontSize: 16, fontWeight: 'bold' }
});

export default CrearEjercicioScreen;