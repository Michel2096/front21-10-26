import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { SideMenuProps } from "@/interfaces/menu.interface";
import MenuItem from "@/components/MenuItem";
import { selectDisplayName, selectEmail } from "@/store/authSlice";
import { useAppSelector } from "@/store/hooks";

export default function SideMenu({
                                     visible,
                                     onClose,
                                     onProfile,
                                     onStudents,
                                     onSettings,
                                     onLogout,
                                 }: SideMenuProps) {
    // nombre y correo salen del store, no de props
    const name = useAppSelector(selectDisplayName);
    const email = useAppSelector(selectEmail);

    if (!visible) {
        return null;
    }

    return (
        <View style={styles.overlay}>

            <View style={styles.menu}>

                <View style={styles.userContainer}>

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

                <MenuItem
                    title="Inicio"
                    icon="🏠"
                    onPress={onClose}
                />

                <MenuItem
                    title="Mi Perfil"
                    icon="👤"
                    onPress={onProfile}
                />

                <MenuItem
                    title="Estudiantes"
                    icon="🎓"
                    onPress={onStudents}
                />

                <MenuItem
                    title="Configuración"
                    icon="⚙️"
                    onPress={onSettings}
                />

                <View style={styles.spacer} />

                <TouchableOpacity
                    style={styles.logout}
                    onPress={onLogout}
                >
                    <Text style={styles.logoutIcon}>
                        🚪
                    </Text>

                    <Text style={styles.logoutText}>
                        Cerrar sesión
                    </Text>
                </TouchableOpacity>

            </View>

            <TouchableOpacity
                style={styles.background}
                onPress={onClose}
            />

        </View>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        position: "absolute",
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        flexDirection: "row",
    },

    menu: {
        width: 280,
        backgroundColor: "#fff",
        padding: 20,
        elevation: 5,
    },

    background: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.4)",
    },

    userContainer: {
        alignItems: "center",
        marginBottom: 30,
    },

    avatar: {
        width: 70,
        height: 70,
        borderRadius: 35,
        backgroundColor: "#4F46E5",
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 10,
    },

    avatarText: {
        color: "#fff",
        fontSize: 28,
        fontWeight: "bold",
    },

    name: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#222",
    },

    email: {
        fontSize: 14,
        color: "#777",
        marginTop: 4,
    },

    spacer: {
        flex: 1,
    },

    logout: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 15,
        borderTopWidth: 1,
        borderTopColor: "#eee",
    },

    logoutIcon: {
        fontSize: 20,
        marginRight: 12,
    },

    logoutText: {
        fontSize: 16,
        color: "#e53935",
    },
});
