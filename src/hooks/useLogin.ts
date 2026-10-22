import {LoginRequest} from "@/interfaces/Auth.Interface";
import {clearError as clearAuthError, loginUser} from "@/store/authSlice";
import {useAppDispatch, useAppSelector} from "@/store/hooks";

export const useLogin = () => {
    const dispatch = useAppDispatch();
    const loading = useAppSelector((state) => state.auth.loading);
    const error = useAppSelector((state) => state.auth.error);

    const login = async (
        data: LoginRequest
    ): Promise<boolean> => {
        const result = await dispatch(loginUser(data));
        return loginUser.fulfilled.match(result);
    };

    // borra el error que mando el api
    const clearError = () => {
        if (error !== "") {
            dispatch(clearAuthError());
        }
    };

    return {login, loading, error, clearError};
};
