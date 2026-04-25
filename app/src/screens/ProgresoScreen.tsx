/**
 * Pantalla de progreso del usuario
 * Muestra medidas corporales, gráficos de evolución y formulario de registro
 */

import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl, TextInput, Alert, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { obtenerMedidas, registrarMedida, eliminarMedida, obtenerEvolucionPeso, obtenerVolumenPorSesion } from '../services/api';
import { MedidaCorporal } from '../types/types';

const ANCHO = Dimensions.get('window').width;

const ProgresoScreen = () => {
  const [medidas, setMedidas] = useState<MedidaCorporal[]>([]);
  const [evolucionPeso, setEvolucionPeso] = useState<any[]>([]);
  const [volumenSesiones, setVolumenSesiones] = useState<any[]>([]);
  const [refrescando, setRefrescando] = useState(false);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [tabActiva, setTabActiva] = useState<'medidas' | 'fuerza'>('medidas');
  const [nuevaMedida, setNuevaMedida] = useState({
    pesoKg: '', grasaPct: '', medidaPechoCm: '',
    medidaCinturaCm: '', medidaBrazoCm: '', medidaPiernaCm: '', notas: ''
  });

  const cargarDatos = async () => {
    try {
      const [resMedidas, resPeso, resVolumen] = await Promise.all([
        obtenerMedidas(),
        obtenerEvolucionPeso(),
        obtenerVolumenPorSesion()
      ]);
      setMedidas(resMedidas.data);
      setEvolucionPeso(resPeso.data);
      setVolumenSesiones(resVolumen.data);
    } catch (error) {
      console.log('Error al cargar datos de progreso');
    }
  };

  useFocusEffect(useCallback(() => { cargarDatos(); }, []));

  const onRefrescar = async () => {
    setRefrescando(true);
    await cargarDatos();
    setRefrescando(false);
  };

  const handleGuardarMedida = async () => {
    try {
      const datos: any = { fecha: new Date().toISOString() };
      if (nuevaMedida.pesoKg) datos.pesoKg = parseFloat(nuevaMedida.pesoKg);
      if (nuevaMedida.grasaPct) datos.grasaPct = parseFloat(nuevaMedida.grasaPct);
      if (nuevaMedida.medidaPechoCm) datos.medidaPechoCm = parseFloat(nuevaMedida.medidaPechoCm);
      if (nuevaMedida.medidaCinturaCm) datos.medidaCinturaCm = parseFloat(nuevaMedida.medidaCinturaCm);
      if (nuevaMedida.medidaBrazoCm) datos.medidaBrazoCm = parseFloat(nuevaMedida.medidaBrazoCm);
      if (nuevaMedida.medidaPiernaCm) datos.medidaPiernaCm = parseFloat(nuevaMedida.medidaPiernaCm);
      if (nuevaMedida.notas) datos.notas = nuevaMedida.notas;

      await registrarMedida(datos);
      setMostrarFormulario(false);
      setNuevaMedida({ pesoKg: '', grasaPct: '', medidaPechoCm: '', medidaCinturaCm: '', medidaBrazoCm: '', medidaPiernaCm: '', notas: '' });
      await cargarDatos();
      Alert.alert('Éxito', 'Medida registrada correctamente');
    } catch (error: any) {
      Alert.alert('Error', error.response?.data?.error || 'Error al registrar medida');
    }
  };

  const handleEliminarMedida = (id: number) => {
    Alert.alert('Eliminar medida', '¿Estás seguro?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Eliminar', style: 'destructive', onPress: async () => {
        try { await eliminarMedida(id); await cargarDatos(); } catch (e) { Alert.alert('Error', 'No se pudo eliminar'); }
      }}
    ]);
  };

  const calcularCambio = (actual: number | undefined, anterior: number | undefined): { texto: string, color: string } => {
    if (!actual || !anterior) return { texto: '', color: '#888' };
    const diff = actual - anterior;
    if (diff > 0) return { texto: `+${diff.toFixed(1)}`, color: '#E94560' };
    if (diff < 0) return { texto: diff.toFixed(1), color: '#10B981' };
    return { texto: '0', color: '#888' };
  };

  const pesoMax = evolucionPeso.length > 0 ? Math.max(...evolucionPeso.map(d => Number(d.pesoKg))) : 100;
  const pesoMin = evolucionPeso.length > 0 ? Math.min(...evolucionPeso.map(d => Number(d.pesoKg))) : 0;
  const rango = pesoMax - pesoMin || 1;

  return (
    <ScrollView
      style={styles.container}
      refreshControl={<RefreshControl refreshing={refrescando} onRefresh={onRefrescar} tintColor="#E94560" />}
    >
      {/* Cabecera */}
      <View style={styles.cabecera}>
        <Text style={styles.titulo}>Mi progreso</Text>
        <TouchableOpacity style={styles.botonAnadir} onPress={() => setMostrarFormulario(!mostrarFormulario)}>
          <Ionicons name={mostrarFormulario ? 'close' : 'add'} size={20} color="#fff" />
          <Text style={styles.botonAnadirTexto}>{mostrarFormulario ? 'Cancelar' : 'Nueva medida'}</Text>
        </TouchableOpacity>
      </View>

      {/* Resumen rápido */}
      {medidas.length > 0 && (
        <View style={styles.resumenContainer}>
          <View style={styles.resumenItem}>
            <Ionicons name="scale-outline" size={20} color="#E94560" />
            <Text style={styles.resumenValor}>{medidas[0].pesoKg || '--'}</Text>
            <Text style={styles.resumenLabel}>kg actuales</Text>
          </View>
          <View style={styles.resumenItem}>
            <Ionicons name="water-outline" size={20} color="#06B6D4" />
            <Text style={styles.resumenValor}>{medidas[0].grasaPct || '--'}</Text>
            <Text style={styles.resumenLabel}>% grasa</Text>
          </View>
          <View style={styles.resumenItem}>
            <Ionicons name="document-text-outline" size={20} color="#10B981" />
            <Text style={styles.resumenValor}>{medidas.length}</Text>
            <Text style={styles.resumenLabel}>registros</Text>
          </View>
        </View>
      )}

      {/* Formulario */}
      {mostrarFormulario && (
        <View style={styles.formulario}>
          <Text style={styles.formularioTitulo}>Registrar medidas de hoy</Text>
          <View style={styles.filaInputs}>
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Peso (kg)</Text>
              <TextInput style={styles.input} placeholder="0.0" placeholderTextColor="#666" keyboardType="decimal-pad" value={nuevaMedida.pesoKg} onChangeText={v => setNuevaMedida({ ...nuevaMedida, pesoKg: v })} />
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Grasa (%)</Text>
              <TextInput style={styles.input} placeholder="0.0" placeholderTextColor="#666" keyboardType="decimal-pad" value={nuevaMedida.grasaPct} onChangeText={v => setNuevaMedida({ ...nuevaMedida, grasaPct: v })} />
            </View>
          </View>
          <View style={styles.filaInputs}>
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Pecho (cm)</Text>
              <TextInput style={styles.input} placeholder="0.0" placeholderTextColor="#666" keyboardType="decimal-pad" value={nuevaMedida.medidaPechoCm} onChangeText={v => setNuevaMedida({ ...nuevaMedida, medidaPechoCm: v })} />
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Cintura (cm)</Text>
              <TextInput style={styles.input} placeholder="0.0" placeholderTextColor="#666" keyboardType="decimal-pad" value={nuevaMedida.medidaCinturaCm} onChangeText={v => setNuevaMedida({ ...nuevaMedida, medidaCinturaCm: v })} />
            </View>
          </View>
          <View style={styles.filaInputs}>
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Brazo (cm)</Text>
              <TextInput style={styles.input} placeholder="0.0" placeholderTextColor="#666" keyboardType="decimal-pad" value={nuevaMedida.medidaBrazoCm} onChangeText={v => setNuevaMedida({ ...nuevaMedida, medidaBrazoCm: v })} />
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Pierna (cm)</Text>
              <TextInput style={styles.input} placeholder="0.0" placeholderTextColor="#666" keyboardType="decimal-pad" value={nuevaMedida.medidaPiernaCm} onChangeText={v => setNuevaMedida({ ...nuevaMedida, medidaPiernaCm: v })} />
            </View>
          </View>
          <TextInput style={[styles.input, { marginTop: 8 }]} placeholder="Notas (opcional)" placeholderTextColor="#666" value={nuevaMedida.notas} onChangeText={v => setNuevaMedida({ ...nuevaMedida, notas: v })} />
          <TouchableOpacity style={styles.botonGuardar} onPress={handleGuardarMedida}>
            <Ionicons name="checkmark" size={20} color="#fff" />
            <Text style={styles.botonGuardarTexto}>Guardar medida</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Tabs */}
      <View style={styles.tabsContainer}>
        <TouchableOpacity style={[styles.tab, tabActiva === 'medidas' && styles.tabActiva]} onPress={() => setTabActiva('medidas')}>
          <Text style={[styles.tabTexto, tabActiva === 'medidas' && styles.tabTextoActivo]}>Medidas</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.tab, tabActiva === 'fuerza' && styles.tabActiva]} onPress={() => setTabActiva('fuerza')}>
          <Text style={[styles.tabTexto, tabActiva === 'fuerza' && styles.tabTextoActivo]}>Fuerza</Text>
        </TouchableOpacity>
      </View>

      {tabActiva === 'medidas' && (
        <>
          {/* Gráfico de peso */}
          {evolucionPeso.length > 1 && (
            <View style={styles.seccion}>
              <Text style={styles.seccionTitulo}>Evolución de peso</Text>
              <View style={styles.graficoContainer}>
                <View style={styles.graficoBarras}>
                  {evolucionPeso.slice(-8).map((dato, index) => {
                    const altura = ((Number(dato.pesoKg) - pesoMin) / rango) * 100;
                    return (
                      <View key={index} style={styles.barraItem}>
                        <Text style={styles.barraValor}>{Number(dato.pesoKg).toFixed(1)}</Text>
                        <View style={[styles.barra, { height: Math.max(altura, 10) }]} />
                        <Text style={styles.barraFecha}>
                          {new Date(dato.fecha).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })}
                        </Text>
                      </View>
                    );
                  })}
                </View>
              </View>
            </View>
          )}

          {/* Historial de medidas */}
          <View style={styles.seccion}>
            <Text style={styles.seccionTitulo}>Historial de medidas</Text>
            {medidas.length === 0 ? (
              <View style={styles.vacio}>
                <Ionicons name="body-outline" size={48} color="#555" />
                <Text style={styles.vacioTexto}>Sin medidas registradas</Text>
                <Text style={styles.vacioSubtexto}>Registra tus medidas para ver tu evolución</Text>
              </View>
            ) : (
              medidas.slice(0, 10).map((medida, index) => {
                const cambio = index < medidas.length - 1 ? calcularCambio(medida.pesoKg as any, medidas[index + 1]?.pesoKg as any) : null;
                return (
                  <TouchableOpacity key={medida.id} style={styles.tarjetaMedida} onLongPress={() => handleEliminarMedida(medida.id)}>
                    <View style={styles.medidaCabecera}>
                      <Text style={styles.medidaFecha}>
                        {new Date(medida.fecha).toLocaleDateString('es-ES', { weekday: 'short', day: 'numeric', month: 'short' })}
                      </Text>
                      {cambio && cambio.texto && (
                        <View style={[styles.cambioBadge, { backgroundColor: cambio.color + '20' }]}>
                          <Text style={[styles.cambioTexto, { color: cambio.color }]}>{cambio.texto} kg</Text>
                        </View>
                      )}
                    </View>
                    <View style={styles.medidasGrid}>
                      {medida.pesoKg && <MedidaChip icono="scale-outline" valor={`${medida.pesoKg}`} unidad="kg" color="#E94560" />}
                      {medida.grasaPct && <MedidaChip icono="water-outline" valor={`${medida.grasaPct}`} unidad="%" color="#06B6D4" />}
                      {medida.medidaPechoCm && <MedidaChip icono="body-outline" valor={`${medida.medidaPechoCm}`} unidad="cm" color="#F59E0B" />}
                      {medida.medidaCinturaCm && <MedidaChip icono="ellipse-outline" valor={`${medida.medidaCinturaCm}`} unidad="cm" color="#8B5CF6" />}
                      {medida.medidaBrazoCm && <MedidaChip icono="barbell-outline" valor={`${medida.medidaBrazoCm}`} unidad="cm" color="#10B981" />}
                      {medida.medidaPiernaCm && <MedidaChip icono="walk-outline" valor={`${medida.medidaPiernaCm}`} unidad="cm" color="#EC4899" />}
                    </View>
                  </TouchableOpacity>
                );
              })
            )}
          </View>
        </>
      )}

      {tabActiva === 'fuerza' && (
        <View style={styles.seccion}>
          <Text style={styles.seccionTitulo}>Volumen de entrenamiento</Text>
          {volumenSesiones.length === 0 ? (
            <View style={styles.vacio}>
              <Ionicons name="barbell-outline" size={48} color="#555" />
              <Text style={styles.vacioTexto}>Sin datos de entrenamiento</Text>
              <Text style={styles.vacioSubtexto}>Entrena para ver tu progreso de fuerza</Text>
            </View>
          ) : (
            volumenSesiones.slice(-10).map((sesion: any, index: number) => (
              <View key={index} style={styles.tarjetaVolumen}>
                <View style={styles.volumenCabecera}>
                  <Text style={styles.volumenFecha}>
                    {new Date(sesion.fecha).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })}
                  </Text>
                  <Text style={styles.volumenTotal}>{sesion.volumenTotal.toFixed(0)} kg</Text>
                </View>
                <View style={styles.volumenBarraFondo}>
                  <View style={[styles.volumenBarra, { width: `${Math.min((sesion.volumenTotal / Math.max(...volumenSesiones.map((s: any) => s.volumenTotal))) * 100, 100)}%` }]} />
                </View>
                <Text style={styles.volumenDetalle}>{sesion.totalSeries} series · {sesion.duracionMin || '?'} min</Text>
              </View>
            ))
          )}
        </View>
      )}

      <View style={{ height: 40 }} />
    </ScrollView>
  );
};

