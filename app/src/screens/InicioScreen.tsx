import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl, Alert } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { obtenerResumen, obtenerRutinas } from '../services/api';
import { Resumen, Rutina } from '../types/types';

const diasSemana = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

const InicioScreen = ({ navigation }: any) => {
  const { usuario } = useAuth();
  const [resumen, setResumen] = useState<Resumen | null>(null);
  const [rutinaActiva, setRutinaActiva] = useState<Rutina | null>(null);
  const [refrescando, setRefrescando] = useState(false);

  const cargarDatos = async () => {
    try {
      const [resResumen, resRutinas] = await Promise.all([
        obtenerResumen(),
        obtenerRutinas()
      ]);
      setResumen(resResumen.data);
      const activa = resRutinas.data.find((r: Rutina) => r.esActiva);
      setRutinaActiva(activa || null);
    } catch (error) {
      console.log('Error al cargar datos');
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

  const obtenerSaludo = () => {
    const hora = new Date().getHours();
    if (hora < 12) return 'Buenos días';
    if (hora < 20) return 'Buenas tardes';
    return 'Buenas noches';
  };

  const handleEntrenarRapido = () => {
    if (!rutinaActiva) {
      Alert.alert(
        'Sin rutina activa',
        'No tienes ninguna rutina marcada como activa. ¿Quieres crear una?',
        [
          { text: 'Cancelar', style: 'cancel' },
          { text: 'Crear rutina', onPress: () => navigation.navigate('CrearRutina') }
        ]
      );
      return;
    }

    const hoy = new Date().getDay();
    const diaHoy = hoy === 0 ? 7 : hoy;

    const ejerciciosHoy = rutinaActiva.rutinaEjercicios?.filter(
      re => re.diaSemana === diaHoy
    );

    if (!ejerciciosHoy || ejerciciosHoy.length === 0) {
      const diasConEjercicios = rutinaActiva.rutinaEjercicios
        ? Array.from(new Set(rutinaActiva.rutinaEjercicios.map(re => re.diaSemana))).sort()
        : [];

      if (diasConEjercicios.length === 0) {
        Alert.alert('Rutina vacía', 'Tu rutina activa no tiene ejercicios');
        return;
      }

      Alert.alert(
        'Hoy es día de descanso',
        '¿Quieres entrenar otro día de tu rutina?',
        [
          ...diasConEjercicios.map(dia => ({
            text: diasSemana[dia === 7 ? 0 : dia],
            onPress: () => navigation.navigate('Entrenamiento', {
              rutinaId: rutinaActiva.id,
              diaSemana: dia
            })
          })),
          { text: 'Cancelar', style: 'cancel' as const }
        ]
      );
      return;
    }

    navigation.navigate('Entrenamiento', {
      rutinaId: rutinaActiva.id,
      diaSemana: diaHoy
    });
  };

  const getDiaHoy = () => {
    const hoy = new Date();
    return hoy.toLocaleDateString('es-ES', {
      weekday: 'long',
      day: 'numeric',
      month: 'long'
    });
  };

  return (
    <ScrollView
      style={styles.container}
      refreshControl={<RefreshControl refreshing={refrescando} onRefresh={onRefrescar} tintColor="#E94560" />}
    >
      <View style={styles.cabecera}>
        <View>
          <Text style={styles.saludo}>{obtenerSaludo()},</Text>
          <Text style={styles.nombre}>{usuario?.nombre || 'Deportista'} 💪</Text>
        </View>
        <Text style={styles.fecha}>{getDiaHoy()}</Text>
      </View>

      {/* Botón entrenar */}
      <TouchableOpacity style={styles.botonEntrenar} onPress={handleEntrenarRapido}>
        <View style={styles.botonEntrenarContenido}>
          <Ionicons name="flash" size={28} color="#fff" />
          <View style={styles.botonEntrenarTextos}>
            <Text style={styles.botonEntrenarTitulo}>Empezar entrenamiento</Text>
            <Text style={styles.botonEntrenarSubtitulo}>
              {rutinaActiva ? rutinaActiva.nombre : 'Crea una rutina primero'}
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={24} color="#fff" />
        </View>
      </TouchableOpacity>

      <View style={styles.tarjetasContainer}>
        <View style={styles.tarjeta}>
          <Ionicons name="barbell-outline" size={28} color="#E94560" />
          <Text style={styles.tarjetaNumero}>{resumen?.totalSesiones || 0}</Text>
          <Text style={styles.tarjetaTexto}>Sesiones</Text>
        </View>

        <View style={styles.tarjeta}>
          <Ionicons name="document-text-outline" size={28} color="#E94560" />
          <Text style={styles.tarjetaNumero}>{resumen?.totalRutinas || 0}</Text>
          <Text style={styles.tarjetaTexto}>Rutinas</Text>
        </View>
      </View>

      {resumen?.ultimaSesion && (
        <View style={styles.seccion}>
          <Text style={styles.seccionTitulo}>Último entrenamiento</Text>
          <TouchableOpacity
            style={styles.tarjetaInfo}
            onPress={() => navigation.navigate('DetalleSesion', { sesionId: resumen.ultimaSesion?.id })}
          >
            <View style={styles.tarjetaInfoCabecera}>
              <Ionicons name="time-outline" size={20} color="#E94560" />
              <Text style={styles.infoTitulo}>{resumen.ultimaSesion.rutina?.nombre || 'Sesión libre'}</Text>
            </View>
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
            <Text style={styles.verDetalle}>Ver detalle →</Text>
          </TouchableOpacity>
        </View>
      )}

      {resumen?.ultimaMedida && (
        <View style={styles.seccion}>
          <Text style={styles.seccionTitulo}>Últimas medidas</Text>
          <View style={styles.tarjetaInfo}>
            <View style={styles.tarjetaInfoCabecera}>
              <Ionicons name="body-outline" size={20} color="#E94560" />
              <Text style={styles.infoTitulo}>
                {new Date(resumen.ultimaMedida.fecha).toLocaleDateString('es-ES')}
              </Text>
            </View>
            <View style={styles.medidasResumen}>
              {resumen.ultimaMedida.pesoKg && (
                <View style={styles.medidaItem}>
                  <Text style={styles.medidaValor}>{resumen.ultimaMedida.pesoKg}</Text>
                  <Text style={styles.medidaLabel}>kg</Text>
                </View>
              )}
              {resumen.ultimaMedida.grasaPct && (
                <View style={styles.medidaItem}>
                  <Text style={styles.medidaValor}>{resumen.ultimaMedida.grasaPct}</Text>
                  <Text style={styles.medidaLabel}>% grasa</Text>
                </View>
              )}
            </View>
          </View>
        </View>
      )}

      {!resumen?.ultimaSesion && !rutinaActiva && (
        <View style={styles.vacio}>
          <Text style={styles.vacioEmoji}>🏋️</Text>
          <Text style={styles.vacioTexto}>¡Empieza tu primer entrenamiento!</Text>
          <Text style={styles.vacioSubtexto}>Crea una rutina y registra tu primera sesión</Text>
          <TouchableOpacity
            style={styles.botonCrearRutina}
            onPress={() => navigation.navigate('CrearRutina')}
          >
            <Text style={styles.botonCrearRutinaTexto}>Crear mi primera rutina</Text>
          </TouchableOpacity>
        </View>
      )}

      <View style={{ height: 30 }} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F3460' },
  cabecera: { padding: 24, paddingTop: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  saludo: { fontSize: 16, color: '#ccc' },
  nombre: { fontSize: 26, fontWeight: 'bold', color: '#fff', marginTop: 4 },
  fecha: { fontSize: 12, color: '#888', marginTop: 4, textTransform: 'capitalize' },
  botonEntrenar: {
    backgroundColor: '#E94560',
    marginHorizontal: 24,
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    elevation: 4,
    shadowColor: '#E94560',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8
  },
  botonEntrenarContenido: { flexDirection: 'row', alignItems: 'center' },
  botonEntrenarTextos: { flex: 1, marginLeft: 14 },
  botonEntrenarTitulo: { fontSize: 18, fontWeight: 'bold', color: '#fff' },
  botonEntrenarSubtitulo: { fontSize: 13, color: 'rgba(255,255,255,0.7)', marginTop: 2 },
  tarjetasContainer: { flexDirection: 'row', paddingHorizontal: 24, gap: 12, marginBottom: 8 },
  tarjeta: { flex: 1, backgroundColor: '#1A1A2E', borderRadius: 16, padding: 20, alignItems: 'center' },
  tarjetaNumero: { fontSize: 32, fontWeight: 'bold', color: '#E94560', marginTop: 8 },
  tarjetaTexto: { fontSize: 13, color: '#ccc', marginTop: 4 },
  seccion: { padding: 24, paddingBottom: 0 },
  seccionTitulo: { fontSize: 18, fontWeight: 'bold', color: '#fff', marginBottom: 12 },
  tarjetaInfo: { backgroundColor: '#1A1A2E', borderRadius: 16, padding: 20 },
  tarjetaInfoCabecera: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 10 },
  infoTitulo: { fontSize: 16, fontWeight: 'bold', color: '#fff' },
  infoDetalle: { fontSize: 14, color: '#ccc', marginBottom: 4, textTransform: 'capitalize' },
  verDetalle: { color: '#E94560', fontSize: 13, fontWeight: '600', marginTop: 8 },
  medidasResumen: { flexDirection: 'row', gap: 20, marginTop: 4 },
  medidaItem: { flexDirection: 'row', alignItems: 'baseline', gap: 4 },
  medidaValor: { fontSize: 24, fontWeight: 'bold', color: '#fff' },
  medidaLabel: { fontSize: 13, color: '#888' },
  vacio: { alignItems: 'center', padding: 40, marginTop: 10 },
  vacioEmoji: { fontSize: 64, marginBottom: 16 },
  vacioTexto: { fontSize: 20, fontWeight: 'bold', color: '#fff', marginBottom: 8 },
  vacioSubtexto: { fontSize: 14, color: '#888', textAlign: 'center', marginBottom: 24 },
  botonCrearRutina: { backgroundColor: '#E94560', borderRadius: 12, paddingVertical: 14, paddingHorizontal: 28 },
  botonCrearRutinaTexto: { color: '#fff', fontSize: 16, fontWeight: 'bold' }
});

export default InicioScreen;