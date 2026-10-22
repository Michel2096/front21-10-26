import { useState } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
} from "react-native";

import SideMenu from "../components/SideMenu";
import {Redirect, useRouter} from "expo-router";
import {logoutUser, selectDisplayName} from "@/store/authSlice";
import {useAppDispatch, useAppSelector} from "@/store/hooks";

export default function HomeScreen() {
    const [menuOpen, setMenuOpen] = useState(false);
    const router = useRouter();
    const dispatch = useAppDispatch();
    const token = useAppSelector((state) => state.auth.token);
    const name = useAppSelector(selectDisplayName);

    // sin sesion se regresa al login
    if (!token) {
        return <Redirect href="/" />;
    }



    return (
        <View style={styles.container}>

            {/* Encabezado */}
            <View style={styles.header}>

                <TouchableOpacity
                    onPress={() => setMenuOpen(true)}
                >
                    <Text style={styles.menuIcon}>
                        ☰
                    </Text>
                </TouchableOpacity>

                <Text style={styles.greeting}>
                    Hola, {name}
                </Text>

                <Text style={styles.profile}>
                    👤
                </Text>

            </View>

            {/* Contenido principal */}
            <View style={styles.content}>

                <Text style={styles.title}>
                    ¡Bienvenida!
                </Text>

                <Text style={styles.subtitle}>
                    Nos alegra verte nuevamente.
                </Text>

                <TouchableOpacity
                    style={styles.button}
                    onPress={() => router.push("/students")}
                >
                    <Text style={styles.buttonText}>
                        🎓  Administrar estudiantes
                    </Text>
                </TouchableOpacity>

            </View>

            {/* Menú lateral */}
            <SideMenu
                visible={menuOpen}
                onClose={() => setMenuOpen(false)}

                onProfile={() => {
                    setMenuOpen(false);
                    router.push("/profile");
                }}

                onStudents={() => {
                    setMenuOpen(false);
                    router.push("/students");
                }}

                onSettings={() => {
                    setMenuOpen(false);
                    router.push("/settings");
                }}

                onLogout={() => {
                    setMenuOpen(false);
                    dispatch(logoutUser());
                }}
            />

        </View>
    );
}

const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: "#F5F5F5",
    },

    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 20,
        paddingVertical: 15,
        backgroundColor: "#FFFFFF",
        borderBottomWidth: 1,
        borderBottomColor: "#E5E5E5",
    },

    menuIcon: {
        fontSize: 28,
    },

    greeting: {
        fontSize: 18,
        fontWeight: "600",
    },

    profile: {
        fontSize: 24,
    },

    content: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
    },

    title: {
        fontSize: 28,
        fontWeight: "bold",
        textAlign: "center",
        marginBottom: 10,
    },

    subtitle: {
        fontSize: 16,
        color: "#666666",
        textAlign: "center",
    },

    button: {
        marginTop: 30,
        backgroundColor: "#4F46E5",
        paddingVertical: 14,
        paddingHorizontal: 24,
        borderRadius: 8,
    },

    buttonText: {
        color: "#FFFFFF",
        fontSize: 16,
        fontWeight: "600",
    },

});