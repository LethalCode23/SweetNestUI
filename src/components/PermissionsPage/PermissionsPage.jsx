import { useEffect, useState } from "react";
import { useParams, useLocation, Link } from "react-router-dom";
import { AlertTriangle, ArrowLeft, Search, ShieldOff, Trash2 } from "lucide-react";
import styles from "./PermissionsPage.module.css";
import ui from "../ui/catalog.module.css";
import { toggleActionPermission } from "../../services/permissionsPage/permissionsPageService";
import { useAuth } from "../../context/AuthContext";
import { AddModuleSection } from "./AddModuleSection";
import { StatusBadge } from "../ui/StatusBadge/StatusBadge";
import { IconButton } from "../ui/IconButton/IconButton";
import { FilterSelect } from "../ui/FilterSelect/FilterSelect";
import { ConfirmDialog } from "../ui/ConfirmDialog/ConfirmDialog";
import { useConfirmDelete } from "../ui/ConfirmDialog/useConfirmDelete";
import { apiErrorMessage } from "../../Utils/apiError";
import {
    getProfileModules,
    grantSubModule,
    revokeSubModule,
    updateEntryAllowed,
} from "../../services/profileServices/ProfileServices";

const getSubModuleState = (subModule) => {
    const allowedCount = subModule.actions.filter((a) => a.allowed).length;
    if (allowedCount === 0) return "none";
    if (allowedCount === subModule.actions.length) return "full";
    return "partial";
};

const STATE_BADGE = {
    full: { tone: "success", label: "Acceso completo" },
    partial: { tone: "warning", label: "Acceso parcial" },
    none: { tone: "neutral", label: "Sin permisos" },
};

const normalize = (s = "") => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();

