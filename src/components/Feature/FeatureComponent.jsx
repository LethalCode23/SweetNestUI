import { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import {
  getAllFeatures,
  createFeature,
  updateFeature,
  deleteFeature
} from "../../services/featureServices/featureService";
import { FeatureCard } from "./FeatureCard";
import { FeatureForm } from "./FeatureForm";
import "./FeatureForm.css";
import styles from "./FeaturePage.module.css";
import { useAuth } from "../../context/AuthContext";
import { MODULES, ACTIONS } from "../../constants/modules";

export const FeatureComponent = () => {
  const [features, setFeatures] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Form state
  const [showForm, setShowForm] = useState(true); // Header form visible by default
  const [editingFeature, setEditingFeature] = useState(null);

  const { hasActionPermission } = useAuth();

  const loadFeatures = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAllFeatures();
      const featureList = Array.isArray(data) ? data : [];
      // Sort alphabetically by name
      featureList.sort((a, b) =>
        String(a.name || a.feaName || "").localeCompare(
          String(b.name || b.feaName || "")
        )
      );
      setFeatures(featureList);
    } catch (err) {
      console.error("Error al cargar características:", err);
      setError(err?.response?.data?.message || err.message || "Error al cargar las características.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFeatures();
  }, []);

  const handleEdit = (feature) => {
    setEditingFeature(feature);
    setShowForm(true);
    // Scroll smoothly to form header
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (feature) => {
    const id = feature?.id ?? feature?.feaSec;
    const name = feature?.name ?? feature?.feaName ?? "esta característica";

    if (!window.confirm(`¿Estás seguro de eliminar "${name}"?`)) return;

    try {
      await deleteFeature(id);
      await loadFeatures();
    } catch (err) {
      console.error("Error al eliminar la característica:", err);
      alert(err?.response?.data?.message || err.message || "Error al eliminar.");
    }
  };

  const handleSubmit = async (payload) => {
    try {
      const targetId = editingFeature?.id ?? editingFeature?.feaSec;

      if (targetId) {
        await updateFeature(targetId, payload);
      } else {
        await createFeature(payload);
      }

      setEditingFeature(null);
      await loadFeatures();
    } catch (err) {
      console.error("Error al guardar la característica:", err);
      alert(err?.response?.data?.message || err.message || "Error al guardar.");
    }
  };

  const handleCancelForm = () => {
    setEditingFeature(null);
  };

  const canCreate =
    hasActionPermission(MODULES.FEATURES, ACTIONS.CREATE) ||
    hasActionPermission("Features", ACTIONS.CREATE);

  return (
    <div className={styles["features-page"]}>
      <div className={styles["page-header"]}>
        <div>
          <h1 className={styles["page-title"]}>Características</h1>
          <p className={styles["page-subtitle"]}>Gestión de las características de los hoteles</p>
        </div>
        {!showForm && canCreate && (
          <button
            className="btn-primary"
            onClick={() => {
              setEditingFeature(null);
              setShowForm(true);
            }}
          >
            <Plus size={15} style={{ marginRight: 6 }} />
            Nueva característica
          </button>
        )}
      </div>

      {/* Formulario en el encabezado */}
      {showForm && (
        <FeatureForm
          initial={editingFeature}
          onCancel={editingFeature ? handleCancelForm : null}
          onSubmit={handleSubmit}
        />
      )}

      {/* Indicadores de carga y error */}
      {loading && <div className={styles["cn-loading"]}>Cargando características...</div>}
      {error && <div className={styles["cn-error"]}>Error: {error}</div>}

      {/* Listado de características */}
      {!loading && !error && (
        <>
          {features.length === 0 ? (
            <div className={styles["cn-empty"]}>No hay características registradas.</div>
          ) : (
            <div className={styles["features-grid"]}>
              {features.map((feature, idx) => {
                const key = feature.id ?? feature.feaSec ?? idx;
                return (
                  <FeatureCard
                    key={key}
                    feature={feature}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                  />
                );
              })}
            </div>
          )}
        </>
      )}
    </div>
  );
};
