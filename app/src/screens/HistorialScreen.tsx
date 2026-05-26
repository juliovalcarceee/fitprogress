import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, RefreshControl, Alert } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { obtenerHistorial, eliminarSesion } from '../services/api';
import { SesionEntrenamiento } from '../types/types';

const diasSemana = ['', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

const HistorialScreen = ({ navigation }: any) => {
  const [sesiones, setSesiones] = useState<SesionEntrenamiento[]>([]);
  const [refrescando, setRefrescando] = useState(false);

  const cargarHistorial = async () => {
    try {
      const respuesta = await obtenerHistorial();
      setSesiones(respuesta.data);
    } catch (error) {
      console.log('Error al cargar historial');
    }
  };

  useFocusEffect(
    useCallback(() => {
      cargarHistorial();
    }, [])
  );

  const onRefrescar = async () => {
    setRefrescando(true);
    await cargarHistorial();
    setRefrescando(false);
  };

  const handleEliminar = (id: number) => {
    Alert.alert(
      'Eliminar sesión',
      '¿Estás seguro de que quieres eliminar esta sesión?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            try {
              await eliminarSesion(id);
              await cargarHistorial();
            } catch (error) {
              Alert.alert('Error', 'No se pudo eliminar la sesión');
            }
          }
        }
      ]
    );
  };

  const calcularVolumen = (sesion: SesionEntrenamiento): number => {
    if (!sesion.seriesLog) return 0;
    return sesion.seriesLog.reduce((total, serie) => {
      return total + (Number(serie.pesoKg) * serie.repeticiones);
    }, 0);
  };

  const contarEjercicios = (sesion: SesionEntrenamiento): number => {
    if (!sesion.seriesLog) return 0;
    const ejercicios = new Set(sesion.seriesLog.map(s => s.ejercicioId));
    return ejercicios.size;
  };

  const renderSesion = ({ item }: { item: SesionEntrenamiento }) => {
    const volumen = calcularVolumen(item);
    const numEjercicios = contarEjercicios(item);
    const numSeries = item.seriesLog?.length || 0;

    return (
      <TouchableOpacity
        style={styles.tarjeta}
        onPress={() => navigation.navigate('DetalleSesion', { sesionId: item.id })}
        onLongPress={() => handleEliminar(item.id)}
      >
        <View style={styles.tarjetaCabecera}>
          <View style={{ flex: 1 }}>
            <Text style={styles.fecha}>
              {new Date(item.fecha).toLocaleDateString('es-ES', {
                weekday: 'long',
                day: 'numeric',
                month: 'long'
              })}
            </Text>
            <Text style={styles.rutinaNombre}>
              {item.rutina?.nombre || 'Sesión libre'} · {diasSemana[item.diaSemana]}
            </Text>
          </View>
          {/* CORRECCIÓN: usar != null en vez de && para evitar renderizar 0 como string */}
          {item.duracionMin != null && item.duracionMin > 0 && (
            <View style={styles.duracionBadge}>
              <Text style={styles.duracionTexto}>{item.duracionMin} min</Text>
            </View>
          )}
        </View>

        <View style={styles.estadisticas}>
          <View style={styles.estadisticaItem}>
            <Text style={styles.estadisticaValor}>{numEjercicios}</Text>
            <Text style={styles.estadisticaLabel}>Ejercicios</Text>
          </View>
          <View style={styles.separador} />
          <View style={styles.estadisticaItem}>
            <Text style={styles.estadisticaValor}>{numSeries}</Text>
            <Text style={styles.estadisticaLabel}>Series</Text>
          </View>
          <View style={styles.separador} />
          <View style={styles.estadisticaItem}>
            <Text style={styles.estadisticaValor}>{volumen.toFixed(0)}</Text>
            <Text style={styles.estadisticaLabel}>Volumen (kg)</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={sesiones}
        renderItem={renderSesion}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={styles.lista}
        refreshControl={<RefreshControl refreshing={refrescando} onRefresh={onRefrescar} tintColor="#E94560" />}
        ListHeaderComponent={
          sesiones.length > 0 ? (
            <Text style={styles.totalSesiones}>{sesiones.length} sesiones registradas</Text>
          ) : null
        }
        ListEmptyComponent={
          <View style={styles.vacio}>
            <Text style={styles.vacioEmoji}>📊</Text>
            <Text style={styles.vacioTexto}>Sin entrenamientos</Text>
            <Text style={styles.vacioSubtexto}>Tu historial aparecerá aquí cuando empieces a entrenar</Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F3460' },
  lista: { padding: 16 },
  totalSesiones: { color: '#888', fontSize: 13, marginBottom: 12, textAlign: 'center' },
  tarjeta: { backgroundColor: '#1A1A2E', borderRadius: 14, padding: 16, marginBottom: 10 },
  tarjetaCabecera: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 },
  fecha: { color: '#E94560', fontSize: 13, fontWeight: '600', textTransform: 'capitalize', marginBottom: 4 },
  rutinaNombre: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  duracionBadge: { backgroundColor: '#16213E', borderRadius: 8, paddingHorizontal: 10, paddingVertical: 4 },
  duracionTexto: { color: '#ccc', fontSize: 12, fontWeight: 'bold' },
  estadisticas: { flexDirection: 'row', backgroundColor: '#16213E', borderRadius: 10, padding: 12 },
  estadisticaItem: { flex: 1, alignItems: 'center' },
  estadisticaValor: { color: '#E94560', fontSize: 20, fontWeight: 'bold' },
  estadisticaLabel: { color: '#888', fontSize: 11, marginTop: 2 },
  separador: { width: 1, backgroundColor: '#2a2a4a' },
  vacio: { alignItems: 'center', padding: 40, marginTop: 40 },
  vacioEmoji: { fontSize: 64, marginBottom: 16 },
  vacioTexto: { fontSize: 20, fontWeight: 'bold', color: '#fff', marginBottom: 8 },
  vacioSubtexto: { fontSize: 14, color: '#888', textAlign: 'center' }
});

export default HistorialScreen;
