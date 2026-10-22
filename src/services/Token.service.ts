import {Platform} from "react-native";
import * as SecureStore from "expo-secure-store";

const TOKEN_KEY = "auth_token";
const REFRESH_TOKEN_KEY = "auth_refresh_token";

// expo-secure-store no funciona en web, ahi se usa localStorage
const isWeb = Platform.OS === "web";

const setItem = async (key: string, value: string): Promise<void> => {
    if (isWeb) {
        localStorage.setItem(key, value);
        return;
    }
    await SecureStore.setItemAsync(key, value);
};

const getItem = async (key: string): Promise<string | null> => {
    if (isWeb) {
        return localStorage.getItem(key);
    }
    return SecureStore.getItemAsync(key);
};

const deleteItem = async (key: string): Promise<void> => {
    if (isWeb) {
        localStorage.removeItem(key);
        return;
    }
    await SecureStore.deleteItemAsync(key);
};

export const saveToken = (token: string) => setItem(TOKEN_KEY, token);
export const getToken = () => getItem(TOKEN_KEY);

export const saveRefreshToken = (token: string) => setItem(REFRESH_TOKEN_KEY, token);
export const getRefreshToken = () => getItem(REFRESH_TOKEN_KEY);

export const deleteToken = async (): Promise<void> => {
    await deleteItem(TOKEN_KEY);
    await deleteItem(REFRESH_TOKEN_KEY);
};
