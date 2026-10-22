import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";
import {AuthState, LoginRequest, Profile} from "@/interfaces/Auth.Interface";
import {loginService, logoutService, profileService, refreshService} from "@/services/Auth.service";
import {
    deleteToken,
    getRefreshToken,
    getToken,
    saveRefreshToken,
    saveToken
} from "@/services/Token.service";

interface Session {
    token: string;
    refreshToken: string | null;
    profile: Profile;
}

interface Tokens {
    token: string;
    refreshToken: string;
}

const initialState: AuthState = {
    token: null,
    refreshToken: null,
    profile: null,
    loading: false,
    error: "",
    sessionChecked: false,
};

const createAuthThunk = createAsyncThunk.withTypes<{
    state: { auth: AuthState };
    rejectValue: string;
}>();

export const loginUser = createAuthThunk<Session, LoginRequest>(
    "auth/login",
    async (data, {rejectWithValue}) => {
        try {
            const response = await loginService(data);
            if (!response.success || !response.token) {
                return rejectWithValue(response.message);
            }

            const profile = await profileService(response.token);
            if (!profile) {
                return rejectWithValue("No se pudo cargar el perfil");
            }

            // lo unico que se guarda en el dispositivo son los tokens
            await saveToken(response.token);
            if (response.refreshToken) {
                await saveRefreshToken(response.refreshToken);
            }
            return {
                token: response.token,
                refreshToken: response.refreshToken ?? null,
                profile,
            };
        } catch (error) {
            return rejectWithValue("Ocurrio un error");
        }
    },
    {
        // si ya se esta enviando no hacemos nada (evita muchos clics)
        condition: (_, {getState}) => !getState().auth.loading,
    }
);

// al abrir la app: si hay token guardado se vuelve a pedir el perfil al api
export const restoreSession = createAuthThunk<Session | null>(
    "auth/restoreSession",
    async () => {
        try {
            let token = await getToken();
            let refreshToken = await getRefreshToken();
            if (!token) {
                return null;
            }

            let profile = await profileService(token);

            // el access token dura poco, si ya vencio se pide otro con el refresh token
            if (!profile && refreshToken) {
                const tokens = await refreshService(refreshToken);
                if (tokens) {
                    token = tokens.token;
                    refreshToken = tokens.refreshToken;
                    await saveToken(token);
                    await saveRefreshToken(refreshToken);
                    profile = await profileService(token);
                }
            }

            if (!profile) {
                await deleteToken();
                return null;
            }

            return {token, refreshToken, profile};
        } catch (error) {
            return null;
        }
    }
);

export const logoutUser = createAuthThunk<void>(
    "auth/logout",
    async (_, {getState}) => {
        const {token, refreshToken} = getState().auth;
        try {
            if (token) {
                await logoutService(token, refreshToken);
            }
        } catch (error) {
            // aunque falle el api, se cierra la sesion en la app
        }
        await deleteToken();
    }
);

const closeSession = (state: AuthState) => {
    state.token = null;
    state.refreshToken = null;
    state.profile = null;
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        // borra el error que mando el api
        clearError: (state) => {
            state.error = "";
        },
        // cuando un servicio renueva los tokens con /auth/refresh
        tokensRefreshed: (state, action: PayloadAction<Tokens>) => {
            state.token = action.payload.token;
            state.refreshToken = action.payload.refreshToken;
        },
        // el refresh token ya no sirve, se cierra la sesion en la app
        sessionExpired: closeSession,
    },
    extraReducers: (builder) => {
        builder
            .addCase(loginUser.pending, (state) => {
                state.loading = true;
                state.error = "";
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.loading = false;
                state.token = action.payload.token;
                state.refreshToken = action.payload.refreshToken;
                state.profile = action.payload.profile;
            })
            .addCase(loginUser.rejected, (state, action) => {
                // cuando se cancela por "condition" no hay nada que cambiar
                if (action.meta.condition) {
                    return;
                }
                state.loading = false;
                state.error = action.payload || "Ocurrio un error";
            })
            .addCase(restoreSession.fulfilled, (state, action) => {
                state.sessionChecked = true;
                if (action.payload) {
                    state.token = action.payload.token;
                    state.refreshToken = action.payload.refreshToken;
                    state.profile = action.payload.profile;
                }
            })
            .addCase(restoreSession.rejected, (state) => {
                state.sessionChecked = true;
            })
            .addCase(logoutUser.fulfilled, closeSession)
            .addCase(logoutUser.rejected, closeSession);
    },
});

export const {clearError, tokensRefreshed, sessionExpired} = authSlice.actions;

// los usuarios de registro no tienen nombre, se usa lo que va antes del @
export const selectDisplayName = (state: { auth: AuthState }): string => {
    const profile = state.auth.profile;
    if (!profile) {
        return "";
    }
    if (profile.nombre) {
        return `${profile.nombre} ${profile.apellido ?? ""}`.trim();
    }
    return profile.email.split("@")[0];
};

export const selectEmail = (state: { auth: AuthState }): string =>
    state.auth.profile?.email ?? "";

export default authSlice.reducer;
