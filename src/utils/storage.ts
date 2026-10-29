/**
 * Utilidades para almacenamiento seguro de tokens
 * Usa SecureStore de Expo en iOS/Android y localStorage en web
 * (SecureStore no está disponible en el navegador)
 */

import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';

const ACCESS_TOKEN_KEY = 'access_token';
const REFRESH_TOKEN_KEY = 'refresh_token';

const isWeb = Platform.OS === 'web';

async function setItem(key: string, value: string): Promise<void> {
  if (isWeb) {
    globalThis.localStorage?.setItem(key, value);
    return;
  }
  await SecureStore.setItemAsync(key, value);
}

async function getItem(key: string): Promise<string | null> {
  if (isWeb) return globalThis.localStorage?.getItem(key) ?? null;
  return await SecureStore.getItemAsync(key);
}

async function deleteItem(key: string): Promise<void> {
  if (isWeb) {
    globalThis.localStorage?.removeItem(key);
    return;
  }
  await SecureStore.deleteItemAsync(key);
}

/**
 * Guarda el access token de forma segura
 */
export async function saveAccessToken(token: string): Promise<void> {
  await setItem(ACCESS_TOKEN_KEY, token);
}

/**
 * Obtiene el access token almacenado
 */
export async function getAccessToken(): Promise<string | null> {
  return await getItem(ACCESS_TOKEN_KEY);
}

/**
 * Guarda el refresh token de forma segura
 */
export async function saveRefreshToken(token: string): Promise<void> {
  await setItem(REFRESH_TOKEN_KEY, token);
}

/**
 * Obtiene el refresh token almacenado
 */
export async function getRefreshToken(): Promise<string | null> {
  return await getItem(REFRESH_TOKEN_KEY);
}

/**
 * Elimina todos los tokens almacenados (logout)
 */
export async function clearTokens(): Promise<void> {
  await deleteItem(ACCESS_TOKEN_KEY);
  await deleteItem(REFRESH_TOKEN_KEY);
}