const MedidaChip = ({ icono, valor, unidad, color }: { icono: string, valor: string, unidad: string, color: string }) => (
  <View style={[chipStyles.container, { borderColor: color + '40' }]}>
    <Ionicons name={icono as any} size={14} color={color} />
    <Text style={[chipStyles.valor, { color }]}>{valor}</Text>
    <Text style={chipStyles.unidad}>{unidad}</Text>
  </View>
);

const chipStyles = StyleSheet.create({
  container: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: '#16213E', borderRadius: 8, paddingHorizontal: 10, paddingVertical: 6, borderWidth: 1 },
  valor: { fontSize: 14, fontWeight: 'bold' },
  unidad: { fontSize: 11, color: '#888' }
});

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F3460' },
  cabecera: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16 },
  titulo: { fontSize: 22, fontWeight: 'bold', color: '#fff' },
  botonAnadir: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#E94560', borderRadius: 10, paddingHorizontal: 14, paddingVertical: 8 },
  botonAnadirTexto: { color: '#fff', fontWeight: 'bold', fontSize: 13 },
  resumenContainer: { flexDirection: 'row', paddingHorizontal: 16, gap: 10, marginBottom: 8 },
  resumenItem: { flex: 1, backgroundColor: '#1A1A2E', borderRadius: 12, padding: 14, alignItems: 'center' },
  resumenValor: { fontSize: 22, fontWeight: 'bold', color: '#fff', marginTop: 4 },
  resumenLabel: { fontSize: 11, color: '#888', marginTop: 2 },
  formulario: { backgroundColor: '#1A1A2E', margin: 16, marginTop: 8, borderRadius: 16, padding: 16 },
  formularioTitulo: { fontSize: 16, fontWeight: 'bold', color: '#fff', marginBottom: 12 },
  filaInputs: { flexDirection: 'row', gap: 10, marginBottom: 8 },
  inputContainer: { flex: 1 },
  inputLabel: { color: '#999', fontSize: 12, marginBottom: 4 },
  input: { backgroundColor: '#16213E', borderRadius: 8, padding: 12, color: '#fff', fontSize: 15, borderWidth: 1, borderColor: '#2a2a4a' },
  botonGuardar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: '#E94560', borderRadius: 10, padding: 14, marginTop: 14 },
  botonGuardarTexto: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  tabsContainer: { flexDirection: 'row', marginHorizontal: 16, marginBottom: 8, backgroundColor: '#1A1A2E', borderRadius: 10, padding: 4 },
  tab: { flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: 8 },
  tabActiva: { backgroundColor: '#E94560' },
  tabTexto: { color: '#888', fontWeight: '600', fontSize: 14 },
  tabTextoActivo: { color: '#fff' },
  seccion: { padding: 16, paddingTop: 8 },
  seccionTitulo: { fontSize: 18, fontWeight: 'bold', color: '#fff', marginBottom: 12 },
  graficoContainer: { backgroundColor: '#1A1A2E', borderRadius: 14, padding: 16 },
  graficoBarras: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-around', height: 150 },
  barraItem: { alignItems: 'center', flex: 1 },
  barraValor: { color: '#fff', fontSize: 10, fontWeight: 'bold', marginBottom: 4 },
  barra: { width: 20, backgroundColor: '#E94560', borderRadius: 4 },
  barraFecha: { color: '#888', fontSize: 9, marginTop: 4 },
  tarjetaMedida: { backgroundColor: '#1A1A2E', borderRadius: 14, padding: 14, marginBottom: 8 },
  medidaCabecera: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  medidaFecha: { fontSize: 13, color: '#E94560', fontWeight: '600', textTransform: 'capitalize' },
  cambioBadge: { borderRadius: 8, paddingHorizontal: 8, paddingVertical: 3 },
  cambioTexto: { fontSize: 12, fontWeight: 'bold' },
  medidasGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  tarjetaVolumen: { backgroundColor: '#1A1A2E', borderRadius: 12, padding: 14, marginBottom: 8 },
  volumenCabecera: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  volumenFecha: { color: '#ccc', fontSize: 13 },
  volumenTotal: { color: '#E94560', fontSize: 16, fontWeight: 'bold' },
  volumenBarraFondo: { height: 8, backgroundColor: '#16213E', borderRadius: 4 },
  volumenBarra: { height: 8, backgroundColor: '#E94560', borderRadius: 4 },
  volumenDetalle: { color: '#888', fontSize: 11, marginTop: 6 },
  vacio: { alignItems: 'center', padding: 30 },
  vacioTexto: { fontSize: 18, fontWeight: 'bold', color: '#fff', marginTop: 12, marginBottom: 6 },
  vacioSubtexto: { fontSize: 13, color: '#888', textAlign: 'center' }
});

export default ProgresoScreen;