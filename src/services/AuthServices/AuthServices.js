import { Environment } from "../../Environments/Environment"
const URL_API = Environment.API_URL;

/*
* iniciar sesion
*/
export const login = async (credentials) => {

    const res = await fetch(`${URL_API}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
    });
    
    return res.json();
}

/*
* registrar usuario
*/
export const registerUser = async (credentials) => {

    const res = await fetch(`${URL_API}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
    });
    console.log(res)
    return res;
}