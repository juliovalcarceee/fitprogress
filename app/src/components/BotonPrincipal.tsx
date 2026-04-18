import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';

interface Props {
  texto: string;
  onPress: () => void;
  cargando?: boolean;
  desactivado?: boolean;
  variante?: 'primario' | 'secundario' | 'peligro';
  tamano?: 'grande' | 'mediano' | 'pequeno';
}

const BotonPrincipal = ({ texto, onPress, cargando, desactivado, variante = 'primario', tamano = 'grande' }: Props) => {
  const estiloVariante = {
    primario: { fondo: '#E94560', texto: '#fff' },
    secundario: { fondo: '#16213E', texto: '#ccc' },
    peligro: { fondo: '#3a1520', texto: '#E94560' }
  };

  const estiloTamano = {
    grande: { padding: 16, fontSize: 18 },
    mediano: { padding: 12, fontSize: 15 },
    pequeno: { padding: 8, fontSize: 13 }
  };

  const colores = estiloVariante[variante];
  const dimensiones = estiloTamano[tamano];

  return (
    <TouchableOpacity
      style={[
        styles.boton,
        { backgroundColor: colores.fondo, padding: dimensiones.padding },
        (cargando || desactivado) && styles.desactivado
      ]}
      onPress={onPress}
      disabled={cargando || desactivado}
    >
      {cargando ? (
        <ActivityIndicator color={colores.texto} />
      ) : (
        <Text style={[styles.texto, { color: colores.texto, fontSize: dimensiones.fontSize }]}>
          {texto}
        </Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  boton: {
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center'
  },
  desactivado: {
    opacity: 0.6
  },
  texto: {
    fontWeight: 'bold'
  }
});

export default BotonPrincipal;