import { useMemo, useState } from "react";
import { Plus } from "lucide-react";
import styles from "./AddModuleSection.module.css";
import { Field } from "../ui/Form/Form";
import { buildAssignableCatalog } from "../../Utils/permissionsUtils";
import { apiErrorMessage } from "../../Utils/apiError";

/**
 * Card "Agregar acceso" del Control de accesos.
 *
 * @param {Array} myModules - módulos del admin logueado (solo puede conceder lo que él tiene)
 * @param {Array} targetModules - módulos que ya tiene el perfil que se está editando
 * @param {Function} onAdd - (moduleId, subModuleId, needsEntryAllowed) => Promise (lanza si falla)
 */
export const AddModuleSection = ({ myModules, targetModules, onAdd }) => {
    const [selectedModuleId, setSelectedModuleId] = useState("");
    const [selectedSubModuleId, setSelectedSubModuleId] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const catalog = useMemo(() => buildAssignableCatalog(myModules, targetModules), [myModules, targetModules]);
    const selectedModule = catalog.find((m) => String(m.moduleSec) === selectedModuleId);

    const handleModuleChange = (e) => {
        setSelectedModuleId(e.target.value);
        setSelectedSubModuleId(""); // resetea el submódulo al cambiar de módulo
        setError(null);
    };

    const handleAdd = async () => {
        if (!selectedModuleId || !selectedSubModuleId) return;

        // ¿El perfil ya tiene el módulo padre habilitado (entryAllowed)?
        const targetHasModule = targetModules.some(
            (m) => String(m.moduleSec) === selectedModuleId && m.entryAllowed
        );

        setLoading(true);
        setError(null);
        try {
            await onAdd(Number(selectedModuleId), Number(selectedSubModuleId), !targetHasModule);
            setSelectedModuleId("");
            setSelectedSubModuleId("");
        } catch (err) {
            setError(`No se pudo agregar el acceso. ${apiErrorMessage(err)}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className={styles.card} aria-labelledby="add-access-title">
            <div className={styles.head}>
                <h2 id="add-access-title" className={styles.title}>Agregar acceso</h2>
                <p className={styles.desc}>Solo puedes conceder secciones a las que tú también tienes acceso.</p>
            </div>

            {catalog.length === 0 ? (
                <p className={styles.note}>No hay secciones para agregar: este perfil ya tiene todo lo que puedes conceder.</p>
            ) : (
                <div className={styles.fields}>
                    <Field label="Módulo" hint={selectedModule?.moduleDescription}>
                        {(p) => (
                            <select {...p} className="sn-select sn-select--block" value={selectedModuleId}
                                onChange={handleModuleChange}>
                                <option value="">Elige un módulo</option>
                                {catalog.map((m) => (
                                    <option key={m.moduleSec} value={m.moduleSec}>{m.moduleName}</option>
                                ))}
                            </select>
                        )}
                    </Field>

                    <Field
                        label="Submódulo"
                        hint={selectedModule ? `${selectedModule.subModules.length} disponible(s) para agregar.` : undefined}
                    >
                        {(p) => (
                            <select {...p} className="sn-select sn-select--block" value={selectedSubModuleId}
                                onChange={(e) => { setSelectedSubModuleId(e.target.value); setError(null); }}
                                disabled={!selectedModuleId}>
                                <option value="">{selectedModuleId ? "Elige un submódulo" : "Primero elige un módulo"}</option>
                                {selectedModule?.subModules.map((sm) => (
                                    <option key={sm.id} value={sm.id}>{sm.name}</option>
                                ))}
                            </select>
                        )}
                    </Field>

                    <button
                        type="button"
                        className={`sn-btn sn-btn--primary ${styles.addBtn}`}
                        disabled={!selectedModuleId || !selectedSubModuleId || loading}
                        onClick={handleAdd}
                    >
                        <Plus size={16} aria-hidden="true" />
                        {loading ? "Agregando…" : "Agregar acceso"}
                    </button>
                </div>
            )}

            {error && <p className={styles.error} role="alert">{error}</p>}
        </section>
    );
};

export default AddModuleSection;
