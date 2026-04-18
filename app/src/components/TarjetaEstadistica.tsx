import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface Props {
  icono: keyof typeof Ionicons.glyphMap;
  valor: string | number;
  etiqueta: string;
  color?: string;
}

const TarjetaEstadistica = ({ icono, valor, etiqueta, color = '#E94560' }: Props) => {
  return (
    <View style={styles.tarjeta}>
      <Ionicons name={icono} size={24} color={color} />
      <Text style={[styles.valor, { color }]}>{valor}</Text>
      <Text style={styles.etiqueta}>{etiqueta}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  tarjeta: {
    flex: 1,
    backgroundColor: '#1A1A2E',
    borderRadius: 14,
    padding: 16,
    alignItems: 'center'
  },
  valor: {
    fontSize: 28,
    fontWeight: 'bold',
    marginTop: 6
  },
  etiqueta: {
    fontSize: 12,
    color: '#888',
    marginTop: 4
  }
});

export default TarjetaEstadistica;