
import { useEffect, useState } from "react";
import HotelForm from "../components/Hotel/HotelForm";
import { getHotels, deleteHotel } from "../services/hotelServices/hotelService";
import HotelAdminCard from "../components/Hotel/HotelAdminCard";
import "../components/Hotel/HotelsCrudList.css";
import "../components/Hotel/HotelComponent.css";

const HotelsPage = () => {

  const [hotels, setHotels] = useState([]);
  const [editingHotel, setEditingHotel] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const fetchHotels = async () => {
    
    const data = await getHotels();
    setHotels(data.content);
  };

  useEffect(() => {
    fetchHotels();
  }, []);

  return (
    <div className="hotels-page">

      <div className="hotels-header">

        {!showForm && !editingHotel && (
          <button className="btnAdd" onClick={() => setShowForm(true)}>Nuevo</button>
        )}

        {(showForm || editingHotel) && (
          <>
            {!editingHotel && (
              <button className="btnCancel" onClick={() => setShowForm(false)} style={{ marginTop: '8px' }}>Cancelar</button>
            )}
            <HotelForm
              onSuccess={fetchHotels}
              editingHotel={editingHotel}
              setEditingHotel={setEditingHotel}
              onClose={() => {
                setShowForm(false);
                setEditingHotel(null);
              }}
            />
          </>
        )}
        <h2>Lista de Hoteles</h2>
      </div>

      <div className="hotel-grid">
        {hotels.map((hotel) => (
          <HotelAdminCard
            key={hotel.hotSec}
            hotel={hotel}
            onEdit={() => {
              setEditingHotel(hotel);
              setShowForm(true);
            }}
            onDelete={async () => {
              if (window.confirm('¿Eliminar hotel?')) {
                await deleteHotel(hotel.hotSec);
                fetchHotels();
              }
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default HotelsPage;