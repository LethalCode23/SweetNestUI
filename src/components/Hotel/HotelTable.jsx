import { Pencil, Trash2 } from "lucide-react";
import styles from "./HotelTable.module.css";
import { BASE_URL } from "../../Js/constants";

const PLACEHOLDER = "https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg?auto=compress&cs=tinysrgb&w=80";

const formatCOP = (n) =>
  new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 }).format(n);

export default function HotelTable({ hotels, onEdit, onDelete }) {
  
  if (!hotels.length) {
    return (
      <div className={styles.empty}>
        <p>No hay hoteles registrados todavía.</p>
      </div>
    );
  }

  return (
    <div className={styles.wrapper}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Hotel</th>
            <th>Ciudad</th>
            <th>Costo / noche</th>
            <th>Categorías</th>
            <th>Estado</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {hotels.map((hotel) => (
            <tr key={hotel.hotSec} className={styles.row}>
              <td>
                <div className={styles.hotelCell}>
                  <img
                    src={`${BASE_URL}${hotel.imageUrls?.[0] ?? PLACEHOLDER}`}
                    alt={hotel.hotName}
                    className={styles.thumb}
                  />
                  <div>
                    <p className={styles.hotelName}>{hotel.hotName}</p>
                    <p className={styles.hotelDesc}>{hotel.hotDescription}</p>
                  </div>
                </div>
              </td>
              <td className={styles.cityCell}>
                {hotel.hotCitName ?? "—"}
              </td>
              <td className={styles.priceCell}>
                {formatCOP(hotel.hotCost)}
              </td>
              <td>
                <div className={styles.catList}>
                  {hotel.categories?.map((c) => (
                    <span key={c.catSec} className={styles.catBadge}>
                      {c.catName}
                    </span>
                  )) ?? <span className={styles.none}>—</span>}
                </div>
              </td>
              <td>
                <span className={`badge ${hotel.hotState === "A" ? "badge-active" : "badge-inactive"}`}>
                  <span className={styles.dot} />
                  {hotel.hotState === "A" ? "Activo" : "Inactivo"}
                </span>
              </td>
              <td>
                <div className={styles.actions}>
                  <button
                    className="btn-icon"
                    title="Editar"
                    onClick={() => onEdit(hotel)}
                  >
                    <Pencil size={15} />
                  </button>
                  <button
                    className="btn-icon btn-icon-danger"
                    title="Eliminar"
                    onClick={() => onDelete(hotel)}
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
