import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Animated, Image } from 'react-native';

const SplashScreen = ({ onFinish }: { onFinish: () => void }) => {
  const opacidad = new Animated.Value(0);
  const escala = new Animated.Value(0.5);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacidad, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true
      }),
      Animated.spring(escala, {
        toValue: 1,
        friction: 4,
        useNativeDriver: true
      })
    ]).start();

    setTimeout(() => {
      Animated.timing(opacidad, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true
      }).start(() => onFinish());
    }, 2500);
  }, []);

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.contenido, { opacity: opacidad, transform: [{ scale: escala }] }]}>
        <Image source={require('../../assets/logo.png')} style={styles.logo} resizeMode="contain" />
      </Animated.View>
      <Text style={styles.version}>v1.0.0</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F3460',
    justifyContent: 'center',
    alignItems: 'center'
  },
  contenido: {
    alignItems: 'center'
  },
  logo: {
    width: 280,
    height: 280
  },
  version: {
    position: 'absolute',
    bottom: 40,
    color: '#555',
    fontSize: 13
  }
});

export default SplashScreen;