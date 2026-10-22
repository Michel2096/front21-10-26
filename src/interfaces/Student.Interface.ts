// lo que regresa el api en /students (sin password)
export interface Student {
    id: number;
    nombre: string;
    apellido: string;
    matricula: string;
    email: string;
    created_at: string;
    updated_at: string;
}

// lo que se manda al crear o editar (el api pide password en los dos casos)
export interface StudentInput {
    nombre: string;
    apellido: string;
    matricula: string;
    email: string;
    password: string;
}

export interface ApiResult<T> {
    ok: boolean;
    status: number;
    data?: T;
    message: string;
}

export interface StudentFormProps {
    initial: Student | null;
    saving: boolean;
    onSubmit: (data: StudentInput) => void;
    onCancel: () => void;
}
