import {useCallback, useEffect, useState} from "react";
import {ApiResult, Student, StudentInput} from "@/interfaces/Student.Interface";
import {
    createStudentService,
    deleteStudentService,
    listStudentsService,
    updateStudentService
} from "@/services/Student.service";
import {refreshService} from "@/services/Auth.service";
import {deleteToken, saveRefreshToken, saveToken} from "@/services/Token.service";
import {sessionExpired, tokensRefreshed} from "@/store/authSlice";
import {useAppDispatch, useAppSelector} from "@/store/hooks";

export const useStudents = () => {
    const dispatch = useAppDispatch();
    const token = useAppSelector((state) => state.auth.token);
    const refreshToken = useAppSelector((state) => state.auth.refreshToken);

    const [students, setStudents] = useState<Student[]>([]);
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    // si el access token vencio (401) se pide otro con el refresh token y se reintenta
    const withAuth = useCallback(async <T>(
        call: (token: string) => Promise<ApiResult<T>>
    ): Promise<ApiResult<T>> => {
        const result = await call(token ?? "");
        if (result.status !== 401 || !refreshToken) {
            return result;
        }

        const tokens = await refreshService(refreshToken);
        if (!tokens) {
            await deleteToken();
            dispatch(sessionExpired());
            return result;
        }

        await saveToken(tokens.token);
        await saveRefreshToken(tokens.refreshToken);
        dispatch(tokensRefreshed(tokens));
        return call(tokens.token);
    }, [token, refreshToken, dispatch]);

    const load = useCallback(async () => {
        setLoading(true);
        setError("");
        try {
            const result = await withAuth(listStudentsService);
            if (result.ok) {
                setStudents(result.data ?? []);
            } else {
                setError(result.message);
            }
        } catch (e) {
            setError("No se pudo conectar con el servidor");
        } finally {
            setLoading(false);
        }
    }, [withAuth]);

    // regresa true si se guardo para que la pantalla cierre el formulario
    const save = async (data: StudentInput, id?: number): Promise<boolean> => {
        if (saving) {
            return false;
        }
        setSaving(true);
        setError("");
        try {
            const result = await withAuth((t) =>
                id ? updateStudentService(t, id, data) : createStudentService(t, data)
            );
            if (!result.ok) {
                setError(result.message);
                return false;
            }
            await load();
            return true;
        } catch (e) {
            setError("No se pudo conectar con el servidor");
            return false;
        } finally {
            setSaving(false);
        }
    };

    const remove = async (id: number): Promise<void> => {
        setError("");
        try {
            const result = await withAuth((t) => deleteStudentService(t, id));
            if (!result.ok) {
                setError(result.message);
                return;
            }
            setStudents((list) => list.filter((s) => s.id !== id));
        } catch (e) {
            setError("No se pudo conectar con el servidor");
        }
    };

    useEffect(() => {
        if (token) {
            load();
        }
        // solo al entrar a la pantalla
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return {students, loading, saving, error, load, save, remove, clearError: () => setError("")};
};
