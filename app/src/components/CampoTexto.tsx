import React from 'react';
import { View, Text, TextInput, StyleSheet, TextInputProps } from 'react-native';

interface Props extends TextInputProps {
  label: string;
  error?: string;
}

const CampoTexto = ({ label, error, ...props }: Props) => {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={[styles.input, error && styles.inputError]}
        placeholderTextColor="#666"
        {...props}
      />
      {error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 14
  },
  label: {
    color: '#fff',
    fontSize: 14,
    marginBottom: 6
  },
  input: {
    backgroundColor: '#16213E',
    borderRadius: 10,
    padding: 14,
    color: '#fff',
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#2a2a4a'
  },
  inputError: {
    borderColor: '#E94560'
  },
  error: {
    color: '#E94560',
    fontSize: 12,
    marginTop: 4
  }
});

export default CampoTexto;