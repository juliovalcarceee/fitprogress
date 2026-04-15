import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert, RefreshControl } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { obtenerRutinas, eliminarRutina, marcarRutinaActiva, archivarRutina, duplicarRutina } from '../services/api';
import { Rutina } from '../types/types';

const diasSemana = ['', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

const RutinasScreen = ({ navigation }: any) => {
  const [rutinas, setRutinas] = useState<Rutina[]>([]);
  const [refrescando, setRefrescando] = useState(false);

  const cargarRutinas = async () => {
    try {
      const respuesta = await obtenerRutinas();
      setRutinas(respuesta.data);
    } catch (error) {
      console.log('Error al cargar rutinas');
    }
  };

  useFocusEffect(
    useCallback(() => {
      cargarRutinas();
    }, [])
  );

  const onRefrescar = async () => {
    setRefrescando(true);
    await cargarRutinas();
    setRefrescando(false);
  };

  const handleActivar = async (id: number) => {
    try {
      await marcarRutinaActiva(id);
      await cargarRutinas();
    } catch (error) {
      Alert.alert('Error', 'No se pudo activar la rutina');
    }
  };

  const handleArchivar = async (id: number) => {
    try {
      await archivarRutina(id);
      await cargarRutinas();
    } catch (error) {
      Alert.alert('Error', 'No se pudo archivar la rutina');
    }
  };

  const handleDuplicar = async (id: number) => {
    try {
      await duplicarRutina(id);
      await cargarRutinas();
      Alert.alert('Éxito', 'Rutina duplicada correctamente');
    } catch (error) {
      Alert.alert('Error', 'No se pudo duplicar la rutina');
    }
  };

  const handleEliminar = (id: number) => {
    Alert.alert(
      'Eliminar rutina',
      '¿Estás seguro de que quieres eliminar esta rutina? Esta acción no se puede deshacer.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            try {
              await eliminarRutina(id);
              await cargarRutinas();
            } catch (error) {
              Alert.alert('Error', 'No se pudo eliminar la rutina');
            }
          }
        }
      ]
    );
  };

  const contarDias = (rutina: Rutina): number => {
    if (!rutina.rutinaEjercicios) return 0;
    const dias = new Set(rutina.rutinaEjercicios.map(re => re.diaSemana));
    return dias.size;
  };

  const contarEjercicios = (rutina: Rutina): number => {
    return rutina.rutinaEjercicios?.length || 0;
  };

  const renderRutina = ({ item }: { item: Rutina }) => (
    <View style={[styles.tarjeta, item.esActiva && styles.tarjetaActiva]}>
      <View style={styles.tarjetaCabecera}>
        <View style={{ flex: 1 }}>
          <View style={styles.nombreContainer}>
            <Text style={styles.rutinaNombre}>{item.nombre}</Text>
            {item.esActiva && (
              <View style={styles.badgeActiva}>
                <Text style={styles.badgeActivaTexto}>Activa</Text>
              </View>
            )}
            {item.archivada && (
              <View style={styles.badgeArchivada}>
                <Text style={styles.badgeArchivadaTexto}>Archivada</Text>
              </View>
            )}
          </View>
          {item.descripcion && (
            <Text style={styles.rutinaDescripcion} numberOfLines={1}>{item.descripcion}</Text>
          )}
        </View>
      </View>

      <View style={styles.estadisticas}>
        <Text style={styles.estadistica}>{contarDias(item)} días</Text>
        <Text style={styles.separador}>·</Text>
        <Text style={styles.estadistica}>{contarEjercicios(item)} ejercicios</Text>
      </View>

      <View style={styles.acciones}>
        {!item.esActiva && !item.archivada && (
          <TouchableOpacity style={styles.botonAccion} onPress={() => handleActivar(item.id)}>
            <Text style={styles.botonAccionTexto}>Activar</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity style={styles.botonAccion} onPress={() => handleDuplicar(item.id)}>
          <Text style={styles.botonAccionTexto}>Duplicar</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.botonAccion} onPress={() => handleArchivar(item.id)}>
          <Text style={styles.botonAccionTexto}>{item.archivada ? 'Desarchivar' : 'Archivar'}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.botonAccion, styles.botonEliminar]} onPress={() => handleEliminar(item.id)}>
          <Text style={[styles.botonAccionTexto, styles.botonEliminarTexto]}>Eliminar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={rutinas}
        renderItem={renderRutina}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={styles.lista}
        refreshControl={<RefreshControl refreshing={refrescando} onRefresh={onRefrescar} tintColor="#E94560" />}
        ListEmptyComponent={
          <View style={styles.vacio}>
            <Text style={styles.vacioEmoji}>📋</Text>
            <Text style={styles.vacioTexto}>No tienes rutinas</Text>
            <Text style={styles.vacioSubtexto}>Crea tu primera rutina de entrenamiento</Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F3460'
  },
  lista: {
    padding: 16
  },
  tarjeta: {
    backgroundColor: '#1A1A2E',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#2a2a4a'
  },
  tarjetaActiva: {
    borderColor: '#E94560',
    borderWidth: 2
  },
  tarjetaCabecera: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start'
  },
  nombreContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8
  },
  rutinaNombre: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff'
  },
  badgeActiva: {
    backgroundColor: '#E94560',
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 3
  },
  badgeActivaTexto: {
    color: '#fff',
    fontSize: 11,
    fontWeight: 'bold'
  },
  badgeArchivada: {
    backgroundColor: '#555',
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 3
  },
  badgeArchivadaTexto: {
    color: '#ccc',
    fontSize: 11,
    fontWeight: 'bold'
  },
  rutinaDescripcion: {
    fontSize: 13,
    color: '#999',
    marginTop: 4
  },
  estadisticas: {
    flexDirection: 'row',
    marginTop: 12,
    gap: 8
  },
  estadistica: {
    fontSize: 13,
    color: '#888'
  },
  separador: {
    color: '#555'
  },
  acciones: {
    flexDirection: 'row',
    marginTop: 14,
    gap: 8,
    flexWrap: 'wrap'
  },
  botonAccion: {
    backgroundColor: '#16213E',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8
  },
  botonAccionTexto: {
    color: '#ccc',
    fontSize: 12,
    fontWeight: '600'
  },
  botonEliminar: {
    backgroundColor: '#3a1520'
  },
  botonEliminarTexto: {
    color: '#E94560'
  },
  vacio: {
    alignItems: 'center',
    padding: 40,
    marginTop: 40
  },
  vacioEmoji: {
    fontSize: 64,
    marginBottom: 16
  },
  vacioTexto: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8
  },
  vacioSubtexto: {
    fontSize: 14,
    color: '#888',
    textAlign: 'center'
  }
});

export default RutinasScreen;