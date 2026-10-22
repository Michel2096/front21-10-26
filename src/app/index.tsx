import {
    StyleSheet,
    View
} from "react-native";

import { Redirect } from "expo-router";
import LoginForm from "../components/LoginForm";
import { useLogin } from "../hooks/useLogin";
import { useAppSelector } from "@/store/hooks";

export default function LoginScreen() {
    const token = useAppSelector((state) => state.auth.token);

    const {
        login,
        loading,
        error,
        clearError
    } = useLogin();

    // con sesion activa (recien logeado o token guardado) se manda al home
    if (token) {
        return <Redirect href="/home" />;
    }

    return (
        <View style={styles.container}>
            <LoginForm
                onLogin={(
                    email,
                    password
                ) =>
                    login({
                        email,
                        password
                    })
                }
                loading={loading}
                error={error}
                onClearError={clearError}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
    },
});
