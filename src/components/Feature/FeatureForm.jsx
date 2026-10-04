import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { MODULES, ACTIONS } from "../../constants/modules";

export const FeatureForm = ({ initial = null, onCancel, onSubmit }) => {
  const { hasActionPermission } = useAuth();

  const [form, setForm] = useState({
    name: "",
    state: "A",
    icon: ""
  });

  const isEditing = Boolean(initial && (initial.id || initial.feaSec));

  useEffect(() => {
    if (initial) {
      setForm({
        name: initial.name || initial.feaName || "",
        state: initial.state || initial.feaState || "A",
        icon: initial.icon || initial.feaIcon || ""
      });
    } else {
      setForm({ name: "", state: "A", icon: "" });
    }
  }, [initial]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name.trim()) {
      alert("El nombre de la característica es requerido.");
      return;
    }

    const payload = {
      ...(isEditing ? { id: initial.id || initial.feaSec, feaSec: initial.feaSec || initial.id } : {}),
      name: form.name.trim(),
      feaName: form.name.trim(),
      state: form.state,
      feaState: form.state,
      icon: form.icon.trim(),
      feaIcon: form.icon.trim()
    };

    onSubmit(payload);
  };

  // Check permissions
  const canCreate = hasActionPermission(MODULES.FEATURES, ACTIONS.CREATE) || hasActionPermission("Features", ACTIONS.CREATE);
  const canUpdate = hasActionPermission(MODULES.FEATURES, ACTIONS.UPDATE) || hasActionPermission("Features", ACTIONS.UPDATE);

  if (isEditing && !canUpdate) return null;
  if (!isEditing && !canCreate) return null;

  return (
    <form className="feature-form" onSubmit={handleSubmit}>
      <div className="feature-form-header">
        <h4>{isEditing ? "Editar Característica" : "Nueva Característica"}</h4>
      </div>

      <div className="feature-form-grid">
        <div className="form-group">
          <label htmlFor="featureName">Nombre de la Característica</label>
          <input
            id="featureName"
            type="text"
            name="name"
            placeholder="Ej. Piscina, Wi-Fi, Estacionamiento..."
            value={form.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="featureState">Estado</label>
          <select
            id="featureState"
            name="state"
            value={form.state}
            onChange={handleChange}
          >
            <option value="A">Activo</option>
            <option value="I">Inactivo</option>
          </select>
        </div>
      </div>

      <div className="feature-form-actions">
        <button type="submit" className="btn btn-primary">
          {isEditing ? "Guardar Cambios" : "Agregar Característica"}
        </button>
        {onCancel && (
          <button type="button" className="btn btn-secondary" onClick={onCancel}>
            Cancelar
          </button>
        )}
      </div>
    </form>
  );
};
