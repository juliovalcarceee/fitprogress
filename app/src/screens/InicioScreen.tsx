import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useAuth } from '../context/AuthContext';
import { obtenerResumen } from '../services/api';
import { Resumen } from '../types/types';

const InicioScreen = () => {
  const { usuario } = useAuth();
  const [resumen, setResumen] = useState<Resumen | null>(null);
  const [refrescando, setRefrescando] = useState(false);

  const cargarResumen = async () => {
    try {
      const respuesta = await obtenerResumen();
      setResumen(respuesta.data);
    } catch (error) {
      console.log('Error al cargar resumen');
    }
  };

  useFocusEffect(
    useCallback(() => {
      cargarResumen();
    }, [])
  );

  const onRefrescar = async () => {
    setRefrescando(true);
    await cargarResumen();
    setRefrescando(false);
  };

  const obtenerSaludo = () => {
    const hora = new Date().getHours();
    if (hora < 12) return 'Buenos días';
    if (hora < 20) return 'Buenas tardes';
    return 'Buenas noches';
  };

  return (
    <ScrollView
      style={styles.container}
      refreshControl={<RefreshControl refreshing={refrescando} onRefresh={onRefrescar} tintColor="#E94560" />}
    >
      <View style={styles.cabecera}>
        <Text style={styles.saludo}>{obtenerSaludo()},</Text>
        <Text style={styles.nombre}>{usuario?.nombre || 'Deportista'} 💪</Text>
      </View>

      <View style={styles.tarjetasContainer}>
        <View style={styles.tarjeta}>
          <Text style={styles.tarjetaNumero}>{resumen?.totalSesiones || 0}</Text>
          <Text style={styles.tarjetaTexto}>Sesiones totales</Text>
        </View>

        <View style={styles.tarjeta}>
          <Text style={styles.tarjetaNumero}>{resumen?.totalRutinas || 0}</Text>
          <Text style={styles.tarjetaTexto}>Rutinas activas</Text>
        </View>
      </View>

      {resumen?.ultimaSesion && (
        <View style={styles.seccion}>
          <Text style={styles.seccionTitulo}>Último entrenamiento</Text>
          <View style={styles.tarjetaInfo}>
            <Text style={styles.infoTitulo}>{resumen.ultimaSesion.rutina?.nombre || 'Sesión libre'}</Text>
            <Text style={styles.infoDetalle}>
              {new Date(resumen.ultimaSesion.fecha).toLocaleDateString('es-ES', {
                weekday: 'long',
                day: 'numeric',
                month: 'long'
              })}
            </Text>
            {resumen.ultimaSesion.duracionMin && (
              <Text style={styles.infoDetalle}>Duración: {resumen.ultimaSesion.duracionMin} minutos</Text>
            )}
          </View>
        </View>
      )}

      {resumen?.ultimaMedida && (
        <View style={styles.seccion}>
          <Text style={styles.seccionTitulo}>Últimas medidas</Text>
          <View style={styles.tarjetaInfo}>
            <Text style={styles.infoDetalle}>
              Fecha: {new Date(resumen.ultimaMedida.fecha).toLocaleDateString('es-ES')}
            </Text>
            {resumen.ultimaMedida.pesoKg && (
              <Text style={styles.infoDetalle}>Peso: {resumen.ultimaMedida.pesoKg} kg</Text>
            )}
            {resumen.ultimaMedida.grasaPct && (
              <Text style={styles.infoDetalle}>Grasa corporal: {resumen.ultimaMedida.grasaPct}%</Text>
            )}
          </View>
        </View>
      )}

      {!resumen?.ultimaSesion && (
        <View style={styles.vacio}>
          <Text style={styles.vacioEmoji}>🏋️</Text>
          <Text style={styles.vacioTexto}>¡Empieza tu primer entrenamiento!</Text>
          <Text style={styles.vacioSubtexto}>Crea una rutina y registra tu primera sesión</Text>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F3460'
  },
  cabecera: {
    padding: 24,
    paddingTop: 16
  },
  saludo: {
    fontSize: 18,
    color: '#ccc'
  },
  nombre: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 4
  },
  tarjetasContainer: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    gap: 12
  },
  tarjeta: {
    flex: 1,
    backgroundColor: '#1A1A2E',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center'
  },
  tarjetaNumero: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#E94560'
  },
  tarjetaTexto: {
    fontSize: 14,
    color: '#ccc',
    marginTop: 4
  },
  seccion: {
    padding: 24,
    paddingBottom: 0
  },
  seccionTitulo: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 12
  },
  tarjetaInfo: {
    backgroundColor: '#1A1A2E',
    borderRadius: 16,
    padding: 20
  },
  infoTitulo: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#E94560',
    marginBottom: 8
  },
  infoDetalle: {
    fontSize: 14,
    color: '#ccc',
    marginBottom: 4
  },
  vacio: {
    alignItems: 'center',
    padding: 40,
    marginTop: 20
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

export default InicioScreen;