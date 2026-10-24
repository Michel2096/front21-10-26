/**
 * Componente de mensaje de error
 * Muestra errores de forma amigable al usuario
 */

import React, { useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { ApiError } from '../utils/errorHandler';

interface ErrorMessageProps {
  error: ApiError | string;
  onRetry?: () => void;
}

export default function ErrorMessage({ error, onRetry }: ErrorMessageProps) {
  const message = typeof error === 'string' ? error : error.message;

  const handleRetry = useCallback(() => {
    if (onRetry) {
      Alert.alert(
        'Reintentar',
        '¿Seguro que deseas intentar de nuevo?',
        [
          { text: 'Cancelar', style: 'cancel' },
          { text: 'Sí', onPress: onRetry }
        ]
      );
    }
  }, [onRetry]);

  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <Text style={styles.icon}>⚠️</Text>
      </View>
      <Text style={styles.title}>¡Oops!</Text>
      <Text style={styles.message}>{message}</Text>
      {onRetry && (
        <TouchableOpacity style={styles.retryButton} onPress={handleRetry}>
          <Text style={styles.retryText}>Intentar de nuevo</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  iconContainer: {
    marginBottom: 16,
  },
  icon: {
    fontSize: 48,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 8,
  },
  message: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 24,
  },
  retryButton: {
    backgroundColor: '#3B82F6',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
