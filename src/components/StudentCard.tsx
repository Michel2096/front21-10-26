/**
 * Componente de tarjeta de estudiante
 * Muestra la información básica de un estudiante en formato de tarjeta
 */

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Student } from '../types/student';

interface StudentCardProps {
  student: Student;
  onPress?: (student: Student) => void;
}

export default function StudentCard({ student, onPress }: StudentCardProps) {
  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => onPress?.(student)}
      activeOpacity={0.7}
    >
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {student.nombre.charAt(0)}{student.apellido.charAt(0)}
          </Text>
        </View>
        <View style={styles.info}>
          <Text style={styles.name}>
            {student.nombre} {student.apellido}
          </Text>
          <Text style={styles.matricula}>Matrícula: {student.matricula}</Text>
        </View>
      </View>
      <View style={styles.divider} />
      <View style={styles.footer}>
        <Text style={styles.label}>Email:</Text>
        <Text style={styles.email}>{student.email}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#3B82F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  matricula: {
    fontSize: 14,
    color: '#6B7280',
  },
  divider: {
    height: 1,
    backgroundColor: '#E5E7EB',
    marginVertical: 12,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  label: {
    fontSize: 14,
    color: '#6B7280',
    marginRight: 6,
  },
  email: {
    fontSize: 14,
    color: '#3B82F6',
  },
});
