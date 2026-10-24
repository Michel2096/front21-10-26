/**
 * Tipos para el módulo de usuario
 */

export interface User {
  id: number;
  email: string;
}

export interface UserMeResponse {
  user: User;
}
