import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity, RefreshControl } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { obtenerEjercicios, obtenerGruposMusculares } from '../services/api';
import { Ejercicio } from '../types/types';

const EjerciciosScreen = ({ navigation }: any) => {
  const [ejercicios, setEjercicios] = useState<Ejercicio[]>([]);
  const [grupos, setGrupos] = useState<string[]>([]);
  const [grupoSeleccionado, setGrupoSeleccionado] = useState<string | null>(null);
  const [busqueda, setBusqueda] = useState('');
  const [refrescando, setRefrescando] = useState(false);

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

  const renderEjercicio = ({ item }: { item: Ejercicio }) => (
    <View style={styles.tarjeta}>
      <View style={styles.tarjetaCabecera}>
        <Text style={styles.ejercicioNombre}>{item.nombre}</Text>
        <View style={[styles.badge, { backgroundColor: obtenerColorGrupo(item.grupoMuscular) }]}>
          <Text style={styles.badgeTexto}>{item.grupoMuscular}</Text>
        </View>
      </View>
      {item.descripcion && (
        <Text style={styles.ejercicioDescripcion} numberOfLines={2}>
          {item.descripcion}
        </Text>
      )}
      {!item.esPredefinido && (
        <Text style={styles.personalizado}>Ejercicio personalizado</Text>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.buscadorContainer}>
        <TextInput
          style={styles.buscador}
          placeholder="Buscar ejercicio..."
          placeholderTextColor="#666"
          value={busqueda}
          onChangeText={setBusqueda}
        />
      </View>

      <View style={styles.filtrosContainer}>
        <ScrollViewHorizontal>
          <TouchableOpacity
            style={[styles.filtro, !grupoSeleccionado && styles.filtroActivo]}
            onPress={() => setGrupoSeleccionado(null)}
          >
            <Text style={[styles.filtroTexto, !grupoSeleccionado && styles.filtroTextoActivo]}>
              Todos
            </Text>
          </TouchableOpacity>
          {grupos.map(grupo => (
            <TouchableOpacity
              key={grupo}
              style={[styles.filtro, grupoSeleccionado === grupo && styles.filtroActivo]}
              onPress={() => setGrupoSeleccionado(grupo === grupoSeleccionado ? null : grupo)}
            >
              <Text style={[styles.filtroTexto, grupoSeleccionado === grupo && styles.filtroTextoActivo]}>
                {grupo.charAt(0).toUpperCase() + grupo.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollViewHorizontal>
      </View>

      <FlatList
        data={ejercicios}
        renderItem={renderEjercicio}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={styles.lista}
        refreshControl={<RefreshControl refreshing={refrescando} onRefresh={onRefrescar} tintColor="#E94560" />}
        ListEmptyComponent={
          <View style={styles.vacio}>
            <Text style={styles.vacioTexto}>No se encontraron ejercicios</Text>
          </View>
        }
      />

      <TouchableOpacity
        style={styles.botonFlotante}
        onPress={() => navigation.navigate('CrearEjercicio')}
      >
        <Text style={styles.botonFlotanteTexto}>+</Text>
      </TouchableOpacity>
    </View>
  );
};

const ScrollViewHorizontal = ({ children }: { children: React.ReactNode }) => (
  <FlatList
    horizontal
    data={[]}
    renderItem={() => null}
    ListHeaderComponent={<View style={{ flexDirection: 'row', gap: 8 }}>{children}</View>}
    showsHorizontalScrollIndicator={false}
  />
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F3460'
  },
  buscadorContainer: {
    padding: 16,
    paddingBottom: 8
  },
  buscador: {
    backgroundColor: '#1A1A2E',
    borderRadius: 12,
    padding: 14,
    color: '#fff',
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#2a2a4a'
  },
  filtrosContainer: {
    paddingHorizontal: 16,
    paddingBottom: 12
  },
  filtro: {
    backgroundColor: '#1A1A2E',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#2a2a4a'
  },
  filtroActivo: {
    backgroundColor: '#E94560',
    borderColor: '#E94560'
  },
  filtroTexto: {
    color: '#ccc',
    fontSize: 13,
    fontWeight: '500'
  },
  filtroTextoActivo: {
    color: '#fff',
    fontWeight: 'bold'
  },
  lista: {
    padding: 16,
    paddingTop: 4,
    paddingBottom: 100
  },
  tarjeta: {
    backgroundColor: '#1A1A2E',
    borderRadius: 14,
    padding: 16,
    marginBottom: 10
  },
  tarjetaCabecera: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6
  },
  ejercicioNombre: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    flex: 1,
    marginRight: 8
  },
  badge: {
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4
  },
  badgeTexto: {
    color: '#fff',
    fontSize: 11,
    fontWeight: 'bold',
    textTransform: 'capitalize'
  },
  ejercicioDescripcion: {
    fontSize: 13,
    color: '#999',
    lineHeight: 18
  },
  personalizado: {
    fontSize: 11,
    color: '#E94560',
    marginTop: 6,
    fontStyle: 'italic'
  },
  vacio: {
    alignItems: 'center',
    padding: 40
  },
  vacioTexto: {
    color: '#888',
    fontSize: 16
  },
  botonFlotante: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#E94560',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#E94560',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8
  },
  botonFlotanteTexto: { color: '#fff', fontSize: 32, fontWeight: 'bold' }
});

export default EjerciciosScreen;