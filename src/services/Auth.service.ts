import {LoginRequest, LoginResponse, Profile} from "@/interfaces/Auth.Interface";
import {API_ULR} from "@/constants/api";

export const loginService = async (
    data: LoginRequest
): Promise<LoginResponse> => {

    const response = await fetch(
        `${API_ULR}/auth/login`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
            },
            body: JSON.stringify(data),
        }
    );
    const result = await response.json();

    if (!response.ok) {
        return {
            success: false,
            // el api manda el mensaje en "error"
            message: result.error || result.message || "Usuario o contraseña incorrecta",
        };
    }

    return {
        success: true,
        message: result.message || "Usuario logeado",
        // el api regresa accessToken + refreshToken
        token: result.accessToken,
        refreshToken: result.refreshToken,
    };

};

// trae los datos del dueño del token, regresa null si el token ya no sirve
export const profileService = async (
    token: string
): Promise<Profile | null> => {

    const response = await fetch(
        `${API_ULR}/students/me`,
        {
            headers: {
                "Accept": "application/json",
                "Authorization": `Bearer ${token}`,
            },
        }
    );

    if (!response.ok) {
        return null;
    }

    const result = await response.json();
    return result.data;

};

// pide un access token nuevo con el refresh token, regresa null si ya no sirve
export const refreshService = async (
    refreshToken: string
): Promise<{ token: string; refreshToken: string } | null> => {

    const response = await fetch(
        `${API_ULR}/auth/refresh`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
            },
            body: JSON.stringify({refreshToken}),
        }
    );

    if (!response.ok) {
        return null;
    }

    const result = await response.json();
    return {token: result.accessToken, refreshToken: result.refreshToken};

};

export const logoutService = async (
    token: string,
    refreshToken: string | null
): Promise<void> => {

    await fetch(
        `${API_ULR}/auth/logout`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
                "Authorization": `Bearer ${token}`,
            },
            body: JSON.stringify({refreshToken}),
        }
    );

};
