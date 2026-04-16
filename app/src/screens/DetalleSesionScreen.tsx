import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { obtenerSesionPorId } from '../services/api';
import { SesionEntrenamiento, SerieLog } from '../types/types';

const diasSemana = ['', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

const DetalleSesionScreen = ({ route, navigation }: any) => {
  const { sesionId } = route.params;
  const [sesion, setSesion] = useState<SesionEntrenamiento | null>(null);

  useEffect(() => {
    cargarSesion();
  }, []);

  const cargarSesion = async () => {
    try {
      const respuesta = await obtenerSesionPorId(sesionId);
      setSesion(respuesta.data);
    } catch (error) {
      Alert.alert('Error', 'No se pudo cargar la sesión');
      navigation.goBack();
    }
  };

  const agruparSeries = (series: SerieLog[]) => {
    const agrupadas: { [key: number]: { ejercicio: any; series: SerieLog[] } } = {};

    series.forEach(serie => {
      if (!agrupadas[serie.ejercicioId]) {
        agrupadas[serie.ejercicioId] = {
          ejercicio: serie.ejercicio,
          series: []
        };
      }
      agrupadas[serie.ejercicioId].series.push(serie);
    });

    return Object.values(agrupadas);
  };

  const calcularVolumen = (): number => {
    if (!sesion?.seriesLog) return 0;
    return sesion.seriesLog.reduce((total, s) => total + (Number(s.pesoKg) * s.repeticiones), 0);
  };

  const pesoMaximo = (series: SerieLog[]): number => {
    if (series.length === 0) return 0;
    return Math.max(...series.map(s => Number(s.pesoKg)));
  };

  if (!sesion) {
    return (
      <View style={[styles.container, styles.centrado]}>
        <Text style={styles.cargando}>Cargando...</Text>
      </View>
    );
  }

  const ejerciciosAgrupados = sesion.seriesLog ? agruparSeries(sesion.seriesLog) : [];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.cabecera}>
        <Text style={styles.fecha}>
          {new Date(sesion.fecha).toLocaleDateString('es-ES', {
            weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
          })}
        </Text>
        <Text style={styles.rutinaNombre}>
          {sesion.rutina?.nombre || 'Sesión libre'}
        </Text>
        <Text style={styles.dia}>{diasSemana[sesion.diaSemana]}</Text>
      </View>

      <View style={styles.resumen}>
        <View style={styles.resumenItem}>
          <Text style={styles.resumenValor}>{ejerciciosAgrupados.length}</Text>
          <Text style={styles.resumenLabel}>Ejercicios</Text>
        </View>
        <View style={styles.resumenItem}>
          <Text style={styles.resumenValor}>{sesion.seriesLog?.length || 0}</Text>
          <Text style={styles.resumenLabel}>Series</Text>
        </View>
        <View style={styles.resumenItem}>
          <Text style={styles.resumenValor}>{calcularVolumen().toFixed(0)}</Text>
          <Text style={styles.resumenLabel}>Vol. (kg)</Text>
        </View>
        {sesion.duracionMin && (
          <View style={styles.resumenItem}>
            <Text style={styles.resumenValor}>{sesion.duracionMin}</Text>
            <Text style={styles.resumenLabel}>Minutos</Text>
          </View>
        )}
      </View>

      {sesion.notas && (
        <View style={styles.seccion}>
          <Text style={styles.seccionTitulo}>Notas</Text>
          <View style={styles.tarjeta}>
            <Text style={styles.notasTexto}>{sesion.notas}</Text>
          </View>
        </View>
      )}

      <View style={styles.seccion}>
        <Text style={styles.seccionTitulo}>Ejercicios realizados</Text>
        {ejerciciosAgrupados.map((grupo, index) => (
          <View key={index} style={styles.tarjeta}>
            <View style={styles.ejercicioCabecera}>
              <Text style={styles.ejercicioNombre}>
                {grupo.ejercicio?.nombre || `Ejercicio ${index + 1}`}
              </Text>
              {grupo.ejercicio?.grupoMuscular && (
                <Text style={styles.ejercicioGrupo}>{grupo.ejercicio.grupoMuscular}</Text>
              )}
            </View>

            <View style={styles.seriesCabecera}>
              <Text style={[styles.seriesHeader, { flex: 0.5 }]}>Serie</Text>
              <Text style={[styles.seriesHeader, { flex: 1 }]}>Peso</Text>
              <Text style={[styles.seriesHeader, { flex: 1 }]}>Reps</Text>
              <Text style={[styles.seriesHeader, { flex: 0.8 }]}>Fallo</Text>
            </View>

            {grupo.series.sort((a, b) => a.numSerie - b.numSerie).map(serie => (
              <View key={serie.id} style={styles.serieFila}>
                <Text style={[styles.serieTexto, { flex: 0.5 }]}>{serie.numSerie}</Text>
                <Text style={[styles.serieTexto, { flex: 1 }]}>
                  {Number(serie.pesoKg).toFixed(1)} kg
                </Text>
                <Text style={[styles.serieTexto, { flex: 1 }]}>{serie.repeticiones}</Text>
                <Text style={[styles.serieTexto, { flex: 0.8 }]}>
                  {serie.alFallo ? '✓' : '-'}
                </Text>
              </View>
            ))}

            <View style={styles.estadisticasEjercicio}>
              <Text style={styles.estadisticaEjercicio}>
                Peso máximo: {pesoMaximo(grupo.series).toFixed(1)} kg
              </Text>
              <Text style={styles.estadisticaEjercicio}>
                Vol.: {grupo.series.reduce((t, s) => t + Number(s.pesoKg) * s.repeticiones, 0).toFixed(0)} kg
              </Text>
            </View>
          </View>
        ))}
      </View>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F3460' },
  centrado: { justifyContent: 'center', alignItems: 'center' },
  cargando: { color: '#fff', fontSize: 16 },
  cabecera: { padding: 20, alignItems: 'center' },
  fecha: { color: '#E94560', fontSize: 14, fontWeight: '600', textTransform: 'capitalize', marginBottom: 8 },
  rutinaNombre: { color: '#fff', fontSize: 22, fontWeight: 'bold', marginBottom: 4 },
  dia: { color: '#888', fontSize: 14 },
  resumen: { flexDirection: 'row', backgroundColor: '#1A1A2E', margin: 16, marginTop: 0, borderRadius: 14, padding: 16 },
  resumenItem: { flex: 1, alignItems: 'center' },
  resumenValor: { color: '#E94560', fontSize: 24, fontWeight: 'bold' },
  resumenLabel: { color: '#888', fontSize: 11, marginTop: 4 },
  seccion: { padding: 16, paddingTop: 8 },
  seccionTitulo: { color: '#fff', fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
  tarjeta: { backgroundColor: '#1A1A2E', borderRadius: 14, padding: 14, marginBottom: 10 },
  ejercicioCabecera: { marginBottom: 10 },
  ejercicioNombre: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  ejercicioGrupo: { color: '#E94560', fontSize: 12, textTransform: 'capitalize', marginTop: 2 },
  seriesCabecera: { flexDirection: 'row', paddingVertical: 6, borderBottomWidth: 1, borderBottomColor: '#2a2a4a' },
  seriesHeader: { color: '#666', fontSize: 12, fontWeight: '600', textAlign: 'center' },
  serieFila: { flexDirection: 'row', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#16213E' },
  serieTexto: { color: '#fff', fontSize: 14, textAlign: 'center' },
  estadisticasEjercicio: { flexDirection: 'row', justifyContent: 'space-between', paddingTop: 10, marginTop: 6 },
  estadisticaEjercicio: { color: '#888', fontSize: 12 },
  notasTexto: { color: '#ccc', fontSize: 14, fontStyle: 'italic' }
});

export default DetalleSesionScreen;