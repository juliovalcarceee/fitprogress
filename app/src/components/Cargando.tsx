import React from 'react';
import { View, ActivityIndicator, Text, StyleSheet } from 'react-native';

interface Props {
  mensaje?: string;
}

const Cargando = ({ mensaje = 'Cargando...' }: Props) => {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#E94560" />
      <Text style={styles.texto}>{mensaje}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0F3460'
  },
  texto: {
    color: '#888',
    fontSize: 14,
    marginTop: 12
  }
});

export default Cargando;