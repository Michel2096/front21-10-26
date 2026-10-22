export interface LoginRequest {
    email: string;
    password: string;
}

export interface LoginResponse {
    success: boolean;
    message: string;
    flag?: boolean;
    token?: string;
    refreshToken?: string;
}

// lo que regresa GET /students/me (nombre y apellido solo vienen si es estudiante)
export interface Profile {
    kind: "user" | "student";
    id: number;
    email: string;
    nombre?: string;
    apellido?: string;
    matricula?: string;
}

export interface AuthState {
    token: string | null;
    refreshToken: string | null;
    profile: Profile | null;
    loading: boolean;
    error: string;
    sessionChecked: boolean;
}

export interface LoginFormProps {
    onLogin: (
        email: string,
        password: string
    ) => void;
    loading: boolean;
    error: string;
    onClearError: () => void;
}