export default function PermissionsPage() {
    const { profileId } = useParams();
    const location = useLocation();
    const [profileName] = useState(location.state?.profileName ?? `Perfil ${profileId}`);

    const [modules, setModules] = useState([]);
    const [myModules, setMyModules] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loadError, setLoadError] = useState(null);
    const [moduleFilter, setModuleFilter] = useState("");
    const [search, setSearch] = useState("");
    const [pendingKey, setPendingKey] = useState(null);
    const [rowErrors, setRowErrors] = useState({}); // `${moduleSec}-${subId}` → mensaje

    const { user } = useAuth();

    const loadData = async () => {
        setLoading(true);
        setLoadError(null);
        try {
            const [mine, target] = await Promise.all([
                getProfileModules(user.profile.proId),
                getProfileModules(profileId),
            ]);
            setMyModules(mine ?? []);
            setModules(target ?? []);
            setRowErrors({});
        } catch (error) {
            setLoadError(`No se pudieron cargar los accesos de este perfil. ${apiErrorMessage(error)}`);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [profileId]);

    // Lanza si falla: AddModuleSection muestra el error en su card.
    const handleAddModule = async (moduleId, subModuleId, needsEntryAllowed) => {
        if (needsEntryAllowed) {
            await updateEntryAllowed(profileId, moduleId, true);
        }
        await grantSubModule(profileId, moduleId, subModuleId);
        await loadData();
    };

    const revoke = useConfirmDelete({
        onDelete: (sub) => revokeSubModule(profileId, sub.moduleSec, sub.id),
        onDone: loadData,
    });

    const handleToggle = async (moduleSec, submoduleId, action) => {
        const key = `${moduleSec}-${submoduleId}-${action.code}`;
        const rowKey = `${moduleSec}-${submoduleId}`;
        const newAllowed = !action.allowed;

        setPendingKey(key);
        setRowErrors((e) => ({ ...e, [rowKey]: null }));
        try {
            const res = await toggleActionPermission(profileId, moduleSec, submoduleId, action.code, newAllowed);
            if (res?.success === false) {
                throw new Error(res?.message || "No se pudo actualizar el permiso");
            }

            // El backend solo confirma el éxito (no devuelve data): se actualiza el estado local
            setModules((prev) =>
                prev.map((m) => m.moduleSec !== moduleSec ? m : {
                    ...m,
                    subModules: m.subModules.map((sm) => sm.id !== submoduleId ? sm : {
                        ...sm,
                        actions: sm.actions.map((a) => a.code !== action.code ? a : { ...a, allowed: newAllowed }),
                    }),
                })
            );
        } catch (error) {
            // El switch no cambió (solo se actualiza si el backend confirma); se avisa en la fila
            setRowErrors((e) => ({ ...e, [rowKey]: `No se guardó «${action.name}». ${apiErrorMessage(error)}` }));
        } finally {
            setPendingKey(null);
        }
    };

    const term = normalize(search.trim());
    const filteredModules = modules
        .filter((m) => !moduleFilter || String(m.moduleSec) === moduleFilter)
        .map((m) => ({ ...m, subModules: m.subModules.filter((sm) => normalize(sm.name).includes(term)) }))
        .filter((m) => m.subModules.length > 0);

    const moduleOptions = modules.map((m) => ({ value: String(m.moduleSec), label: m.moduleName }));
    const filtersActive = Boolean(moduleFilter || search);

    return (
        <div className={ui.page}>

            <div className={styles.top}>
                <Link to="/dashboard/profiles" className="sn-btn sn-btn--ghost sn-btn--sm">
                    <ArrowLeft size={16} aria-hidden="true" />
                    Volver a perfiles
                </Link>
                <p className={ui.intro}>
                    Accesos del perfil <strong className={styles.profileName}>{profileName}</strong>.
                    Cada cambio se guarda al instante.
                </p>
            </div>

            <AddModuleSection myModules={myModules} targetModules={modules} onAdd={handleAddModule} />

            <div className={styles.toolbar}>
                <label className={styles.search}>
                    <Search size={16} className={styles.searchIcon} aria-hidden="true" />
                    <input
                        type="search"
                        className="sn-input"
                        placeholder="Buscar submódulo"
                        aria-label="Buscar submódulo"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        disabled={loading || Boolean(loadError)}
                    />
                </label>
                <FilterSelect label="Filtrar por módulo" allLabel="Todos los módulos"
                    value={moduleFilter} onChange={setModuleFilter} options={moduleOptions} />
            </div>

            {loading ? (
                <div className={styles.skeletonList} aria-busy="true" aria-label="Cargando accesos">
                    {[0, 1].map((i) => <div key={i} className={styles.skeleton} />)}
                </div>
            ) : loadError ? (
                <div className={styles.state} role="alert">
                    <AlertTriangle size={20} className={styles.stateIconDanger} aria-hidden="true" />
                    <p className={styles.stateTitle}>{loadError}</p>
                    <button type="button" className="sn-btn sn-btn--secondary" onClick={loadData}>Reintentar</button>
                </div>
            ) : filteredModules.length === 0 ? (
                <div className={styles.state}>
                    <ShieldOff size={20} className={styles.stateIcon} aria-hidden="true" />
                    {filtersActive ? (
                        <>
                            <p className={styles.stateTitle}>Ningún submódulo coincide con la búsqueda.</p>
                            <button type="button" className="sn-btn sn-btn--secondary"
                                onClick={() => { setSearch(""); setModuleFilter(""); }}>
                                Limpiar búsqueda
                            </button>
                        </>
                    ) : (
                        <>
                            <p className={styles.stateTitle}>Este perfil todavía no tiene accesos.</p>
                            <p className={styles.stateText}>Agrégale el primero desde «Agregar acceso».</p>
                        </>
                    )}
                </div>
            ) : (
                <div className={styles.moduleList}>
                    {filteredModules.map((module) => {
                        // Códigos de acción que existen en este módulo (según la data real)
                        const actionCodes = [...new Set(module.subModules.flatMap((sm) => sm.actions.map((a) => a.code)))];
                        const actionName = (code) =>
                            module.subModules.flatMap((sm) => sm.actions).find((a) => a.code === code)?.name ?? code;

                        return (
                            <section key={module.moduleSec} className={styles.module} aria-labelledby={`mod-${module.moduleSec}`}>
                                <header className={styles.moduleHead}>
                                    <h2 id={`mod-${module.moduleSec}`} className={styles.moduleName}>{module.moduleName}</h2>
                                    {module.moduleDescription && (
                                        <p className={styles.moduleDesc}>{module.moduleDescription}</p>
                                    )}
                                </header>

                                <div className={styles.tableWrap}>
                                    <table className={styles.table}>
                                        <thead>
                                            <tr>
                                                <th scope="col">Submódulo</th>
                                                {actionCodes.map((code) => (
                                                    <th key={code} scope="col" className={styles.center}>{actionName(code)}</th>
                                                ))}
                                                <th scope="col">Estado</th>
                                                <th scope="col"><span className={styles.srOnly}>Quitar</span></th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {module.subModules.map((sub) => {
                                                const badge = STATE_BADGE[getSubModuleState(sub)];
                                                const rowError = rowErrors[`${module.moduleSec}-${sub.id}`];
                                                return (
                                                    <tr key={sub.id}>
                                                        <td>
                                                            <span className={ui.stack}>
                                                                <span className={ui.name}>{sub.name}</span>
                                                                <span className={ui.stackSub}>{sub.url}</span>
                                                                {rowError && (
                                                                    <span className={styles.rowError} role="alert">{rowError}</span>
                                                                )}
                                                            </span>
                                                        </td>
                                                        {actionCodes.map((code) => {
                                                            const action = sub.actions.find((a) => a.code === code);
                                                            if (!action) {
                                                                return <td key={code} className={styles.center}><span className={ui.empty}>—</span></td>;
                                                            }
                                                            const isPending = pendingKey === `${module.moduleSec}-${sub.id}-${code}`;
                                                            return (
                                                                <td key={code} className={styles.center}>
                                                                    <button
                                                                        type="button"
                                                                        role="switch"
                                                                        aria-checked={action.allowed}
                                                                        aria-label={`${action.name} en ${sub.name}`}
                                                                        disabled={isPending}
                                                                        onClick={() => handleToggle(module.moduleSec, sub.id, action)}
                                                                        className={`${styles.toggle} ${action.allowed ? styles.toggleOn : ""}`}
                                                                    >
                                                                        <span className={styles.toggleThumb} aria-hidden="true" />
                                                                    </button>
                                                                </td>
                                                            );
                                                        })}
                                                        <td><StatusBadge tone={badge.tone}>{badge.label}</StatusBadge></td>
                                                        <td className={styles.actions}>
                                                            <IconButton
                                                                icon={Trash2}
                                                                tone="danger"
                                                                tooltipAlign="end"
                                                                label={`Quitar acceso a ${sub.name}`}
                                                                onClick={() => revoke.request({ ...sub, moduleSec: module.moduleSec })}
                                                            />
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            </section>
                        );
                    })}
                </div>
            )}

            <ConfirmDialog
                {...revoke.dialogProps}
                title={`¿Quitar el acceso a «${revoke.target?.name ?? ""}»?`}
                description={`El perfil ${profileName} deja de ver esta sección y pierde todas sus acciones. Puedes volver a agregarla después.`}
                confirmLabel="Quitar acceso"
                loadingLabel="Quitando…"
            />
        </div>
    );
}
