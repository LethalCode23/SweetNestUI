import {
    Building2,
    Earth,
    Map,
    MapPin,
    Tags,
    Sparkles,
    Users,
    ShieldCheck,
    Circle,
} from "lucide-react";
import { MODULES } from "./modules";

/**
 * Normaliza el nombre de un sub-modulo para que el lookup tolere acentos,
 * mayusculas y espacios: "Paises" | "PAÍSES" | " Paises " => "paises"
 */
const normalizeKey = (name = "") =>
    name.normalize("NFD").replace(/\p{Diacritic}/gu, "").trim().toLowerCase();

/**
 * Icono lucide por sub-modulo. Las claves se derivan de MODULES para que el
 * mapa no se desincronice con los nombres reales del backend.
 */
const ICONS_BY_MODULE = {
    [normalizeKey(MODULES.HOTELS)]: Building2,
    [normalizeKey(MODULES.COUNTRIES)]: Earth,
    [normalizeKey(MODULES.DEPARTMENTS)]: Map,
    [normalizeKey(MODULES.CITIES)]: MapPin,
    [normalizeKey(MODULES.CATEGORIES)]: Tags,
    [normalizeKey(MODULES.FEATURES)]: Sparkles,
    [normalizeKey(MODULES.USERS)]: Users,
    [normalizeKey(MODULES.PROFILE)]: ShieldCheck,
    // Alias en ingles que tambien puede devolver el backend
    features: Sparkles,
};

const FALLBACK_ICON = Circle;

/**
 * Devuelve el componente de icono asociado a un sub-modulo.
 * @param {string} name Nombre del sub-modulo (sub.name del modulo RBAC)
 * @returns {Function} Componente de lucide-react
 */
export const getModuleIcon = (name) =>
    ICONS_BY_MODULE[normalizeKey(name)] ?? FALLBACK_ICON;
