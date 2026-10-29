/**
 * Tipos para el módulo de usuario
 */

export interface User {
  id: number;
  email: string;
  kind?: 'user' | 'student';
  nombre?: string;
  apellido?: string;
}

export interface UserMeResponse {
  data: User;
}
