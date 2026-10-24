/**
 * Hook personalizado para manejo de autenticación
 * Encapsula login, logout, registro y manejo de tokens
 */

import { useState, useCallback, useEffect } from 'react';
import { useRouter } from 'expo-router';
import * as authApi from '../api/auth.api';
import { saveAccessToken, saveRefreshToken, getAccessToken, clearTokens } from '../utils/storage';
import { handleApiError, ApiError } from '../utils/errorHandler';
import { User } from '../types/user';

interface UseAuthState {
  user: User | null;
  loading: boolean;
  error: ApiError | null;
  isAuthenticated: boolean;
}

interface UseAuthReturn extends UseAuthState {
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
  clearError: () => void;
}

export function useAuth(): UseAuthReturn {
  const router = useRouter();
  const [state, setState] = useState<UseAuthState>({
    user: null,
    loading: false,
    error: null,
    isAuthenticated: false,
  });

  /**
   * Verifica si hay una sesión activa al cargar el hook
   */
  const checkAuth = useCallback(async () => {
    try {
      const token = await getAccessToken();
      if (!token) {
        setState((prev) => ({ ...prev, isAuthenticated: false }));
        return;
      }

      setState((prev) => ({ ...prev, loading: true }));
      const user = await authApi.getCurrentUser();
      setState({
        user,
        loading: false,
        error: null,
        isAuthenticated: true,
      });
    } catch (error) {
      setState({
        user: null,
        loading: false,
        error: null,
        isAuthenticated: false,
      });
    }
  }, []);

  /**
   * Inicia sesión con email y password
   */
  const login = useCallback(async (email: string, password: string): Promise<boolean> => {
    setState((prev) => ({ ...prev, loading: true, error: null }));

    try {
      const response = await authApi.login({ email, password });

      // Guardar tokens de forma segura
      await saveAccessToken(response.token);
      await saveRefreshToken(response.refreshToken);

      setState({
        user: response.user,
        loading: false,
        error: null,
        isAuthenticated: true,
      });

      return true;
    } catch (error) {
      const apiError = handleApiError(error);
      setState((prev) => ({
        ...prev,
        loading: false,
        error: apiError,
        isAuthenticated: false,
      }));
      return false;
    }
  }, []);

  /**
   * Registra un nuevo usuario
   */
  const register = useCallback(async (email: string, password: string): Promise<boolean> => {
    setState((prev) => ({ ...prev, loading: true, error: null }));

    try {
      await authApi.register({ email, password });

      // Después del registro, iniciar sesión automáticamente
      return await login(email, password);
    } catch (error) {
      const apiError = handleApiError(error);
      setState((prev) => ({
        ...prev,
        loading: false,
        error: apiError,
      }));
      return false;
    }
  }, [login]);

  /**
   * Cierra sesión y limpia tokens
   */
  const logout = useCallback(async () => {
    try {
      await authApi.logout();
    } catch (error) {
      // Ignorar errores de logout
    } finally {
      await clearTokens();
      setState({
        user: null,
        loading: false,
        error: null,
        isAuthenticated: false,
      });
      router.replace('/');
    }
  }, [router]);

  /**
   * Limpia el error del estado
   */
  const clearError = useCallback(() => {
    setState((prev) => ({ ...prev, error: null }));
  }, []);

  // Verificar autenticación al montar el componente
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return {
    ...state,
    login,
    register,
    logout,
    checkAuth,
    clearError,
  };
}
