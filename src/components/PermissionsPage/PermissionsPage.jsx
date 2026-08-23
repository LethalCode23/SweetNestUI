import { useEffect, useState } from "react";
import { useParams, useLocation, Link } from "react-router-dom";
import styles from "./PermissionsPage.module.css";
import {
    getProfileModules,
    toggleActionPermission,
} from "../../services/permissionsPage/permissionsPageService";

const ACTION_LABELS = {
    R: "Listar",
    C: "Agregar",
    U: "Editar",
    D: "Borrar",
};
const ACTION_ORDER = ["R", "C", "U", "D"];

const getSubModuleState = (subModule) => {
    const allowedCount = subModule.actions.filter((a) => a.allowed).length;
    if (allowedCount === 0) return "none";
    if (allowedCount === subModule.actions.length) return "full";
    return "partial";
};

const STATE_LABEL = {
    full: "Acceso completo",
    partial: "Acceso parcial",
    none: "Sin permisos",
};

export default function PermissionsPage() {
    // La ruta se espera como /profiles/:profileId/permissions
    const { profileId } = useParams();
    const location = useLocation();
    // Si venimos de ProfilesPage, ya trae el nombre en el state y evitamos un fetch extra
    const [profileName] = useState(location.state?.profileName ?? `Perfil ${profileId}`);

    const [modules, setModules] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loadError, setLoadError] = useState(null);
    const [moduleFilter, setModuleFilter] = useState("all");
    const [search, setSearch] = useState("");
    // Guarda la llave compuesta "moduleSec-submoduleId-code" de la acción en vuelo,
    // para deshabilitar ese switch mientras responde el PATCH
    const [pendingKey, setPendingKey] = useState(null);

    useEffect(() => {
        if (!profileId) return;
        let ignore = false;

        const fetchModules = async () => {
            setLoading(true);
            setLoadError(null);
            try {
                const data = await getProfileModules(profileId);
                if (!ignore) {
                    setModules(data ?? []);
                }
            } catch (error) {
                console.error("Error al cargar los módulos del perfil:", error);
                if (!ignore) {
                    setLoadError("No se pudieron cargar los permisos de este perfil.");
                }
            } finally {
                if (!ignore) setLoading(false);
            }
        };

        fetchModules();

        return () => {
            ignore = true;
        };
    }, [profileId]);

    const handleToggle = async (moduleSec, submoduleId, action) => {
        const key = `${moduleSec}-${submoduleId}-${action.code}`;
        const newAllowed = !action.allowed;

        setPendingKey(key);
        try {
            const res = await toggleActionPermission(
                profileId,
                moduleSec,
                submoduleId,
                action.code,
                newAllowed
            );

            if (res?.success === false) {
                throw new Error(res?.message || "No se pudo actualizar el permiso");
            }

            // Actualización optimista: el backend solo confirma éxito, no devuelve data
            setModules((prev) =>
                prev.map((m) =>
                    m.moduleSec !== moduleSec
                        ? m
                        : {
                            ...m,
                            subModules: m.subModules.map((sm) =>
                                sm.id !== submoduleId
                                    ? sm
                                    : {
                                        ...sm,
                                        actions: sm.actions.map((a) =>
                                            a.code !== action.code
                                                ? a
                                                : { ...a, allowed: newAllowed }
                                        ),
                                    }
                            ),
                        }
                )
            );
        } catch (error) {
            console.error("Error al actualizar el permiso:", error);
            // aquí podrías disparar un toast de error
        } finally {
            setPendingKey(null);
        }
    };

    const filteredModules = modules
        .filter((m) => moduleFilter === "all" || String(m.moduleSec) === moduleFilter)
        .map((m) => ({
            ...m,
            subModules: m.subModules.filter((sm) =>
                sm.name.toLowerCase().includes(search.toLowerCase())
            ),
        }))
        .filter((m) => m.subModules.length > 0);

    return (
        <div className={styles.root}>

            {/* Header */}
            <header className={styles.header}>
                <div>
                    <p className={styles.eyebrow}>Perfil: {profileName}</p>
                    <h1 className={styles.title}>Control de accesos</h1>
                    <p className={styles.subtitle}>
                        Configura qué módulos, submódulos y acciones puede usar este perfil.
                    </p>
                </div>
            </header>

            {/* Filtros */}
            <div className={styles.filters}>
                <div className={styles.filterGroup}>
                    <label className={styles.filterLabel}>Módulo principal</label>
                    <select
                        className={styles.select}
                        value={moduleFilter}
                        onChange={(e) => setModuleFilter(e.target.value)}
                        disabled={loading || !!loadError}
                    >
                        <option value="all">Todos los módulos</option>
                        {modules.map((m) => (
                            <option key={m.moduleSec} value={String(m.moduleSec)}>
                                {m.moduleName}
                            </option>
                        ))}
                    </select>
                </div>

                <div className={styles.filterGroup}>
                    <label className={styles.filterLabel}>Buscar submódulo</label>
                    <div className={styles.searchBox}>
                        <span className={styles.searchIcon}>⌕</span>
                        <input
                            type="text"
                            placeholder="Buscar por nombre..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className={styles.searchInput}
                            disabled={loading || !!loadError}
                        />
                    </div>
                </div>
            </div>

            {/* Estado de carga / error */}
            {loading ? (
                <div className={styles.empty}>
                    <span className={styles.emptyIcon}>◌</span>
                    <p className={styles.emptyText}>Cargando permisos...</p>
                </div>
            ) : loadError ? (
                <div className={styles.empty}>
                    <span className={styles.emptyIcon}>⚠</span>
                    <p className={styles.emptyText}>{loadError}</p>
                </div>
            ) : (
                /* Módulos */
                <div className={styles.moduleList}>
                    {filteredModules.length === 0 ? (
                        <div className={styles.empty}>
                            <span className={styles.emptyIcon}>◌</span>
                            <p className={styles.emptyText}>No se encontraron submódulos con ese criterio.</p>
                        </div>
                    ) : (
                        filteredModules.map((module) => (
                            <section key={module.moduleSec} className={styles.moduleBlock}>

                                <div className={styles.moduleHeader}>
                                    <span className={styles.moduleDot} />
                                    <h2 className={styles.moduleName}>{module.moduleName}</h2>
                                    <span className={styles.moduleDesc}>{module.moduleDescription}</span>
                                </div>

                                <div className={styles.table}>
                                    <div className={styles.tableHead}>
                                        <span className={styles.colEntity}>Submódulo</span>
                                        {ACTION_ORDER.map((code) => (
                                            <span key={code} className={styles.colAction}>
                                                {ACTION_LABELS[code]}
                                            </span>
                                        ))}
                                        <span className={styles.colState}>Estado</span>
                                    </div>

                                    {module.subModules.map((sub) => {
                                        const state = getSubModuleState(sub);
                                        return (
                                            <div key={sub.id} className={styles.row}>
                                                <div className={styles.colEntity}>
                                                    <p className={styles.subName}>{sub.name}</p>
                                                    <p className={styles.subUrl}>{sub.url}</p>
                                                </div>

                                                {ACTION_ORDER.map((code) => {
                                                    const action = sub.actions.find((a) => a.code === code);
                                                    const key = `${module.moduleSec}-${sub.id}-${code}`;
                                                    const isPending = pendingKey === key;
                                                    return (
                                                        <div key={code} className={styles.colAction}>
                                                            <button
                                                                type="button"
                                                                role="switch"
                                                                aria-checked={action?.allowed ?? false}
                                                                disabled={isPending}
                                                                onClick={() =>
                                                                    handleToggle(module.moduleSec, sub.id, action)
                                                                }
                                                                className={`${styles.toggle} ${action?.allowed ? styles.toggleOn : ""
                                                                    }`}
                                                            >
                                                                <span className={styles.toggleThumb} />
                                                            </button>
                                                        </div>
                                                    );
                                                })}

                                                <div className={styles.colState}>
                                                    <span className={`${styles.stateBadge} ${styles[`state_${state}`]}`}>
                                                        {STATE_LABEL[state]}
                                                    </span>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </section>
                        ))
                    )}
                </div>
            )}
        </div>
    );
}