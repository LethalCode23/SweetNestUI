import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { getAll, findByHotel } from "../services/hotelServices/hotelService";
import { HotelCard } from "../components/Hotel/HotelCard";
import { HotelFilters } from "../components/Hotel/HotelFilters";
import "../components/Hotel/HotelComponent.css";
import background from "../assets/jpg/background.jpg";

const HotelSearchPage = () => {
    const [searchParams] = useSearchParams();

    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [filters, setFilters] = useState({
        citName: searchParams.get("citName") || "",
        minCost: null,
        maxCost: null,
        categoryIds: [],
    });

    const size = 10;
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        load();
    }, [page, filters]);

    const load = async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await findByHotel(page, size, filters);
            setData(res.content);
            setTotalPages(res.totalPages);
        } catch (err) {
            console.log("Error al cargar hoteles:", err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleFiltersSearch = (newFilters) => {
        setPage(0);
        setFilters(newFilters);
    };

    return (
        <div className="hotel-results-wrapper">

            <div className="hotel-results-wrapper">

                {/* <HotelFilters onSearch={handleFiltersSearch} initialCitName={filters.citName} /> */}
                <div
                    className="hotel-results-hero"           // 👈 nuevo div contenedor
                    style={{ backgroundImage: `url(${background})` }}
                >
                    <HotelFilters onSearch={handleFiltersSearch} initialCitName={filters.citName} />
                </div>
            </div>

            <div className="hoteles">
                {loading ? (
                    <div className="cn-loading">Cargando hoteles...</div>
                ) : data.length === 0 ? (
                    <div className="cn-empty">No hay hoteles disponibles.</div>
                ) : (
                    <div className="hotel-grid">
                        {data.map((h) => (
                            <HotelCard key={h.hotSec} hotel={h} />
                        ))}
                    </div>
                )}

                <div className="pagination">
                    <button className="btnLeft" disabled={page === 0} onClick={() => setPage((p) => p - 1)}>
                        Anterior
                    </button>
                    <span>Página {page + 1} de {totalPages}</span>
                    <button className="btnRight" disabled={page + 1 >= totalPages} onClick={() => setPage((p) => p + 1)}>
                        Siguiente
                    </button>
                </div>
            </div>
        </div>
    );
};

export default HotelSearchPage;