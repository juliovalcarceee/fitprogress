import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

interface Props {
  emoji: string;
  titulo: string;
  subtitulo: string;
  textoBoton?: string;
  onPress?: () => void;
}

const TarjetaVacia = ({ emoji, titulo, subtitulo, textoBoton, onPress }: Props) => {
  return (
    <View style={styles.container}>
      <Text style={styles.emoji}>{emoji}</Text>
      <Text style={styles.titulo}>{titulo}</Text>
      <Text style={styles.subtitulo}>{subtitulo}</Text>
      {textoBoton && onPress && (
        <TouchableOpacity style={styles.boton} onPress={onPress}>
          <Text style={styles.botonTexto}>{textoBoton}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    padding: 40,
    marginTop: 20
  },
  emoji: {
    fontSize: 64,
    marginBottom: 16
  },
  titulo: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
    textAlign: 'center'
  },
  subtitulo: {
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
    marginBottom: 20
  },
  boton: {
    backgroundColor: '#E94560',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 24
  },
  botonTexto: {
    color: '#fff',
    fontSize: 15,
    fontWeight: 'bold'
  }
});

export default TarjetaVacia;