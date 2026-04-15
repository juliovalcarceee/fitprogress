import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl, TextInput, Alert } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { obtenerMedidas, registrarMedida, obtenerEvolucionPeso } from '../services/api';
import { MedidaCorporal } from '../types/types';

const ProgresoScreen = () => {
  const [medidas, setMedidas] = useState<MedidaCorporal[]>([]);
  const [evolucionPeso, setEvolucionPeso] = useState<any[]>([]);
  const [refrescando, setRefrescando] = useState(false);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [nuevaMedida, setNuevaMedida] = useState({
    pesoKg: '',
    grasaPct: '',
    medidaPechoCm: '',
    medidaCinturaCm: '',
    medidaBrazoCm: '',
    medidaPiernaCm: '',
    notas: ''
  });

  const cargarDatos = async () => {
    try {
      const [resMedidas, resPeso] = await Promise.all([
        obtenerMedidas(),
        obtenerEvolucionPeso()
      ]);
      setMedidas(resMedidas.data);
      setEvolucionPeso(resPeso.data);
    } catch (error) {
      console.log('Error al cargar datos de progreso');
    }
  };

  useFocusEffect(
    useCallback(() => {
      cargarDatos();
    }, [])
  );

  const onRefrescar = async () => {
    setRefrescando(true);
    await cargarDatos();
    setRefrescando(false);
  };

  const handleGuardarMedida = async () => {
    try {
      const datos: any = {
        fecha: new Date().toISOString()
      };

      if (nuevaMedida.pesoKg) datos.pesoKg = parseFloat(nuevaMedida.pesoKg);
      if (nuevaMedida.grasaPct) datos.grasaPct = parseFloat(nuevaMedida.grasaPct);
      if (nuevaMedida.medidaPechoCm) datos.medidaPechoCm = parseFloat(nuevaMedida.medidaPechoCm);
      if (nuevaMedida.medidaCinturaCm) datos.medidaCinturaCm = parseFloat(nuevaMedida.medidaCinturaCm);
      if (nuevaMedida.medidaBrazoCm) datos.medidaBrazoCm = parseFloat(nuevaMedida.medidaBrazoCm);
      if (nuevaMedida.medidaPiernaCm) datos.medidaPiernaCm = parseFloat(nuevaMedida.medidaPiernaCm);
      if (nuevaMedida.notas) datos.notas = nuevaMedida.notas;

      await registrarMedida(datos);
      setMostrarFormulario(false);
      setNuevaMedida({
        pesoKg: '', grasaPct: '', medidaPechoCm: '',
        medidaCinturaCm: '', medidaBrazoCm: '', medidaPiernaCm: '', notas: ''
      });
      await cargarDatos();
      Alert.alert('Éxito', 'Medida registrada correctamente');
    } catch (error: any) {
      Alert.alert('Error', error.response?.data?.error || 'Error al registrar medida');
    }
  };

  const obtenerCambio = (actual: number | undefined, anterior: number | undefined): string => {
    if (!actual || !anterior) return '';
    const diferencia = actual - anterior;
    if (diferencia > 0) return `+${diferencia.toFixed(1)}`;
    if (diferencia < 0) return diferencia.toFixed(1);
    return '0';
  };

  return (
    <ScrollView
      style={styles.container}
      refreshControl={<RefreshControl refreshing={refrescando} onRefresh={onRefrescar} tintColor="#E94560" />}
    >
      <View style={styles.cabecera}>
        <Text style={styles.titulo}>Mi progreso</Text>
        <TouchableOpacity
          style={styles.botonAnadir}
          onPress={() => setMostrarFormulario(!mostrarFormulario)}
        >
          <Text style={styles.botonAnadirTexto}>{mostrarFormulario ? 'Cancelar' : '+ Nueva medida'}</Text>
        </TouchableOpacity>
      </View>

      {mostrarFormulario && (
        <View style={styles.formulario}>
          <Text style={styles.formularioTitulo}>Registrar medidas</Text>

          <View style={styles.filaInputs}>
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Peso (kg)</Text>
              <TextInput
                style={styles.input}
                placeholder="0.0"
                placeholderTextColor="#666"
                keyboardType="decimal-pad"
                value={nuevaMedida.pesoKg}
                onChangeText={v => setNuevaMedida({ ...nuevaMedida, pesoKg: v })}
              />
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Grasa (%)</Text>
              <TextInput
                style={styles.input}
                placeholder="0.0"
                placeholderTextColor="#666"
                keyboardType="decimal-pad"
                value={nuevaMedida.grasaPct}
                onChangeText={v => setNuevaMedida({ ...nuevaMedida, grasaPct: v })}
              />
            </View>
          </View>

          <View style={styles.filaInputs}>
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Pecho (cm)</Text>
              <TextInput
                style={styles.input}
                placeholder="0.0"
                placeholderTextColor="#666"
                keyboardType="decimal-pad"
                value={nuevaMedida.medidaPechoCm}
                onChangeText={v => setNuevaMedida({ ...nuevaMedida, medidaPechoCm: v })}
              />
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Cintura (cm)</Text>
              <TextInput
                style={styles.input}
                placeholder="0.0"
                placeholderTextColor="#666"
                keyboardType="decimal-pad"
                value={nuevaMedida.medidaCinturaCm}
                onChangeText={v => setNuevaMedida({ ...nuevaMedida, medidaCinturaCm: v })}
              />
            </View>
          </View>

          <View style={styles.filaInputs}>
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Brazo (cm)</Text>
              <TextInput
                style={styles.input}
                placeholder="0.0"
                placeholderTextColor="#666"
                keyboardType="decimal-pad"
                value={nuevaMedida.medidaBrazoCm}
                onChangeText={v => setNuevaMedida({ ...nuevaMedida, medidaBrazoCm: v })}
              />
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Pierna (cm)</Text>
              <TextInput
                style={styles.input}
                placeholder="0.0"
                placeholderTextColor="#666"
                keyboardType="decimal-pad"
                value={nuevaMedida.medidaPiernaCm}
                onChangeText={v => setNuevaMedida({ ...nuevaMedida, medidaPiernaCm: v })}
              />
            </View>
          </View>

          <TextInput
            style={[styles.input, { marginTop: 8 }]}
            placeholder="Notas (opcional)"
            placeholderTextColor="#666"
            value={nuevaMedida.notas}
            onChangeText={v => setNuevaMedida({ ...nuevaMedida, notas: v })}
          />

          <TouchableOpacity style={styles.botonGuardar} onPress={handleGuardarMedida}>
            <Text style={styles.botonGuardarTexto}>Guardar medida</Text>
          </TouchableOpacity>
        </View>
      )}

      {evolucionPeso.length > 0 && (
        <View style={styles.seccion}>
          <Text style={styles.seccionTitulo}>Evolución de peso</Text>
          <View style={styles.tarjetaGrafico}>
            {evolucionPeso.slice(-5).map((dato, index) => (
              <View key={index} style={styles.datoFila}>
                <Text style={styles.datoFecha}>
                  {new Date(dato.fecha).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })}
                </Text>
                <View style={styles.barraContainer}>
                  <View style={[styles.barra, { width: `${(Number(dato.pesoKg) / 150) * 100}%` }]} />
                </View>
                <Text style={styles.datoValor}>{Number(dato.pesoKg).toFixed(1)} kg</Text>
              </View>
            ))}
          </View>
        </View>
      )}

      <View style={styles.seccion}>
        <Text style={styles.seccionTitulo}>Historial de medidas</Text>
        {medidas.length === 0 ? (
          <View style={styles.vacio}>
            <Text style={styles.vacioEmoji}>📏</Text>
            <Text style={styles.vacioTexto}>Sin medidas registradas</Text>
            <Text style={styles.vacioSubtexto}>Registra tus medidas para ver tu evolución</Text>
          </View>
        ) : (
          medidas.slice(0, 10).map((medida, index) => (
            <View key={medida.id} style={styles.tarjetaMedida}>
              <Text style={styles.medidaFecha}>
                {new Date(medida.fecha).toLocaleDateString('es-ES', {
                  weekday: 'long', day: 'numeric', month: 'long'
                })}
              </Text>
              <View style={styles.medidasGrid}>
                {medida.pesoKg && (
                  <View style={styles.medidaItem}>
                    <Text style={styles.medidaValor}>{medida.pesoKg} kg</Text>
                    <Text style={styles.medidaLabel}>Peso</Text>
                    {index < medidas.length - 1 && (
                      <Text style={[
                        styles.medidaCambio,
                        { color: Number(obtenerCambio(medida.pesoKg, medidas[index + 1]?.pesoKg)) <= 0 ? '#10B981' : '#E94560' }
                      ]}>
                        {obtenerCambio(medida.pesoKg, medidas[index + 1]?.pesoKg)}
                      </Text>
                    )}
                  </View>
                )}
                {medida.grasaPct && (
                  <View style={styles.medidaItem}>
                    <Text style={styles.medidaValor}>{medida.grasaPct}%</Text>
                    <Text style={styles.medidaLabel}>Grasa</Text>
                  </View>
                )}
                {medida.medidaPechoCm && (
                  <View style={styles.medidaItem}>
                    <Text style={styles.medidaValor}>{medida.medidaPechoCm}</Text>
                    <Text style={styles.medidaLabel}>Pecho</Text>
                  </View>
                )}
                {medida.medidaCinturaCm && (
                  <View style={styles.medidaItem}>
                    <Text style={styles.medidaValor}>{medida.medidaCinturaCm}</Text>
                    <Text style={styles.medidaLabel}>Cintura</Text>
                  </View>
                )}
                {medida.medidaBrazoCm && (
                  <View style={styles.medidaItem}>
                    <Text style={styles.medidaValor}>{medida.medidaBrazoCm}</Text>
                    <Text style={styles.medidaLabel}>Brazo</Text>
                  </View>
                )}
                {medida.medidaPiernaCm && (
                  <View style={styles.medidaItem}>
                    <Text style={styles.medidaValor}>{medida.medidaPiernaCm}</Text>
                    <Text style={styles.medidaLabel}>Pierna</Text>
                  </View>
                )}
              </View>
              {medida.notas && <Text style={styles.medidaNotas}>{medida.notas}</Text>}
            </View>
          ))
        )}
      </View>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F3460'
  },
  cabecera: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16
  },
  titulo: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff'
  },
  botonAnadir: {
    backgroundColor: '#E94560',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 8
  },
  botonAnadirTexto: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 13
  },
  formulario: {
    backgroundColor: '#1A1A2E',
    margin: 16,
    marginTop: 0,
    borderRadius: 16,
    padding: 16
  },
  formularioTitulo: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 12
  },
  filaInputs: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 8
  },
  inputContainer: {
    flex: 1
  },
  inputLabel: {
    color: '#999',
    fontSize: 12,
    marginBottom: 4
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
  botonGuardar: {
    backgroundColor: '#E94560',
    borderRadius: 10,
    padding: 14,
    alignItems: 'center',
    marginTop: 14
  },
  botonGuardarTexto: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16
  },
  seccion: {
    padding: 16,
    paddingTop: 8
  },
  seccionTitulo: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 12
  },
  tarjetaGrafico: {
    backgroundColor: '#1A1A2E',
    borderRadius: 16,
    padding: 16
  },
  datoFila: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10
  },
  datoFecha: {
    color: '#999',
    fontSize: 12,
    width: 60
  },
  barraContainer: {
    flex: 1,
    height: 12,
    backgroundColor: '#16213E',
    borderRadius: 6,
    marginHorizontal: 8
  },
  barra: {
    height: 12,
    backgroundColor: '#E94560',
    borderRadius: 6
  },
  datoValor: {
    color: '#fff',
    fontSize: 13,
    fontWeight: 'bold',
    width: 60,
    textAlign: 'right'
  },
  tarjetaMedida: {
    backgroundColor: '#1A1A2E',
    borderRadius: 14,
    padding: 16,
    marginBottom: 10
  },
  medidaFecha: {
    fontSize: 14,
    color: '#E94560',
    fontWeight: '600',
    marginBottom: 10,
    textTransform: 'capitalize'
  },
  medidasGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12
  },
  medidaItem: {
    alignItems: 'center',
    minWidth: 60
  },
  medidaValor: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff'
  },
  medidaLabel: {
    fontSize: 11,
    color: '#888',
    marginTop: 2
  },
  medidaCambio: {
    fontSize: 11,
    fontWeight: 'bold',
    marginTop: 2
  },
  medidaNotas: {
    fontSize: 12,
    color: '#888',
    marginTop: 8,
    fontStyle: 'italic'
  },
  vacio: {
    alignItems: 'center',
    padding: 30
  },
  vacioEmoji: {
    fontSize: 48,
    marginBottom: 12
  },
  vacioTexto: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 6
  },
  vacioSubtexto: {
    fontSize: 13,
    color: '#888',
    textAlign: 'center'
  }
});

export default ProgresoScreen;