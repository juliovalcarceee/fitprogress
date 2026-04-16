import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert, RefreshControl } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { obtenerRutinas, eliminarRutina, marcarRutinaActiva, archivarRutina, duplicarRutina } from '../services/api';
import { Rutina } from '../types/types';

const diasSemana = ['', 'L', 'M', 'X', 'J', 'V', 'S', 'D'];

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

  const handleEntrenar = (rutina: Rutina) => {
    if (!rutina.rutinaEjercicios || rutina.rutinaEjercicios.length === 0) {
      Alert.alert('Rutina vacía', 'Esta rutina no tiene ejercicios. Edítala para añadir ejercicios primero.');
      return;
    }

    const dias = Array.from(new Set(rutina.rutinaEjercicios.map(re => re.diaSemana))).sort();

    if (dias.length === 1) {
      navigation.navigate('Entrenamiento', { rutinaId: rutina.id, diaSemana: dias[0] });
      return;
    }

    Alert.alert(
      'Elegir día',
      '¿Qué día quieres entrenar?',
      [
        ...dias.map(dia => ({
          text: diasSemana[dia] === 'L' ? 'Lunes' :
                diasSemana[dia] === 'M' ? 'Martes' :
                diasSemana[dia] === 'X' ? 'Miércoles' :
                diasSemana[dia] === 'J' ? 'Jueves' :
                diasSemana[dia] === 'V' ? 'Viernes' :
                diasSemana[dia] === 'S' ? 'Sábado' : 'Domingo',
          onPress: () => navigation.navigate('Entrenamiento', { rutinaId: rutina.id, diaSemana: dia })
        })),
        { text: 'Cancelar', style: 'cancel' as const }
      ]
    );
  };

  const obtenerDiasRutina = (rutina: Rutina): number[] => {
    if (!rutina.rutinaEjercicios) return [];
    return Array.from(new Set(rutina.rutinaEjercicios.map(re => re.diaSemana))).sort();
  };

  const renderRutina = ({ item }: { item: Rutina }) => {
    const dias = obtenerDiasRutina(item);

    return (
      <View style={[styles.tarjeta, item.esActiva && styles.tarjetaActiva]}>
        <TouchableOpacity onPress={() => navigation.navigate('CrearRutina', { rutinaId: item.id })}>
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

          <View style={styles.diasContainer}>
            {['L', 'M', 'X', 'J', 'V', 'S', 'D'].map((letra, idx) => (
              <View
                key={idx}
                style={[styles.diaIndicador, dias.includes(idx + 1) && styles.diaIndicadorActivo]}
              >
                <Text style={[styles.diaIndicadorTexto, dias.includes(idx + 1) && styles.diaIndicadorTextoActivo]}>
                  {letra}
                </Text>
              </View>
            ))}
          </View>

          <View style={styles.estadisticas}>
            <Text style={styles.estadistica}>{dias.length} días</Text>
            <Text style={styles.separador}>·</Text>
            <Text style={styles.estadistica}>{item.rutinaEjercicios?.length || 0} ejercicios</Text>
          </View>
        </TouchableOpacity>

        <View style={styles.acciones}>
          {!item.archivada && (
            <TouchableOpacity style={[styles.botonAccion, styles.botonEntrenar]} onPress={() => handleEntrenar(item)}>
              <Text style={[styles.botonAccionTexto, styles.botonEntrenarTexto]}>▶ Entrenar</Text>
            </TouchableOpacity>
          )}
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
  };

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
            <Text style={styles.vacioSubtexto}>Pulsa el botón + para crear tu primera rutina</Text>
          </View>
        }
      />

      <TouchableOpacity
        style={styles.botonFlotante}
        onPress={() => navigation.navigate('CrearRutina')}
      >
        <Text style={styles.botonFlotanteTexto}>+</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F3460' },
  lista: { padding: 16, paddingBottom: 100 },
  tarjeta: { backgroundColor: '#1A1A2E', borderRadius: 16, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: '#2a2a4a' },
  tarjetaActiva: { borderColor: '#E94560', borderWidth: 2 },
  tarjetaCabecera: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  nombreContainer: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', gap: 8 },
  rutinaNombre: { fontSize: 18, fontWeight: 'bold', color: '#fff' },
  badgeActiva: { backgroundColor: '#E94560', borderRadius: 10, paddingHorizontal: 8, paddingVertical: 3 },
  badgeActivaTexto: { color: '#fff', fontSize: 11, fontWeight: 'bold' },
  badgeArchivada: { backgroundColor: '#555', borderRadius: 10, paddingHorizontal: 8, paddingVertical: 3 },
  badgeArchivadaTexto: { color: '#ccc', fontSize: 11, fontWeight: 'bold' },
  rutinaDescripcion: { fontSize: 13, color: '#999', marginTop: 4 },
  diasContainer: { flexDirection: 'row', gap: 4, marginTop: 12 },
  diaIndicador: { flex: 1, backgroundColor: '#16213E', padding: 6, borderRadius: 6, alignItems: 'center' },
  diaIndicadorActivo: { backgroundColor: '#E94560' },
  diaIndicadorTexto: { color: '#666', fontSize: 11, fontWeight: 'bold' },
  diaIndicadorTextoActivo: { color: '#fff' },
  estadisticas: { flexDirection: 'row', marginTop: 10, gap: 8 },
  estadistica: { fontSize: 13, color: '#888' },
  separador: { color: '#555' },
  acciones: { flexDirection: 'row', marginTop: 14, gap: 8, flexWrap: 'wrap' },
  botonAccion: { backgroundColor: '#16213E', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 8 },
  botonAccionTexto: { color: '#ccc', fontSize: 12, fontWeight: '600' },
  botonEntrenar: { backgroundColor: '#E94560' },
  botonEntrenarTexto: { color: '#fff' },
  botonEliminar: { backgroundColor: '#3a1520' },
  botonEliminarTexto: { color: '#E94560' },
  vacio: { alignItems: 'center', padding: 40, marginTop: 40 },
  vacioEmoji: { fontSize: 64, marginBottom: 16 },
  vacioTexto: { fontSize: 20, fontWeight: 'bold', color: '#fff', marginBottom: 8 },
  vacioSubtexto: { fontSize: 14, color: '#888', textAlign: 'center' },
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

export default RutinasScreen;