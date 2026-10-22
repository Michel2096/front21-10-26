import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet
} from "react-native";

import { Redirect, useRouter } from "expo-router";
import { logoutUser } from "@/store/authSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";

export default function SettingsScreen() {

    const router = useRouter();
    const dispatch = useAppDispatch();
    const token = useAppSelector((state) => state.auth.token);

    const handleLogout = () => {
        dispatch(logoutUser());
    };

    // sin sesion se regresa al login
    if (!token) {
        return <Redirect href="/" />;
    }

    return (
        <View style={styles.container}>

            <View style={styles.header}>

                <TouchableOpacity
                    onPress={() => router.back()}
                >
                    <Text style={styles.back}>
                        ←
                    </Text>
                </TouchableOpacity>

                <Text style={styles.headerTitle}>
                    Configuración
                </Text>

            </View>

            <View style={styles.options}>
                <Text>ⓘ  Información de la app</Text>
                <Text>⚙  Preferencias</Text>
                <Text>🔔  Notificaciones</Text>
                <Text>🔒  Privacidad</Text>
                <Text>❓  Ayuda y soporte</Text>
            </View>

            <TouchableOpacity
                style={styles.logout}
                onPress={handleLogout}
            >
                <Text>🚪  Cerrar sesión</Text>
            </TouchableOpacity>

        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
    },

    header: {
        flexDirection: "row",
        alignItems: "center",
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: "#eee",
    },

    back: {
        fontSize: 28,
        marginRight: 20,
    },

    headerTitle: {
        fontSize: 20,
        fontWeight: "bold",
    },

    options: {
        padding: 20,
        gap: 20,
    },

    logout: {
        margin: 20,
        padding: 15,
        backgroundColor: "#ffe5e5",
        borderRadius: 8,
        alignItems: "center",
    },
});
