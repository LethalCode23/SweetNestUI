import { Environment } from "../../Environments/Environment"

const URL_API = Environment.API_URL;

export const login = async (credentials) => {

    const res = await fetch(`${URL_API}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
    });
    
    return res.json();
}