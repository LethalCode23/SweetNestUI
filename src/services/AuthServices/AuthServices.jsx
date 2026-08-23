import { Environment } from "../../Environments/Environment";
const URL_API = Environment.API_URL;

/*
* Iniciar sesión
*/
export const login = async (credentials) => {

    const res = await fetch(`${URL_API}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
    });

    const result = await res.json();

    if (!res.ok) {
        throw new Error(result.message || "Error al iniciar sesión");
    }

    return result;
};

/*
* Registrar usuario
*/
export const registerUser = async (credentials) => {

    const res = await fetch(`${URL_API}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
    });

    const result = await res.json();

    if (!res.ok) {
        throw new Error(result.message || "Error al registrar usuario");
    }

    return result;
};