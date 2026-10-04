import api from "../api";

/*
* Iniciar sesión
*/
export const login = async (credentials) => {
    try {
        const res = await api.post("/auth/login", credentials);
        return res.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || "Error al iniciar sesión");
    }
};

/*
* Registrar usuario
*/
export const registerUser = async (credentials) => {
    try {
        const res = await api.post("/auth/register", credentials);
        return res.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || "Error al registrar usuario");
    }
};