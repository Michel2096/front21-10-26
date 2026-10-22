import { useState } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    FlatList,
    ActivityIndicator,
    ScrollView,
} from "react-native";

import { Redirect, useRouter } from "expo-router";
import StudentForm from "@/components/StudentForm";
import { useStudents } from "@/hooks/useStudents";
import { Student } from "@/interfaces/Student.Interface";
import { useAppSelector } from "@/store/hooks";

export default function StudentsScreen() {
    const router = useRouter();
    const token = useAppSelector((state) => state.auth.token);
    const { students, loading, saving, error, load, save, remove, clearError } = useStudents();

    // null = cerrado, "new" = crear, Student = editar
    const [editing, setEditing] = useState<Student | "new" | null>(null);
    // id del estudiante que espera confirmacion para borrarse
    const [confirmId, setConfirmId] = useState<number | null>(null);

    // sin sesion se regresa al login
    if (!token) {
        return <Redirect href="/" />;
    }

    const openForm = (student: Student | "new") => {
        clearError();
        setConfirmId(null);
        setEditing(student);
    };

    const renderItem = ({ item }: { item: Student }) => (
        <View style={styles.card}>
            <View style={styles.cardInfo}>
                <Text style={styles.cardName}>
                    {item.nombre} {item.apellido}
                </Text>
                <Text style={styles.cardDetail}>Matrícula: {item.matricula}</Text>
                <Text style={styles.cardDetail}>{item.email}</Text>
            </View>

            {confirmId === item.id ? (
                <View style={styles.cardActions}>
                    <TouchableOpacity
                        style={[styles.smallButton, styles.danger]}
                        onPress={() => {
                            setConfirmId(null);
                            remove(item.id);
                        }}
                    >
                        <Text style={styles.dangerText}>Sí, eliminar</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.smallButton}
                        onPress={() => setConfirmId(null)}
                    >
                        <Text>No</Text>
                    </TouchableOpacity>
                </View>
            ) : (
                <View style={styles.cardActions}>
                    <TouchableOpacity
                        style={styles.smallButton}
                        onPress={() => openForm(item)}
                    >
                        <Text>✏️ Editar</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.smallButton}
                        onPress={() => setConfirmId(item.id)}
                    >
                        <Text>🗑️ Eliminar</Text>
                    </TouchableOpacity>
                </View>
            )}
        </View>
    );

    return (
        <View style={styles.container}>

            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()}>
                    <Text style={styles.back}>←</Text>
                </TouchableOpacity>

                <Text style={styles.headerTitle}>Estudiantes</Text>

                {editing === null ? (
                    <TouchableOpacity onPress={() => openForm("new")}>
                        <Text style={styles.add}>＋</Text>
                    </TouchableOpacity>
                ) : null}
            </View>

            {error ? (
                <View style={styles.errorContainer}>
                    <Text style={styles.error}>⚠ {error}</Text>
                </View>
            ) : null}

            {editing !== null ? (
                <ScrollView>
                    <StudentForm
                        // key para reiniciar el formulario al cambiar de estudiante
                        key={editing === "new" ? "new" : editing.id}
                        initial={editing === "new" ? null : editing}
                        saving={saving}
                        onCancel={() => {
                            clearError();
                            setEditing(null);
                        }}
                        onSubmit={async (data) => {
                            const ok = await save(
                                data,
                                editing === "new" ? undefined : editing.id
                            );
                            if (ok) {
                                setEditing(null);
                            }
                        }}
                    />
                </ScrollView>
            ) : loading && students.length === 0 ? (
                <ActivityIndicator size="large" style={styles.loader} />
            ) : (
                <FlatList
                    data={students}
                    keyExtractor={(item) => String(item.id)}
                    renderItem={renderItem}
                    contentContainerStyle={styles.list}
                    refreshing={loading}
                    onRefresh={load}
                    ListEmptyComponent={
                        <Text style={styles.empty}>
                            No hay estudiantes registrados
                        </Text>
                    }
                />
            )}

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
        flex: 1,
        color: "#fff",
        fontSize: 20,
        fontWeight: "bold",
    },

    add: {
        color: "#fff",
        fontSize: 28,
    },

    errorContainer: {
        backgroundColor: "#ffe5e5",
        padding: 12,
        margin: 16,
        marginBottom: 0,
        borderRadius: 8,
    },

    error: {
        color: "#e53935",
    },

    loader: {
        marginTop: 40,
    },

    list: {
        padding: 16,
        gap: 12,
    },

    card: {
        backgroundColor: "#fff",
        borderRadius: 12,
        padding: 16,
    },

    cardInfo: {
        marginBottom: 12,
    },

    cardName: {
        fontSize: 17,
        fontWeight: "bold",
        color: "#222",
        marginBottom: 4,
    },

    cardDetail: {
        fontSize: 14,
        color: "#666",
    },

    cardActions: {
        flexDirection: "row",
        gap: 10,
    },

    smallButton: {
        flex: 1,
        paddingVertical: 10,
        borderRadius: 8,
        backgroundColor: "#f0f0f0",
        alignItems: "center",
    },

    danger: {
        backgroundColor: "#e53935",
    },

    dangerText: {
        color: "#fff",
        fontWeight: "600",
    },

    empty: {
        textAlign: "center",
        color: "#777",
        marginTop: 40,
    },
});
