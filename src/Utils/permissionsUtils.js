// utils/permissionsUtils.js

/**
 * A partir de "lo que tiene el admin" y "lo que ya tiene el perfil destino",
 * arma la lista de módulos/submódulos disponibles para agregar.
 *
 * @param {Array} myModules - módulos del admin logueado (fuente de lo permitido)
 * @param {Array} targetModules - módulos que YA tiene el perfil que se está editando
 */
export const buildAssignableCatalog = (myModules = [], targetModules = []) => {

    const alreadyGranted = new Map();
    targetModules.forEach((m) => {
        alreadyGranted.set(
            m.moduleSec,
            new Set((m.subModules ?? []).map((sm) => sm.id))
        );
    });

    return myModules
        .map((m) => {
            const grantedSet = alreadyGranted.get(m.moduleSec) ?? new Set();
            const availableSubModules = (m.subModules ?? []).filter(
                (sm) => !grantedSet.has(sm.id)
            );
            return { ...m, subModules: availableSubModules };
        })
        .filter((m) => m.subModules.length > 0);
};