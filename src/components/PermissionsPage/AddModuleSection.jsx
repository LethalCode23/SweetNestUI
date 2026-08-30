import { useMemo, useState } from "react";
import styles from "./AddModuleSection.module.css";
import { buildAssignableCatalog } from "../../Utils/permissionsUtils";

/**
 * Sección "+ Agregar módulo" para el panel de Control de Accesos.
 *
 * @param {Array} myModules - módulos del admin logueado (define qué puede asignar)
 * @param {Array} targetModules - módulos que ya tiene el perfil que se está editando
 * @param {Function} onAdd - (moduleId, subModuleId, needsEntryAllowed) => Promise
 */
export const AddModuleSection = ({ myModules, targetModules, onAdd }) => {

    const [selectedModuleId, setSelectedModuleId] = useState("");
    const [selectedSubModuleId, setSelectedSubModuleId] = useState("");
    const [loading, setLoading] = useState(false);

    const catalog = useMemo(() => buildAssignableCatalog(myModules, targetModules),
        [myModules, targetModules]
    );

    const selectedModule = catalog.find(
        (m) => String(m.moduleSec) === selectedModuleId
    );

    const handleModuleChange = (e) => {
        setSelectedModuleId(e.target.value);
        setSelectedSubModuleId(""); // resetea el submódulo al cambiar de módulo
    };

    const handleAdd = async () => {
        if (!selectedModuleId || !selectedSubModuleId) return;

        // ¿El perfil destino ya tiene este módulo activo (entryAllowed)?
        const targetHasModule = targetModules.some(
            (m) => String(m.moduleSec) === selectedModuleId && m.entryAllowed
        );

        setLoading(true);
        try {
            await onAdd(
                Number(selectedModuleId),
                Number(selectedSubModuleId),
                !targetHasModule // necesita activar el módulo padre primero
            );
            setSelectedModuleId("");
            setSelectedSubModuleId("");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.root}>
            <div className={styles.fields}>

                <div className={styles.field}>
                    <label className={styles.label}>Módulo principal</label>
                    <div className={styles.selectBox}>
                        <span className={styles.selectIcon}>▦</span>
                        <select
                            className={styles.select}
                            value={selectedModuleId}
                            onChange={handleModuleChange}
                        >
                            <option value="">Seleccionar módulo...</option>
                            {catalog.map((m) => (
                                <option key={m.moduleSec} value={m.moduleSec}>
                                    {m.moduleName}
                                </option>
                            ))}
                        </select>
                        <span className={styles.chevron}>⌄</span>
                    </div>
                    {selectedModule && (
                        <p className={styles.hint}>{selectedModule.moduleDescription}</p>
                    )}
                </div>

                <div className={styles.field}>
                    <label className={styles.label}>Submódulo</label>
                    <div
                        className={`${styles.selectBox} ${!selectedModuleId ? styles.disabled : ""}`}
                    >
                        <span className={styles.selectIcon}>◈</span>
                        <select
                            className={styles.select}
                            value={selectedSubModuleId}
                            onChange={(e) => setSelectedSubModuleId(e.target.value)}
                            disabled={!selectedModuleId}
                        >
                            <option value="">
                                {selectedModuleId ? "Seleccionar..." : "Elige un módulo primero"}
                            </option>
                            {selectedModule?.subModules.map((sm) => (
                                <option key={sm.id} value={sm.id}>
                                    {sm.name}
                                </option>
                            ))}
                        </select>
                        <span className={styles.chevron}>⌄</span>
                    </div>
                    <p className={styles.hint}>
                        {selectedModule
                            ? `${selectedModule.subModules.length} disponible(s) para agregar`
                            : "Filtro por área específica"}
                    </p>
                </div>

                <button
                    className={styles.addBtn}
                    disabled={!selectedModuleId || !selectedSubModuleId || loading}
                    onClick={handleAdd}
                >
                    {loading ? "Agregando..." : "+ Agregar acceso"}
                </button>
            </div>

            {catalog.length === 0 && (
                <p className={styles.emptyNote}>
                    No tienes módulos/submódulos disponibles para asignar, o el perfil ya tiene todo lo que tú posees.
                </p>
            )}
        </div>
    );
};