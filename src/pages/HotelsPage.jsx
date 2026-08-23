import { useEffect, useState } from "react";
import { Plus, Search, Building2, CheckCircle2, XCircle } from "lucide-react";
import { getHotels, deleteHotel } from "../services/hotelServices/hotelService";
import HotelTable from "../components/Hotel/HotelTable";
import HotelForm from "../components/Hotel/HotelForm";
import styles from "./HotelsPage.module.css";
import { MODULES, ACTIONS } from "../constants/modules";
import { useAuth } from "../context/AuthContext";

const formatCOP = (n) =>
  new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 }).format(n);

export default function HotelsPage() {

  const { hasActionPermission } = useAuth();
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingHotel, setEditingHotel] = useState(null);

  const fetchHotels = async () => {
    setLoading(true);
    const data = await getHotels();
    setHotels(data.content);
    setLoading(false);
  };

  useEffect(() => { fetchHotels(); }, []);

  const openCreate = () => { setEditingHotel(null); setDrawerOpen(true); };
  const openEdit = (hotel) => { setEditingHotel(hotel); setDrawerOpen(true); };
  const closeDrawer = () => { setDrawerOpen(false); setEditingHotel(null); };

  const handleDelete = async (hotel) => {
    if (!window.confirm(`¿Eliminar "${hotel.hotName}"?`)) return;
    await deleteHotel(hotel.hotSec);
    fetchHotels();
  };

  const filtered = hotels.filter((h) =>
    h.hotName.toLowerCase().includes(search.toLowerCase()) ||
    h.city?.citName?.toLowerCase().includes(search.toLowerCase()) ||
    h.hotAddress?.toLowerCase().includes(search.toLowerCase())
  );

  const totalActive = hotels.filter((h) => h.hotState === "A").length;
  const totalInactive = hotels.filter((h) => h.hotState === "I").length;
  const avgCost = hotels.length
    ? hotels.reduce((s, h) => s + (h.hotCost || 0), 0) / hotels.length
    : 0;

  return (
    <div className={styles.page}>
      {/* Header */}
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Hoteles</h1>
          <p className={styles.pageSubtitle}>Gestión del inventario de hoteles</p>
        </div>

        {hasActionPermission(MODULES.HOTELS, ACTIONS.CREATE) && (
          <button className="btn-primary" onClick={openCreate}>
            <Plus size={15} style={{ marginRight: 6 }} />
            Nuevo hotel
          </button>
        )}

      </div>

      {/* Stats */}
      <div className={styles.stats}>
        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: "rgba(37,99,235,0.12)", color: "#60a5fa" }}>
            <Building2 size={17} />
          </div>
          <div>
            <p className={styles.statValue}>{hotels.length}</p>
            <p className={styles.statLabel}>Total hoteles</p>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: "rgba(74,222,128,0.1)", color: "#4ade80" }}>
            <CheckCircle2 size={17} />
          </div>
          <div>
            <p className={styles.statValue}>{totalActive}</p>
            <p className={styles.statLabel}>Activos</p>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: "rgba(248,113,113,0.1)", color: "#f87171" }}>
            <XCircle size={17} />
          </div>
          <div>
            <p className={styles.statValue}>{totalInactive}</p>
            <p className={styles.statLabel}>Inactivos</p>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: "rgba(251,191,36,0.1)", color: "#fbbf24" }}>
            <span style={{ fontSize: 14, fontWeight: 700 }}>$</span>
          </div>
          <div>
            <p className={styles.statValueSm}>{formatCOP(avgCost)}</p>
            <p className={styles.statLabel}>Precio promedio/noche</p>
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className={styles.toolbar}>
        <div className={styles.searchWrap}>
          <Search size={14} className={styles.searchIcon} />
          <input
            className={styles.searchInput}
            type="text"
            placeholder="Buscar por nombre, ciudad o dirección..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        {search && (
          <span className={styles.resultCount}>
            {filtered.length} resultado{filtered.length !== 1 ? "s" : ""}
          </span>
        )}
      </div>

      {/* Table */}
      {loading ? (
        <div className={styles.loadingState}>
          <span className={styles.spinner} />
          <p>Cargando hoteles...</p>
        </div>
      ) : (
        <HotelTable hotels={filtered} onEdit={openEdit} onDelete={handleDelete} />
      )}

      {/* Drawer */}
      {drawerOpen && (
        <HotelForm
          editingHotel={editingHotel}
          onSuccess={fetchHotels}
          onClose={closeDrawer}
        />
      )}
    </div>
  );
}
