import { useState } from "react";
import { apiErrorMessage } from "../../../Utils/apiError";

/**
 * Estado del flujo "eliminar con confirmación" para usar con <ConfirmDialog>.
 *
 *   const del = useConfirmDelete({
 *     onDelete: (row) => deleteCountry(row.paiSec),
 *     onDone: load,
 *     conflictMessage: "No se puede eliminar: tiene departamentos asociados.",
 *   });
 *   del.request(row)                       // desde la acción de la fila
 *   <ConfirmDialog {...del.dialogProps} title={`¿Eliminar «${del.target?.paiName ?? ""}»?`} />
 *
 * 409 → conflictMessage · otro error → mensaje del backend. El modal queda abierto con el error.
 */
export const useConfirmDelete = ({ onDelete, onDone, conflictMessage }) => {
  const [target, setTarget] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const request = (row) => {
    setError(null);
    setTarget(row);
  };

  const cancel = () => {
    setTarget(null);
    setError(null);
  };

  const confirm = async () => {
    if (!target) return;
    setLoading(true);
    setError(null);
    try {
      await onDelete(target);
      cancel();
      await onDone?.();
    } catch (err) {
      setError(
        err?.response?.status === 409 && conflictMessage
          ? conflictMessage
          : `No se pudo eliminar: ${apiErrorMessage(err)}`
      );
    } finally {
      setLoading(false);
    }
  };

  return {
    target,
    request,
    dialogProps: {
      open: Boolean(target),
      loading,
      error,
      onConfirm: confirm,
      onCancel: cancel,
    },
  };
};

export default useConfirmDelete;
