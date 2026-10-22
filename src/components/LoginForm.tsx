import { useState } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    ActivityIndicator,
} from "react-native";

import { LoginFormProps } from "@/interfaces/Auth.Interface";

export default function LoginForm({
                                      onLogin,
                                      loading,
                                      error,
                                      onClearError,
                                  }: LoginFormProps) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [emailError, setEmailError] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [showPassword, setShowPassword] = useState(false);

   
    const handleEmailChange = (text: string) => {
        setEmail(text);
        setEmailError("");
        onClearError();
    };

    const handlePasswordChange = (text: string) => {
        setPassword(text);
        setPasswordError("");
        onClearError();
    };

    const handleLogin = () => {
        
        if (loading) {
            return;
        }

        // limpiar errores anteriores si se tiene en un email o una contraseña
        setEmailError("");
        setPasswordError("");
        onClearError();

        let hayError = false;

        if (email.trim() === "") {
            setEmailError("El usuario es obligatorio");
            hayError = true;
        }

        if (password === "") {
            setPasswordError("La contraseña es obligatoria");
            hayError = true;
        }

        if (hayError) {
            return;
        }

        onLogin(email.trim(), password);
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>
                Iniciar sesión
            </Text>

            {error ? (
                <View style={styles.errorContainer}>
                    <Text style={styles.error}>
                        ⚠ {error}
                    </Text>
                </View>
            ) : null}

            <TextInput
                style={[
                    styles.input,
                    emailError !== "" && styles.inputError,
                ]}
                placeholder="Usuario"
                value={email}
                onChangeText={handleEmailChange}
                autoCapitalize="none"
                editable={!loading}
                placeholderTextColor="#999"
            />
            {emailError !== "" ? (
                <Text style={styles.fieldError}>
                    {emailError}
                </Text>
            ) : null}

            <TextInput
                style={[
                    styles.input,
                    passwordError !== "" && styles.inputError,
                ]}
                placeholder="Contraseña"
                value={password}
                onChangeText={handlePasswordChange}
                secureTextEntry={!showPassword}
                editable={!loading}
                placeholderTextColor="#999"
            />
            {passwordError !== "" ? (
                <Text style={styles.fieldError}>
                    {passwordError}
                </Text>
            ) : null}

            <TouchableOpacity
                style={styles.showPassword}
                onPress={() => setShowPassword(!showPassword)}
            >
                <Text style={styles.showPasswordText}>
                    {showPassword
                        ? "Ocultar contraseña"
                        : "Mostrar contraseña"}
                </Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={[
                    styles.button,
                    loading && styles.buttonDisabled,
                ]}
                onPress={handleLogin}
                disabled={loading}
            >
                {loading ? (
                    <View style={styles.loadingRow}>
                        <ActivityIndicator
                            color="#fff"
                            size="small"
                        />
                        <Text style={styles.buttonText}>
                            Validando...
                        </Text>
                    </View>
                ) : (
                    <Text style={styles.buttonText}>
                        Iniciar Sesión
                    </Text>
                )}
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
        backgroundColor: "#f5f5f5",
    },

    title: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 30,
        color: "#333",
        textAlign: "center",
    },

    input: {
        width: "100%",
        height: 50,
        borderWidth: 1,
        borderColor: "#ddd",
        borderRadius: 8,
        paddingHorizontal: 15,
        marginBottom: 15,
        fontSize: 16,
        backgroundColor: "#fff",
        color: "#333",
    },

    inputError: {
        borderColor: "red",
    },

    fieldError: {
        width: "100%",
        color: "red",
        fontSize: 14,
        marginTop: -10,
        marginBottom: 15,
    },

    showPassword: {
        width: "100%",
        marginBottom: 10,
    },

    showPasswordText: {
        color: "#007AFF",
        fontSize: 14,
    },

    errorContainer: {
        width: "100%",
        marginBottom: 15,
    },

    error: {
        color: "red",
        fontSize: 16,
        fontWeight: "600",
    },

    button: {
        width: "100%",
        height: 50,
        backgroundColor: "#007AFF",
        borderRadius: 8,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 10,
    },

    buttonDisabled: {
        backgroundColor: "#999",
    },

    loadingRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
    },

    buttonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
    },
});
