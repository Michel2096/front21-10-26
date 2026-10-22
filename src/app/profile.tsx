import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet
} from "react-native";

import { Redirect, useRouter } from "expo-router";
import { selectDisplayName, selectEmail } from "@/store/authSlice";
import { useAppSelector } from "@/store/hooks";

export default function ProfileScreen() {

    const router = useRouter();
    const token = useAppSelector((state) => state.auth.token);
    const name = useAppSelector(selectDisplayName);
    const email = useAppSelector(selectEmail);

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
                    Mi Perfil
                </Text>

            </View>

            <View style={styles.profile}>

                <View style={styles.avatar}>
                    <Text style={styles.avatarText}>
                        {name.charAt(0).toUpperCase()}
                    </Text>
                </View>

                <Text style={styles.name}>
                    {name}
                </Text>

                <Text style={styles.email}>
                    {email}
                </Text>

            </View>

            <View style={styles.options}>
                <Text>👤  Editar perfil</Text>
                <Text>🔒  Cambiar contraseña</Text>
                <Text>🔔  Notificaciones</Text>
            </View>

        </View>
    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f5f6fa",
    },

    header: {
        height: 60,
        backgroundColor: "#4f46e5",
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 20,
    },

    back: {
        color: "#fff",
        fontSize: 28,
        marginRight: 20,
    },

    headerTitle: {
        color: "#fff",
        fontSize: 20,
        fontWeight: "bold",
    },

    profile: {
        alignItems: "center",
        paddingVertical: 30,
        backgroundColor: "#fff",
    },

    avatar: {
        width: 90,
        height: 90,
        borderRadius: 45,
        backgroundColor: "#4f46e5",
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 15,
    },

    avatarText: {
        color: "#fff",
        fontSize: 36,
        fontWeight: "bold",
    },

    name: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#222",
        marginBottom: 5,
    },

    email: {
        fontSize: 16,
        color: "#777",
    },

    options: {
        marginTop: 20,
        backgroundColor: "#fff",
        paddingHorizontal: 20,
        paddingVertical: 10,
        gap: 20,
    },
});
