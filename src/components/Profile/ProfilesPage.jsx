import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./ProfilesPage.module.css";
import { useAuth } from "../../context/AuthContext";

// Data de ejemplo -- se reemplaza luego por getAllProfiles() del service real
const MOCK_PROFILES = [
    { proId: 1, proName: "Administrador", proState: "A", isDefault: "N" },
    { proId: 2, proName: "Usuario", proState: "A", isDefault: "S" },
];

const initials = (name = "") =>
    name
        .split(" ")
        .map((w) => w[0])
        .join("")
        .slice(0, 2)
        .toUpperCase();

export default function ProfilesPage() {

    const [search, setSearch] = useState("");
    const navigate = useNavigate();
    const { hasControlAccess } = useAuth();

    const profiles = MOCK_PROFILES.filter((p) =>
        p.proName.toLowerCase().includes(search.toLowerCase())
    );

    const goToPermissions = (profile) => {
        navigate(`/dashboard/profiles/${profile.proId}/permissions`, {
            state: { profileName: profile.proName },
        });
    };

    return (
        <div className={styles.root}>

            {/* Header */}
            <header className={styles.header}>
                <div>
                    <h1 className={styles.title}>Perfiles</h1>
                    <p className={styles.subtitle}>
                        Administra los perfiles del sistema y configura sus permisos de acceso por módulo.
                    </p>
                </div>
                <button className={styles.newBtn}>
                    <span className={styles.newBtnIcon}>+</span>
                    Nuevo perfil
                </button>
            </header>

            {/* Barra de búsqueda */}
            <div className={styles.toolbar}>
                <div className={styles.searchBox}>
                    <span className={styles.searchIcon}>⌕</span>
                    <input
                        type="text"
                        placeholder="Buscar perfil por nombre..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className={styles.searchInput}
                    />
                </div>
                <span className={styles.countBadge}>
                    {profiles.length} {profiles.length === 1 ? "perfil" : "perfiles"}
                </span>
            </div>

            {/* Lista de perfiles */}
            <div className={styles.list}>
                {profiles.length === 0 ? (
                    <div className={styles.empty}>
                        <span className={styles.emptyIcon}>◌</span>
                        <p className={styles.emptyText}>No se encontraron perfiles con ese nombre.</p>
                    </div>
                ) : (
                    profiles.map((profile) => (
                        <article key={profile.proId} className={styles.card}>

                            <div className={styles.cardLeft}>
                                <p className={styles.profileId}>ID: {profile.proId}</p>
                                <div className={styles.avatar}>{initials(profile.proName)}</div>
                                <div className={styles.cardInfo}>
                                    <div className={styles.nameRow}>
                                        <h3 className={styles.profileName}>{profile.proName}</h3>
                                        {profile.isDefault === "S" && (
                                            <span className={styles.defaultBadge}>Por defecto</span>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className={styles.cardRight}>
                                <span
                                    className={`${styles.stateBadge} ${profile.proState === "A" ? styles.stateActive : styles.stateInactive
                                        }`}
                                >
                                    <span className={styles.stateDot} />
                                    {profile.proState === "A" ? "Activo" : "Inactivo"}
                                </span>

                                {hasControlAccess() && (
                                    <button
                                        className={styles.manageBtn}
                                        onClick={() => goToPermissions(profile)}
                                    >
                                        Accesos
                                        <span className={styles.manageBtnArrow}>→</span>
                                    </button>
                                )}
                            </div>
                        </article>
                    ))
                )}
            </div>
        </div>
    );
}