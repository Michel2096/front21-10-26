/**
 * Tipos para el módulo de estudiantes
 */

export interface Student {
  id: number;
  nombre: string;
  apellido: string;
  matricula: string;
  email: string;
  created_at: string;
  updated_at: string;
}

/** Datos que la API exige para crear o actualizar (password obligatorio). */
export interface StudentInput {
  nombre: string;
  apellido: string;
  matricula: string;
  email: string;
  password: string;
}

export interface StudentListResponse {
  data: Student[];
}
