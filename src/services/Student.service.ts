import {API_ULR} from "@/constants/api";
import {ApiResult, Student, StudentInput} from "@/interfaces/Student.Interface";

// hace la peticion con el token y junta el mensaje de error que manda el api
const request = async <T>(
    path: string,
    token: string,
    method: string = "GET",
    body?: unknown
): Promise<ApiResult<T>> => {

    const response = await fetch(
        `${API_ULR}${path}`,
        {
            method,
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
                "Authorization": `Bearer ${token}`,
            },
            body: body ? JSON.stringify(body) : undefined,
        }
    );

    const result = await response.json().catch(() => ({}));

    if (!response.ok) {
        // si fallo la validacion el api manda el detalle por campo
        const details: { message: string }[] = result.details ?? [];
        const message = details.length > 0
            ? details.map((d) => d.message).join("\n")
            : result.error || result.message || "Ocurrio un error";
        return {ok: false, status: response.status, message};
    }

    return {ok: true, status: response.status, data: result.data, message: ""};

};

export const listStudentsService = (token: string) =>
    request<Student[]>("/students", token);

export const createStudentService = (token: string, data: StudentInput) =>
    request<Student>("/students", token, "POST", data);

export const updateStudentService = (token: string, id: number, data: StudentInput) =>
    request<Student>(`/students/${id}`, token, "PUT", data);

export const deleteStudentService = (token: string, id: number) =>
    request<void>(`/students/${id}`, token, "DELETE");
