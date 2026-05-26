import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert, Vibration } from 'react-native';
import { obtenerRutinaPorId, iniciarSesionEntrenamiento, finalizarSesionEntrenamiento, registrarSerie } from '../services/api';
import { Rutina, RutinaEjercicio } from '../types/types';

const diasSemana = ['', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

interface SerieRegistrada {
  ejercicioId: number;
  numSerie: number;
  pesoKg: string;
  repeticiones: string;
  alFallo: boolean;
  completada: boolean;
}

const EntrenamientoScreen = ({ route, navigation }: any) => {
  const { rutinaId, diaSemana } = route.params;
  const [rutina, setRutina] = useState<Rutina | null>(null);
  const [sesionId, setSesionId] = useState<number | null>(null);
  const [ejerciciosDelDia, setEjerciciosDelDia] = useState<RutinaEjercicio[]>([]);
  const [series, setSeries] = useState<{ [key: string]: SerieRegistrada[] }>({});
  const [ejercicioActual, setEjercicioActual] = useState(0);
  const [tiempoDescanso, setTiempoDescanso] = useState(0);
  const [descansando, setDescansando] = useState(false);
  const [tiempoTotal, setTiempoTotal] = useState(0);
  const [iniciado, setIniciado] = useState(false);
  const intervaloDescanso = useRef<any>(null);
  const intervaloTotal = useRef<any>(null);

  useEffect(() => {
    cargarRutina();
    return () => {
      if (intervaloDescanso.current) clearInterval(intervaloDescanso.current);
      if (intervaloTotal.current) clearInterval(intervaloTotal.current);
    };
  }, []);

  const cargarRutina = async () => {
    try {
      const respuesta = await obtenerRutinaPorId(rutinaId);
      setRutina(respuesta.data);
      const ejercicios = respuesta.data.rutinaEjercicios?.filter(
        (re: RutinaEjercicio) => re.diaSemana === diaSemana
      ) || [];
      setEjerciciosDelDia(ejercicios);

      const seriesIniciales: { [key: string]: SerieRegistrada[] } = {};
      ejercicios.forEach((ej: RutinaEjercicio) => {
        const key = ej.ejercicioId.toString();
        seriesIniciales[key] = Array.from({ length: ej.seriesObjetivo }, (_, i) => ({
          ejercicioId: ej.ejercicioId,
          numSerie: i + 1,
          pesoKg: '',
          repeticiones: ej.repeticionesObj,
          alFallo: false,
          completada: false
        }));
      });
      setSeries(seriesIniciales);
    } catch (error) {
      Alert.alert('Error', 'No se pudo cargar la rutina');
      navigation.goBack();
    }
  };

  const handleIniciarSesion = async () => {
    try {
      const respuesta = await iniciarSesionEntrenamiento({ rutinaId, diaSemana });
      setSesionId(respuesta.data.sesion.id);
      setIniciado(true);
      intervaloTotal.current = setInterval(() => {
        setTiempoTotal(prev => prev + 1);
      }, 1000);
    } catch (error) {
      Alert.alert('Error', 'No se pudo iniciar la sesión');
    }
  };

  const handleCompletarSerie = async (ejercicioId: number, numSerie: number) => {
    const key = ejercicioId.toString();
    const serie = series[key]?.find(s => s.numSerie === numSerie);

    if (!serie || !serie.pesoKg || !serie.repeticiones) {
      Alert.alert('Error', 'Rellena el peso y las repeticiones');
      return;
    }

    if (!sesionId) return;

    try {
      await registrarSerie({
        sesionId,
        ejercicioId,
        numSerie,
        pesoKg: parseFloat(serie.pesoKg),
        repeticiones: parseInt(serie.repeticiones),
        alFallo: serie.alFallo
      });

      setSeries(prev => ({
        ...prev,
        [key]: prev[key].map(s =>
          s.numSerie === numSerie ? { ...s, completada: true } : s
        )
      }));

      const ejercicio = ejerciciosDelDia.find(e => e.ejercicioId === ejercicioId);
      if (ejercicio) {
        iniciarDescanso(ejercicio.descansoSeg);
      }
    } catch (error) {
      Alert.alert('Error', 'No se pudo registrar la serie');
    }
  };

  const iniciarDescanso = (segundos: number) => {
    setTiempoDescanso(segundos);
    setDescansando(true);

    if (intervaloDescanso.current) clearInterval(intervaloDescanso.current);

    intervaloDescanso.current = setInterval(() => {
      setTiempoDescanso(prev => {
        if (prev <= 1) {
          clearInterval(intervaloDescanso.current);
          setDescansando(false);
          Vibration.vibrate(500);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const saltarDescanso = () => {
    if (intervaloDescanso.current) clearInterval(intervaloDescanso.current);
    setDescansando(false);
    setTiempoDescanso(0);
  };

  const handleFinalizarSesion = async () => {
    Alert.alert(
      'Finalizar entrenamiento',
      '¿Quieres finalizar el entrenamiento?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Finalizar',
          onPress: async () => {
            try {
              if (intervaloTotal.current) clearInterval(intervaloTotal.current);
              if (intervaloDescanso.current) clearInterval(intervaloDescanso.current);

              if (sesionId) {
                // CORRECCIÓN: duracionMin mínimo 1 para evitar guardar 0
                const duracion = Math.max(1, Math.round(tiempoTotal / 60));
                await finalizarSesionEntrenamiento(sesionId, {
                  duracionMin: duracion
                });
              }

              Alert.alert('¡Bien hecho!', 'Entrenamiento finalizado correctamente');
              navigation.goBack();
            } catch (error) {
              Alert.alert('Error', 'No se pudo finalizar la sesión');
            }
          }
        }
      ]
    );
  };

  const actualizarSerie = (ejercicioId: number, numSerie: number, campo: string, valor: any) => {
    const key = ejercicioId.toString();
    setSeries(prev => ({
      ...prev,
      [key]: prev[key].map(s =>
        s.numSerie === numSerie ? { ...s, [campo]: valor } : s
      )
    }));
  };

  const formatearTiempo = (segundos: number): string => {
    const min = Math.floor(segundos / 60);
    const seg = segundos % 60;
    return `${min.toString().padStart(2, '0')}:${seg.toString().padStart(2, '0')}`;
  };

  const ejercicioActualData = ejerciciosDelDia[ejercicioActual];

  if (!rutina || ejerciciosDelDia.length === 0) {
    return (
      <View style={[styles.container, styles.centrado]}>
        <Text style={styles.cargando}>Cargando entrenamiento...</Text>
      </View>
    );
  }

  if (!iniciado) {
    return (
      <View style={[styles.container, styles.centrado]}>
        <Text style={styles.tituloInicio}>{rutina.nombre}</Text>
        <Text style={styles.subtituloInicio}>{diasSemana[diaSemana]}</Text>
        <Text style={styles.infoInicio}>{ejerciciosDelDia.length} ejercicios</Text>
        <TouchableOpacity style={styles.botonIniciar} onPress={handleIniciarSesion}>
          <Text style={styles.botonIniciarTexto}>Empezar entrenamiento</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.botonVolver} onPress={() => navigation.goBack()}>
          <Text style={styles.botonVolverTexto}>Volver</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Cabecera con tiempo */}
      <View style={styles.cabecera}>
        <View>
          <Text style={styles.cabeceraTexto}>{rutina.nombre}</Text>
          <Text style={styles.cabeceraDia}>{diasSemana[diaSemana]}</Text>
        </View>
        <View style={styles.tiempoContainer}>
          <Text style={styles.tiempoTexto}>{formatearTiempo(tiempoTotal)}</Text>
        </View>
      </View>

      {/* Temporizador de descanso */}
      {descansando && (
        <View style={styles.descansoContainer}>
          <Text style={styles.descansoTitulo}>Descanso</Text>
          <Text style={styles.descansoTiempo}>{formatearTiempo(tiempoDescanso)}</Text>
          <TouchableOpacity style={styles.botonSaltar} onPress={saltarDescanso}>
            <Text style={styles.botonSaltarTexto}>Saltar descanso</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Selector de ejercicio */}
      <ScrollView horizontal style={styles.selectorEjercicios} showsHorizontalScrollIndicator={false}>
        {ejerciciosDelDia.map((ej, index) => {
          const key = ej.ejercicioId.toString();
          const todasCompletadas = series[key]?.every(s => s.completada) || false;
          return (
            <TouchableOpacity
              key={ej.id}
              style={[
                styles.selectorItem,
                ejercicioActual === index && styles.selectorItemActivo,
                todasCompletadas && styles.selectorItemCompletado
              ]}
              onPress={() => setEjercicioActual(index)}
            >
              {/* CORRECCIÓN: concatenar string en vez de expresión mixta */}
              <Text style={[
                styles.selectorTexto,
                ejercicioActual === index && styles.selectorTextoActivo
              ]}>
                {todasCompletadas
                  ? `✓ ${ej.ejercicio?.nombre || `Ejercicio ${index + 1}`}`
                  : (ej.ejercicio?.nombre || `Ejercicio ${index + 1}`)
                }
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Series del ejercicio actual */}
      <ScrollView style={styles.seriesContainer}>
        {ejercicioActualData && (
          <View>
            <Text style={styles.ejercicioNombre}>
              {ejercicioActualData.ejercicio?.nombre}
            </Text>
            <Text style={styles.ejercicioInfo}>
              {`${ejercicioActualData.seriesObjetivo} series × ${ejercicioActualData.repeticionesObj} reps · ${ejercicioActualData.descansoSeg}s descanso`}
            </Text>

            <View style={styles.seriesCabecera}>
              <Text style={[styles.seriesCabeceraTexto, { flex: 0.5 }]}>Serie</Text>
              <Text style={[styles.seriesCabeceraTexto, { flex: 1 }]}>Peso (kg)</Text>
              <Text style={[styles.seriesCabeceraTexto, { flex: 1 }]}>Reps</Text>
              <Text style={[styles.seriesCabeceraTexto, { flex: 0.5 }]}>Fallo</Text>
              <Text style={[styles.seriesCabeceraTexto, { flex: 0.8 }]}>{''}</Text>
            </View>

            {series[ejercicioActualData.ejercicioId.toString()]?.map(serie => (
              <View key={serie.numSerie} style={[styles.serieFila, serie.completada && styles.serieCompletada]}>
                <Text style={[styles.serieNumero, { flex: 0.5 }]}>{serie.numSerie}</Text>
                <TextInput
                  style={[styles.serieInput, { flex: 1 }]}
                  placeholder="0"
                  placeholderTextColor="#666"
                  keyboardType="decimal-pad"
                  value={serie.pesoKg}
                  onChangeText={v => actualizarSerie(serie.ejercicioId, serie.numSerie, 'pesoKg', v)}
                  editable={!serie.completada}
                />
                <TextInput
                  style={[styles.serieInput, { flex: 1 }]}
                  placeholder={serie.repeticiones}
                  placeholderTextColor="#666"
                  keyboardType="number-pad"
                  value={serie.completada ? serie.repeticiones : ''}
                  onChangeText={v => actualizarSerie(serie.ejercicioId, serie.numSerie, 'repeticiones', v)}
                  editable={!serie.completada}
                />
                <TouchableOpacity
                  style={[styles.falloBoton, { flex: 0.5 }, serie.alFallo && styles.falloActivo]}
                  onPress={() => !serie.completada && actualizarSerie(serie.ejercicioId, serie.numSerie, 'alFallo', !serie.alFallo)}
                >
                  {/* CORRECCIÓN: siempre renderizar Text, cambiar contenido por condición */}
                  <Text style={styles.falloTexto}>{serie.alFallo ? '✓' : ' '}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.completarBoton, { flex: 0.8 }, serie.completada && styles.completadoBoton]}
                  onPress={() => !serie.completada && handleCompletarSerie(serie.ejercicioId, serie.numSerie)}
                  disabled={serie.completada}
                >
                  <Text style={styles.completarTexto}>{serie.completada ? '✓' : 'OK'}</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}
      </ScrollView>

      {/* Botón finalizar */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.botonFinalizar} onPress={handleFinalizarSesion}>
          <Text style={styles.botonFinalizarTexto}>Finalizar entrenamiento</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F3460' },
  centrado: { justifyContent: 'center', alignItems: 'center', padding: 24 },
  cargando: { color: '#fff', fontSize: 16 },
  tituloInicio: { fontSize: 28, fontWeight: 'bold', color: '#fff', marginBottom: 8 },
  subtituloInicio: { fontSize: 20, color: '#E94560', marginBottom: 8 },
  infoInicio: { fontSize: 16, color: '#888', marginBottom: 40 },
  botonIniciar: { backgroundColor: '#E94560', borderRadius: 14, paddingVertical: 18, paddingHorizontal: 48, marginBottom: 16 },
  botonIniciarTexto: { color: '#fff', fontSize: 20, fontWeight: 'bold' },
  botonVolver: { padding: 12 },
  botonVolverTexto: { color: '#888', fontSize: 16 },
  cabecera: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, backgroundColor: '#1A1A2E' },
  cabeceraTexto: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  cabeceraDia: { color: '#888', fontSize: 13 },
  tiempoContainer: { backgroundColor: '#16213E', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 6 },
  tiempoTexto: { color: '#E94560', fontSize: 20, fontWeight: 'bold', fontVariant: ['tabular-nums'] },
  descansoContainer: { backgroundColor: '#E94560', padding: 20, alignItems: 'center' },
  descansoTitulo: { color: '#fff', fontSize: 14, fontWeight: '600' },
  descansoTiempo: { color: '#fff', fontSize: 48, fontWeight: 'bold', fontVariant: ['tabular-nums'] },
  botonSaltar: { marginTop: 8, padding: 8 },
  botonSaltarTexto: { color: '#fff', fontSize: 14, opacity: 0.8 },
  selectorEjercicios: { maxHeight: 50, backgroundColor: '#1A1A2E', paddingHorizontal: 12, paddingVertical: 8 },
  selectorItem: { backgroundColor: '#16213E', borderRadius: 8, paddingHorizontal: 14, paddingVertical: 8, marginRight: 8 },
  selectorItemActivo: { backgroundColor: '#E94560' },
  selectorItemCompletado: { backgroundColor: '#10B981' },
  selectorTexto: { color: '#ccc', fontSize: 13 },
  selectorTextoActivo: { color: '#fff', fontWeight: 'bold' },
  seriesContainer: { flex: 1, padding: 16 },
  ejercicioNombre: { fontSize: 22, fontWeight: 'bold', color: '#fff', marginBottom: 4 },
  ejercicioInfo: { fontSize: 14, color: '#888', marginBottom: 16 },
  seriesCabecera: { flexDirection: 'row', marginBottom: 8, paddingHorizontal: 4 },
  seriesCabeceraTexto: { color: '#666', fontSize: 12, fontWeight: '600', textAlign: 'center' },
  serieFila: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#1A1A2E', borderRadius: 10, padding: 8, marginBottom: 6, gap: 6 },
  serieCompletada: { backgroundColor: '#1a2e1a', borderColor: '#10B981', borderWidth: 1 },
  serieNumero: { color: '#888', fontSize: 16, fontWeight: 'bold', textAlign: 'center' },
  serieInput: { backgroundColor: '#16213E', borderRadius: 8, padding: 10, color: '#fff', fontSize: 16, textAlign: 'center', borderWidth: 1, borderColor: '#2a2a4a' },
  falloBoton: { backgroundColor: '#16213E', borderRadius: 8, padding: 10, alignItems: 'center', borderWidth: 1, borderColor: '#2a2a4a' },
  falloActivo: { backgroundColor: '#E94560', borderColor: '#E94560' },
  falloTexto: { color: '#fff', fontSize: 14 },
  completarBoton: { backgroundColor: '#E94560', borderRadius: 8, padding: 10, alignItems: 'center' },
  completadoBoton: { backgroundColor: '#10B981' },
  completarTexto: { color: '#fff', fontSize: 14, fontWeight: 'bold' },
  footer: { padding: 16, backgroundColor: '#1A1A2E' },
  botonFinalizar: { backgroundColor: '#3a1520', borderRadius: 12, padding: 16, alignItems: 'center', borderWidth: 1, borderColor: '#E94560' },
  botonFinalizarTexto: { color: '#E94560', fontSize: 16, fontWeight: 'bold' }
});

export default EntrenamientoScreen;