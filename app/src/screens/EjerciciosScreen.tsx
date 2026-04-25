/**
 * Pantalla de catálogo de ejercicios
 * Muestra ejercicios organizados por grupo muscular con búsqueda y filtros
 */

import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity, RefreshControl, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { obtenerEjercicios, obtenerGruposMusculares } from '../services/api';
import { Ejercicio } from '../types/types';

const iconosGrupo: { [key: string]: string } = {
  pecho: 'body',
  espalda: 'fitness',
  hombros: 'man',
  brazos: 'barbell',
  piernas: 'walk',
  core: 'shield',
  cardio: 'heart'
};

const coloresGrupo: { [key: string]: string } = {
  pecho: '#E94560',
  espalda: '#0F3460',
  hombros: '#F59E0B',
  brazos: '#10B981',
  piernas: '#8B5CF6',
  core: '#EC4899',
  cardio: '#06B6D4'
};

const EjerciciosScreen = ({ navigation }: any) => {
  const [ejercicios, setEjercicios] = useState<Ejercicio[]>([]);
  const [grupos, setGrupos] = useState<string[]>([]);
  const [grupoSeleccionado, setGrupoSeleccionado] = useState<string | null>(null);
  const [busqueda, setBusqueda] = useState('');
  const [refrescando, setRefrescando] = useState(false);
  const [expandido, setExpandido] = useState<number | null>(null);

  const cargarDatos = async () => {
    try {
      const [resEjercicios, resGrupos] = await Promise.all([
        obtenerEjercicios(grupoSeleccionado || undefined, busqueda || undefined),
        obtenerGruposMusculares()
      ]);
      setEjercicios(resEjercicios.data);
      setGrupos(resGrupos.data);
    } catch (error) {
      console.log('Error al cargar ejercicios');
    }
  };

  useFocusEffect(
    useCallback(() => {
      cargarDatos();
    }, [grupoSeleccionado, busqueda])
  );

  const onRefrescar = async () => {
    setRefrescando(true);
    await cargarDatos();
    setRefrescando(false);
  };

  const toggleExpandido = (id: number) => {
    setExpandido(expandido === id ? null : id);
  };

  const renderEjercicio = ({ item }: { item: Ejercicio }) => {
    const estaExpandido = expandido === item.id;
    const color = coloresGrupo[item.grupoMuscular] || '#666';
    const icono = iconosGrupo[item.grupoMuscular] || 'barbell';

    return (
      <TouchableOpacity
        style={[styles.tarjeta, estaExpandido && styles.tarjetaExpandida]}
        onPress={() => toggleExpandido(item.id)}
        activeOpacity={0.7}
      >
        <View style={styles.tarjetaCabecera}>
          <View style={[styles.iconoContainer, { backgroundColor: color + '20' }]}>
            <Ionicons name={icono as any} size={20} color={color} />
          </View>
          <View style={styles.tarjetaInfo}>
            <Text style={styles.ejercicioNombre}>{item.nombre}</Text>
            <View style={styles.tarjetaMeta}>
              <View style={[styles.badge, { backgroundColor: color }]}>
                <Text style={styles.badgeTexto}>{item.grupoMuscular}</Text>
              </View>
              {!item.esPredefinido && (
                <View style={styles.badgePersonalizado}>
                  <Text style={styles.badgePersonalizadoTexto}>Personalizado</Text>
                </View>
              )}
            </View>
          </View>
          <Ionicons name={estaExpandido ? 'chevron-up' : 'chevron-down'} size={20} color="#888" />
        </View>

        {estaExpandido && item.descripcion && (
          <View style={styles.descripcionContainer}>
            <Text style={styles.descripcionTitulo}>Cómo realizar el ejercicio:</Text>
            <Text style={styles.ejercicioDescripcion}>{item.descripcion}</Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.buscadorContainer}>
        <View style={styles.buscadorIcono}>
          <Ionicons name="search" size={18} color="#666" />
          <TextInput
            style={styles.buscador}
            placeholder="Buscar ejercicio..."
            placeholderTextColor="#666"
            value={busqueda}
            onChangeText={setBusqueda}
          />
          {busqueda.length > 0 && (
            <TouchableOpacity onPress={() => setBusqueda('')}>
              <Ionicons name="close-circle" size={18} color="#666" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <View style={styles.filtrosContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <TouchableOpacity
            style={[styles.filtro, !grupoSeleccionado && styles.filtroActivo]}
            onPress={() => setGrupoSeleccionado(null)}
          >
            <Ionicons name="apps" size={14} color={!grupoSeleccionado ? '#fff' : '#ccc'} />
            <Text style={[styles.filtroTexto, !grupoSeleccionado && styles.filtroTextoActivo]}>Todos</Text>
          </TouchableOpacity>
          {grupos.map(grupo => (
            <TouchableOpacity
              key={grupo}
              style={[styles.filtro, grupoSeleccionado === grupo && { backgroundColor: coloresGrupo[grupo] || '#666', borderColor: coloresGrupo[grupo] || '#666' }]}
              onPress={() => setGrupoSeleccionado(grupo === grupoSeleccionado ? null : grupo)}
            >
              <Ionicons name={(iconosGrupo[grupo] || 'barbell') as any} size={14} color={grupoSeleccionado === grupo ? '#fff' : '#ccc'} />
              <Text style={[styles.filtroTexto, grupoSeleccionado === grupo && styles.filtroTextoActivo]}>
                {grupo.charAt(0).toUpperCase() + grupo.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <Text style={styles.contador}>{ejercicios.length} ejercicios</Text>

      <FlatList
        data={ejercicios}
        renderItem={renderEjercicio}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={styles.lista}
        refreshControl={<RefreshControl refreshing={refrescando} onRefresh={onRefrescar} tintColor="#E94560" />}
        ListEmptyComponent={
          <View style={styles.vacio}>
            <Ionicons name="search-outline" size={48} color="#555" />
            <Text style={styles.vacioTexto}>No se encontraron ejercicios</Text>
          </View>
        }
      />

      <TouchableOpacity
        style={styles.botonFlotante}
        onPress={() => navigation.navigate('CrearEjercicio')}
      >
        <Ionicons name="add" size={28} color="#fff" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F3460' },
  buscadorContainer: { padding: 16, paddingBottom: 8 },
  buscadorIcono: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#1A1A2E',
    borderRadius: 12, padding: 12, gap: 8, borderWidth: 1, borderColor: '#2a2a4a'
  },
  buscador: { flex: 1, color: '#fff', fontSize: 16 },
  filtrosContainer: { paddingHorizontal: 16, paddingBottom: 8 },
  filtro: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: '#1A1A2E', borderRadius: 20, paddingHorizontal: 14, paddingVertical: 8,
    borderWidth: 1, borderColor: '#2a2a4a', marginRight: 8
  },
  filtroActivo: { backgroundColor: '#E94560', borderColor: '#E94560' },
  filtroTexto: { color: '#ccc', fontSize: 13, fontWeight: '500' },
  filtroTextoActivo: { color: '#fff', fontWeight: 'bold' },
  contador: { color: '#666', fontSize: 12, paddingHorizontal: 16, marginBottom: 4 },
  lista: { padding: 16, paddingTop: 4, paddingBottom: 100 },
  tarjeta: {
    backgroundColor: '#1A1A2E', borderRadius: 14, padding: 14, marginBottom: 8,
    borderWidth: 1, borderColor: '#2a2a4a'
  },
  tarjetaExpandida: { borderColor: '#E94560' },
  tarjetaCabecera: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  iconoContainer: { width: 40, height: 40, borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
  tarjetaInfo: { flex: 1 },
  ejercicioNombre: { fontSize: 15, fontWeight: 'bold', color: '#fff', marginBottom: 4 },
  tarjetaMeta: { flexDirection: 'row', gap: 6 },
  badge: { borderRadius: 8, paddingHorizontal: 8, paddingVertical: 2 },
  badgeTexto: { color: '#fff', fontSize: 10, fontWeight: 'bold', textTransform: 'capitalize' },
  badgePersonalizado: { backgroundColor: '#16213E', borderRadius: 8, paddingHorizontal: 8, paddingVertical: 2, borderWidth: 1, borderColor: '#E94560' },
  badgePersonalizadoTexto: { color: '#E94560', fontSize: 10, fontWeight: 'bold' },
  descripcionContainer: { marginTop: 12, paddingTop: 12, borderTopWidth: 1, borderTopColor: '#2a2a4a' },
  descripcionTitulo: { color: '#E94560', fontSize: 12, fontWeight: '600', marginBottom: 6 },
  ejercicioDescripcion: { fontSize: 14, color: '#ccc', lineHeight: 20 },
  vacio: { alignItems: 'center', padding: 40 },
  vacioTexto: { color: '#888', fontSize: 16, marginTop: 12 },
  botonFlotante: {
    position: 'absolute', bottom: 24, right: 24, width: 56, height: 56, borderRadius: 28,
    backgroundColor: '#E94560', justifyContent: 'center', alignItems: 'center',
    elevation: 8, shadowColor: '#E94560', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3, shadowRadius: 8
  }
});

export default EjerciciosScreen;