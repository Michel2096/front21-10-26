/**
 * Componente de indicador de carga
 * Muestra un spinner mientras se cargan datos
 */

import React, { useEffect, useRef } from 'react';
import { View, ActivityIndicator, Text, StyleSheet, Animated } from 'react-native';

interface LoadingProps {
  message?: string;
  size?: 'small' | 'large';
}

export default function Loading({ message = 'Cargando...', size = 'large' }: LoadingProps) {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, []);

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <ActivityIndicator size={size} color="#3B82F6" />
      {message && <Text style={styles.message}>{message}</Text>}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  message: {
    marginTop: 12,
    fontSize: 16,
    color: '#6B7280',
  },
});
