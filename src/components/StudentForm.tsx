import { useState } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    ActivityIndicator,
} from "react-native";

import { StudentFormProps, StudentInput } from "@/interfaces/Student.Interface";

type Field = keyof StudentInput;

const FIELDS: { key: Field; label: string }[] = [
    { key: "nombre", label: "Nombre" },
    { key: "apellido", label: "Apellido" },
    { key: "matricula", label: "Matrícula" },
    { key: "email", label: "Correo electrónico" },
    { key: "password", label: "Contraseña" },
];

export default function StudentForm({
                                        initial,
                                        saving,
                                        onSubmit,
                                        onCancel,
                                    }: StudentFormProps) {
    const [form, setForm] = useState<StudentInput>({
        nombre: initial?.nombre ?? "",
        apellido: initial?.apellido ?? "",
        matricula: initial?.matricula ?? "",
        email: initial?.email ?? "",
        password: "",
    });
    const [errors, setErrors] = useState<Partial<Record<Field, string>>>({});

    const handleChange = (key: Field, value: string) => {
        setForm({ ...form, [key]: value });
        setErrors({ ...errors, [key]: "" });
    };

    // mismas reglas que el api para no mandar datos que va a rechazar
    const handleSubmit = () => {
        const nuevos: Partial<Record<Field, string>> = {};
        FIELDS.forEach(({ key, label }) => {
            if (form[key].trim() === "") {
                nuevos[key] = `${label} es obligatorio`;
            }
        });
        if (!nuevos.email && !/^\S+@\S+\.\S+$/.test(form.email.trim())) {
            nuevos.email = "El correo electrónico no es válido";
        }
        if (!nuevos.password && form.password.length < 6) {
            nuevos.password = "La contraseña debe tener al menos 6 caracteres";
        }

        setErrors(nuevos);
        if (Object.keys(nuevos).length > 0) {
            return;
        }

        onSubmit({
            nombre: form.nombre.trim(),
            apellido: form.apellido.trim(),
            matricula: form.matricula.trim(),
            email: form.email.trim(),
            password: form.password,
        });
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>
                {initial ? "Editar estudiante" : "Nuevo estudiante"}
            </Text>

            {FIELDS.map(({ key, label }) => (
                <View key={key}>
                    <TextInput
                        style={[styles.input, errors[key] ? styles.inputError : null]}
                        placeholder={
                            key === "password" && initial
                                ? "Nueva contraseña"
                                : label
                        }
                        placeholderTextColor="#999"
                        value={form[key]}
                        onChangeText={(text) => handleChange(key, text)}
                        autoCapitalize={key === "nombre" || key === "apellido" ? "words" : "none"}
                        secureTextEntry={key === "password"}
                        editable={!saving}
                    />
                    {errors[key] ? (
                        <Text style={styles.fieldError}>{errors[key]}</Text>
                    ) : null}
                </View>
            ))}

            <View style={styles.actions}>
                <TouchableOpacity
                    style={[styles.button, styles.cancel]}
                    onPress={onCancel}
                    disabled={saving}
                >
                    <Text style={styles.cancelText}>Cancelar</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.button, styles.save, saving && styles.disabled]}
                    onPress={handleSubmit}
                    disabled={saving}
                >
                    {saving ? (
                        <ActivityIndicator color="#fff" />
                    ) : (
                        <Text style={styles.saveText}>Guardar</Text>
                    )}
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#fff",
        padding: 20,
        borderRadius: 12,
        margin: 16,
        gap: 4,
    },

    title: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 10,
    },

    input: {
        borderWidth: 1,
        borderColor: "#ddd",
        borderRadius: 8,
        padding: 12,
        marginTop: 8,
        fontSize: 15,
    },

    inputError: {
        borderColor: "#e53935",
    },

    fieldError: {
        color: "#e53935",
        fontSize: 13,
        marginTop: 4,
    },

    actions: {
        flexDirection: "row",
        gap: 10,
        marginTop: 16,
    },

    button: {
        flex: 1,
        padding: 14,
        borderRadius: 8,
        alignItems: "center",
    },

    cancel: {
        backgroundColor: "#eee",
    },

    cancelText: {
        color: "#333",
        fontWeight: "600",
    },

    save: {
        backgroundColor: "#4f46e5",
    },

    saveText: {
        color: "#fff",
        fontWeight: "600",
    },

    disabled: {
        opacity: 0.6,
    },
});
