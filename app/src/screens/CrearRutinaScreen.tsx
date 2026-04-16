import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Alert, Modal, FlatList } from 'react-native';
import { obtenerEjercicios, crearRutina, actualizarRutina, obtenerRutinaPorId } from '../services/api';
import { Ejercicio } from '../types/types';

const diasSemana = [
  { num: 1, nombre: 'Lunes', corto: 'L' },
  { num: 2, nombre: 'Martes', corto: 'M' },
  { num: 3, nombre: 'Miércoles', corto: 'X' },
  { num: 4, nombre: 'Jueves', corto: 'J' },
  { num: 5, nombre: 'Viernes', corto: 'V' },
  { num: 6, nombre: 'Sábado', corto: 'S' },
  { num: 7, nombre: 'Domingo', corto: 'D' }
];

interface EjercicioRutina {
  ejercicioId: number;
  ejercicio?: Ejercicio;
  diaSemana: number;
  orden: number;
  seriesObjetivo: number;
  repeticionesObj: string;
  descansoSeg: number;
  notas?: string;
}

const CrearRutinaScreen = ({ route, navigation }: any) => {
  const rutinaIdEditar = route.params?.rutinaId;
  const esEdicion = !!rutinaIdEditar;

  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [ejerciciosRutina, setEjerciciosRutina] = useState<EjercicioRutina[]>([]);
  const [diaSeleccionado, setDiaSeleccionado] = useState(1);
  const [modalVisible, setModalVisible] = useState(false);
  const [ejerciciosDisponibles, setEjerciciosDisponibles] = useState<Ejercicio[]>([]);
  const [busqueda, setBusqueda] = useState('');
  const [cargando, setCargando] = useState(false);

  useEffect(() => {
    cargarEjerciciosDisponibles();
    if (esEdicion) {
      cargarRutina();
    }
  }, []);

  const cargarEjerciciosDisponibles = async () => {
    try {
      const respuesta = await obtenerEjercicios();
      setEjerciciosDisponibles(respuesta.data);
    } catch (error) {
      console.log('Error al cargar ejercicios');
    }
  };

  const cargarRutina = async () => {
    try {
      const respuesta = await obtenerRutinaPorId(rutinaIdEditar);
      setNombre(respuesta.data.nombre);
      setDescripcion(respuesta.data.descripcion || '');
      const ejercicios = respuesta.data.rutinaEjercicios?.map((re: any) => ({
        ejercicioId: re.ejercicioId,
        ejercicio: re.ejercicio,
        diaSemana: re.diaSemana,
        orden: re.orden,
        seriesObjetivo: re.seriesObjetivo,
        repeticionesObj: re.repeticionesObj,
        descansoSeg: re.descansoSeg,
        notas: re.notas
      })) || [];
      setEjerciciosRutina(ejercicios);
    } catch (error) {
      Alert.alert('Error', 'No se pudo cargar la rutina');
      navigation.goBack();
    }
  };

  const anadirEjercicio = (ejercicio: Ejercicio) => {
    const ejerciciosDelDia = ejerciciosRutina.filter(e => e.diaSemana === diaSeleccionado);
    const nuevoOrden = ejerciciosDelDia.length + 1;

    setEjerciciosRutina(prev => [...prev, {
      ejercicioId: ejercicio.id,
      ejercicio,
      diaSemana: diaSeleccionado,
      orden: nuevoOrden,
      seriesObjetivo: 3,
      repeticionesObj: '12',
      descansoSeg: 60
    }]);
    setModalVisible(false);
    setBusqueda('');
  };

  const eliminarEjercicio = (index: number) => {
    setEjerciciosRutina(prev => prev.filter((_, i) => i !== index));
  };

  const actualizarEjercicio = (index: number, campo: string, valor: any) => {
    setEjerciciosRutina(prev => prev.map((e, i) =>
      i === index ? { ...e, [campo]: valor } : e
    ));
  };

  const handleGuardar = async () => {
    if (!nombre.trim()) {
      Alert.alert('Error', 'Introduce un nombre para la rutina');
      return;
    }

    if (ejerciciosRutina.length === 0) {
      Alert.alert('Error', 'Añade al menos un ejercicio');
      return;
    }

    setCargando(true);
    try {
      const datos = {
        nombre: nombre.trim(),
        descripcion: descripcion.trim(),
        ejercicios: ejerciciosRutina.map(e => ({
          ejercicioId: e.ejercicioId,
          diaSemana: e.diaSemana,
          orden: e.orden,
          seriesObjetivo: e.seriesObjetivo,
          repeticionesObj: e.repeticionesObj,
          descansoSeg: e.descansoSeg,
          notas: e.notas
        }))
      };

      if (esEdicion) {
        await actualizarRutina(rutinaIdEditar, datos);
        Alert.alert('Éxito', 'Rutina actualizada correctamente');
      } else {
        await crearRutina(datos);
        Alert.alert('Éxito', 'Rutina creada correctamente');
      }

      navigation.goBack();
    } catch (error: any) {
      Alert.alert('Error', error.response?.data?.error || 'Error al guardar rutina');
    } finally {
      setCargando(false);
    }
  };

  const ejerciciosDelDia = ejerciciosRutina.filter(e => e.diaSemana === diaSeleccionado);
  const ejerciciosFiltrados = ejerciciosDisponibles.filter(e =>
    !busqueda || e.nombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scroll}>
        <View style={styles.seccion}>
          <Text style={styles.label}>Nombre de la rutina</Text>
          <TextInput
            style={styles.input}
            placeholder="Ej: Push Pull Legs"
            placeholderTextColor="#666"
            value={nombre}
            onChangeText={setNombre}
          />

          <Text style={styles.label}>Descripción (opcional)</Text>
          <TextInput
            style={[styles.input, styles.inputMultilinea]}
            placeholder="Describe tu rutina..."
            placeholderTextColor="#666"
            value={descripcion}
            onChangeText={setDescripcion}
            multiline
          />
        </View>

        <View style={styles.seccion}>
          <Text style={styles.label}>Días de entrenamiento</Text>
          <View style={styles.diasContainer}>
            {diasSemana.map(dia => {
              const numEjercicios = ejerciciosRutina.filter(e => e.diaSemana === dia.num).length;
              return (
                <TouchableOpacity
                  key={dia.num}
                  style={[
                    styles.diaBoton,
                    diaSeleccionado === dia.num && styles.diaBotonActivo,
                    numEjercicios > 0 && styles.diaBotonConEjercicios
                  ]}
                  onPress={() => setDiaSeleccionado(dia.num)}
                >
                  <Text style={[
                    styles.diaCorto,
                    diaSeleccionado === dia.num && styles.diaActivoTexto
                  ]}>
                    {dia.corto}
                  </Text>
                  {numEjercicios > 0 && (
                    <Text style={styles.diaBadge}>{numEjercicios}</Text>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        <View style={styles.seccion}>
          <View style={styles.seccionCabecera}>
            <Text style={styles.seccionTitulo}>
              {diasSemana.find(d => d.num === diaSeleccionado)?.nombre}
            </Text>
            <TouchableOpacity style={styles.botonAnadir} onPress={() => setModalVisible(true)}>
              <Text style={styles.botonAnadirTexto}>+ Añadir ejercicio</Text>
            </TouchableOpacity>
          </View>

          {ejerciciosDelDia.length === 0 ? (
            <View style={styles.diaVacio}>
              <Text style={styles.diaVacioTexto}>Día de descanso</Text>
              <Text style={styles.diaVacioSubtexto}>Añade ejercicios para este día</Text>
            </View>
          ) : (
            ejerciciosDelDia.map((ej, idx) => {
              const indexReal = ejerciciosRutina.findIndex(e =>
                e.ejercicioId === ej.ejercicioId && e.diaSemana === ej.diaSemana && e.orden === ej.orden
              );
              return (
                <View key={`${ej.ejercicioId}-${ej.orden}`} style={styles.ejercicioTarjeta}>
                  <View style={styles.ejercicioCabecera}>
                    <Text style={styles.ejercicioNombre}>{ej.ejercicio?.nombre}</Text>
                    <TouchableOpacity onPress={() => eliminarEjercicio(indexReal)}>
                      <Text style={styles.botonEliminar}>✕</Text>
                    </TouchableOpacity>
                  </View>

                  <View style={styles.camposEjercicio}>
                    <View style={styles.campoContainer}>
                      <Text style={styles.campoLabel}>Series</Text>
                      <TextInput
                        style={styles.campoInput}
                        keyboardType="number-pad"
                        value={ej.seriesObjetivo.toString()}
                        onChangeText={v => actualizarEjercicio(indexReal, 'seriesObjetivo', parseInt(v) || 0)}
                      />
                    </View>
                    <View style={styles.campoContainer}>
                      <Text style={styles.campoLabel}>Reps</Text>
                      <TextInput
                        style={styles.campoInput}
                        value={ej.repeticionesObj}
                        onChangeText={v => actualizarEjercicio(indexReal, 'repeticionesObj', v)}
                      />
                    </View>
                    <View style={styles.campoContainer}>
                      <Text style={styles.campoLabel}>Descanso (s)</Text>
                      <TextInput
                        style={styles.campoInput}
                        keyboardType="number-pad"
                        value={ej.descansoSeg.toString()}
                        onChangeText={v => actualizarEjercicio(indexReal, 'descansoSeg', parseInt(v) || 0)}
                      />
                    </View>
                  </View>
                </View>
              );
            })
          )}
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.botonGuardar, cargando && { opacity: 0.6 }]}
          onPress={handleGuardar}
          disabled={cargando}
        >
          <Text style={styles.botonGuardarTexto}>
            {cargando ? 'Guardando...' : (esEdicion ? 'Guardar cambios' : 'Crear rutina')}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Modal selector de ejercicios */}
      <Modal visible={modalVisible} animationType="slide" onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modal}>
          <View style={styles.modalCabecera}>
            <Text style={styles.modalTitulo}>Seleccionar ejercicio</Text>
            <TouchableOpacity onPress={() => setModalVisible(false)}>
              <Text style={styles.modalCerrar}>✕</Text>
            </TouchableOpacity>
          </View>

          <TextInput
            style={styles.modalBuscador}
            placeholder="Buscar ejercicio..."
            placeholderTextColor="#666"
            value={busqueda}
            onChangeText={setBusqueda}
          />

          <FlatList
            data={ejerciciosFiltrados}
            keyExtractor={item => item.id.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.modalEjercicio}
                onPress={() => anadirEjercicio(item)}
              >
                <View style={{ flex: 1 }}>
                  <Text style={styles.modalEjercicioNombre}>{item.nombre}</Text>
                  <Text style={styles.modalEjercicioGrupo}>{item.grupoMuscular}</Text>
                </View>
                <Text style={styles.modalAnadir}>+</Text>
              </TouchableOpacity>
            )}
          />
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F3460' },
  scroll: { flex: 1 },
  seccion: { padding: 16 },
  seccionCabecera: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  seccionTitulo: { fontSize: 18, fontWeight: 'bold', color: '#fff' },
  label: { color: '#fff', fontSize: 14, marginBottom: 6, marginTop: 8 },
  input: { backgroundColor: '#1A1A2E', borderRadius: 10, padding: 12, color: '#fff', fontSize: 15, borderWidth: 1, borderColor: '#2a2a4a' },
  inputMultilinea: { minHeight: 70, textAlignVertical: 'top' },
  diasContainer: { flexDirection: 'row', gap: 6 },
  diaBoton: { flex: 1, backgroundColor: '#1A1A2E', borderRadius: 10, padding: 12, alignItems: 'center', borderWidth: 1, borderColor: '#2a2a4a' },
  diaBotonActivo: { backgroundColor: '#E94560', borderColor: '#E94560' },
  diaBotonConEjercicios: { borderColor: '#10B981' },
  diaCorto: { color: '#ccc', fontSize: 16, fontWeight: 'bold' },
  diaActivoTexto: { color: '#fff' },
  diaBadge: { color: '#10B981', fontSize: 10, fontWeight: 'bold', marginTop: 2 },
  botonAnadir: { backgroundColor: '#E94560', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 6 },
  botonAnadirTexto: { color: '#fff', fontWeight: 'bold', fontSize: 12 },
  diaVacio: { backgroundColor: '#1A1A2E', borderRadius: 12, padding: 24, alignItems: 'center' },
  diaVacioTexto: { color: '#fff', fontSize: 16, fontWeight: 'bold', marginBottom: 4 },
  diaVacioSubtexto: { color: '#888', fontSize: 13 },
  ejercicioTarjeta: { backgroundColor: '#1A1A2E', borderRadius: 12, padding: 14, marginBottom: 10 },
  ejercicioCabecera: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  ejercicioNombre: { color: '#fff', fontSize: 15, fontWeight: 'bold', flex: 1 },
  botonEliminar: { color: '#E94560', fontSize: 20, padding: 4 },
  camposEjercicio: { flexDirection: 'row', gap: 8 },
  campoContainer: { flex: 1 },
  campoLabel: { color: '#888', fontSize: 11, marginBottom: 4 },
  campoInput: { backgroundColor: '#16213E', borderRadius: 6, padding: 8, color: '#fff', fontSize: 14, textAlign: 'center' },
  footer: { padding: 16, backgroundColor: '#1A1A2E' },
  botonGuardar: { backgroundColor: '#E94560', borderRadius: 12, padding: 16, alignItems: 'center' },
  botonGuardarTexto: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  modal: { flex: 1, backgroundColor: '#0F3460' },
  modalCabecera: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, backgroundColor: '#1A1A2E' },
  modalTitulo: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  modalCerrar: { color: '#E94560', fontSize: 24, padding: 4 },
  modalBuscador: { backgroundColor: '#1A1A2E', margin: 16, marginBottom: 8, padding: 12, borderRadius: 10, color: '#fff', borderWidth: 1, borderColor: '#2a2a4a' },
  modalEjercicio: { flexDirection: 'row', backgroundColor: '#1A1A2E', padding: 14, marginHorizontal: 16, marginBottom: 8, borderRadius: 10, alignItems: 'center' },
  modalEjercicioNombre: { color: '#fff', fontSize: 15, fontWeight: '600' },
  modalEjercicioGrupo: { color: '#888', fontSize: 12, textTransform: 'capitalize', marginTop: 2 },
  modalAnadir: { color: '#E94560', fontSize: 28, fontWeight: 'bold' }
});

export default CrearRutinaScreen;