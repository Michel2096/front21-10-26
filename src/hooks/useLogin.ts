import { useState } from "react";
import * as authApi from "../api/auth.api";
import { LoginRequest } from "../interfaces/auth.interface";
import { saveAccessToken, saveRefreshToken } from "../utils/storage";
import { handleApiError } from "../utils/errorHandler";

export const useLogin = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const login =  async (
      data: LoginRequest
    ): Promise<boolean> => {
        try {
            setLoading(true);
            setError("");
            // Usa el cliente Axios y guarda los tokens para las peticiones protegidas
            const response = await authApi.login(data);
            await saveAccessToken(response.accessToken);
            await saveRefreshToken(response.refreshToken);
            return true;
        } catch (error) {
            setError(handleApiError(error).message);
            return false;
        } finally {
            setLoading(false);
        }
    };

    return {
        login,
        loading,
        error
    };
};
