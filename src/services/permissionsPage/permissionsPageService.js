import api from "../api";

/**
 * Trae el árbol completo de módulos -> submódulos -> acciones (con su estado
 * "allowed") para un perfil específico.
 *
 * @param {number|string} profileId - Id del perfil (ej: 1)
 */
export const getProfileModules = async (profileId) => {
    const res = await api.get(`/profiles/${profileId}/modules`);

    // El backend devuelve { code, data: [...], message, success }
    return res.data?.data ?? res.data;
};

/**
 * Activa o desactiva el permiso de una acción puntual (R, C, U, D)
 * dentro de un submódulo, para un perfil específico.
 *
 * @param {number|string} profileId   - Id del perfil (ej: 1)
 * @param {number|string} moduleId    - Id del módulo (ej: 1)
 * @param {number|string} submoduleId - Id del submódulo (ej: 1)
 * @param {string} actionCode         - Código de la acción: "R" | "C" | "U" | "D"
 * @param {boolean} allowed           - Nuevo estado del permiso (true = permitido)
 */
export const toggleActionPermission = async (
    profileId,
    moduleId,
    submoduleId,
    actionCode,
    allowed
) => {
    const res = await api.patch(
        `/PermissionProModPer/${profileId}/modules/${moduleId}/submodules/${submoduleId}/actions/${actionCode}`,
        { allowed }
    );

    // Este endpoint NO devuelve "data", solo { code, message, success }
    // ej: { code: 0, message: "Permiso actualizado correctamente", success: true }
    return res.data;
};