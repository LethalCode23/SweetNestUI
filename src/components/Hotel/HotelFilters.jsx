import { useState, useEffect } from "react";
import { getAll as getAllCategories } from "../../services/categoryServices/categoryService";
import styles from "./HotelFilters.module.css";
import { DestinationAutocomplete } from "./DestinationAutocomplete/DestinationAutocomplete";

const MAX_PRICE = 1000000;

const TODAY = new Date().toISOString().slice(0, 10);

export const HotelFilters = ({
    onSearch,
    initialCitName = "",
    initialStartDate = "",
    initialEndDate = "",
}) => {
    const [citName, setCitName] = useState(initialCitName);
    const [minCost, setMinCost] = useState(0);
    const [maxCost, setMaxCost] = useState(MAX_PRICE);
    const [categories, setCategories] = useState([]);
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [loadingCategories, setLoadingCategories] = useState(true);
    const [startDate, setStartDate] = useState(initialStartDate);
    const [endDate, setEndDate] = useState(initialEndDate);

    useEffect(() => {
        loadCategories();
    }, []);

    const loadCategories = async () => {
        try {
            const res = await getAllCategories();
            const list = res?.content ?? res ?? [];
            setCategories(list.filter((c) => c.catEst === "A"));
        } catch (err) {
            console.log("Error al cargar categorías:", err);
        } finally {
            setLoadingCategories(false);
        }
    };

    const toggleCategory = (catSec) => {
        setSelectedCategories((prev) =>
            prev.includes(catSec) ? prev.filter((id) => id !== catSec) : [...prev, catSec]
        );
    };

    const handleMinChange = (e) => {
        setMinCost(Math.min(Number(e.target.value), maxCost - 10000));
    };

    const handleMaxChange = (e) => {
        setMaxCost(Math.max(Number(e.target.value), minCost + 10000));
    };

    const handleStartChange = (e) => {
        const value = e.target.value;
        setStartDate(value);
        // Si la salida elegida queda anterior a la nueva llegada, se limpia
        if (endDate && value && endDate < value) setEndDate("");
    };

    const handleEndChange = (e) => {
        setEndDate(e.target.value);
    };

    const handleSubmit = () => {
        onSearch({
            citName,
            minCost,
            maxCost,
            categoryIds: selectedCategories,
            startDate,
            endDate,
        });
    };

    const formatPrice = (value) =>
        new Intl.NumberFormat("es-CO", {
            style: "currency",
            currency: "COP",
            maximumFractionDigits: 0,
        }).format(value);

    const minPercent = (minCost / MAX_PRICE) * 100;
    const maxPercent = (maxCost / MAX_PRICE) * 100;

    return (
        <div className={styles["hf-card"]}>
            <div className={styles["hf-fields"]}>
                <div className={`${styles["hf-field"]} ${styles["hf-destination"]}`}>
                    <span className={styles["hf-label"]}>Destino</span>
                    <DestinationAutocomplete
                        value={citName}
                        onChange={setCitName}
                        onSubmit={handleSubmit}
                        inputClassName={styles["hf-input"]}
                        placeholder="¿A dónde vas?"
                        ariaLabel="Destino: ciudad u hotel"
                    />
                </div>

                <div className={styles["hf-divider"]} />

                <div className={`${styles["hf-field"]} ${styles["hf-price"]}`}>
                    <span className={styles["hf-label"]}>
                        Presupuesto $US
                        <em className={styles["hf-price-range"]}>
                            {formatPrice(minCost)} – {formatPrice(maxCost)}
                        </em>
                    </span>

                    <div className={styles["hf-slider"]}>
                        <div className={styles["hf-slider-track"]} />
                        <div
                            className={styles["hf-slider-fill"]}
                            style={{ left: `${minPercent}%`, right: `${100 - maxPercent}%` }}
                        />
                        <input
                            type="range"
                            min={0}
                            max={MAX_PRICE}
                            step={10000}
                            value={minCost}
                            onChange={handleMinChange}
                            className={styles["hf-range"]}
                        />
                        <input
                            type="range"
                            min={0}
                            max={MAX_PRICE}
                            step={10000}
                            value={maxCost}
                            onChange={handleMaxChange}
                            className={styles["hf-range"]}
                        />
                    </div>
                </div>

                <div className={styles["hf-divider"]} />

                <div className={`${styles["hf-field"]} ${styles["hf-dates"]}`}>
                    <div className={styles["hf-dates-row"]}>
                        <label className={`${styles["hf-field"]} ${styles["hf-date"]}`}>
                            <span className={styles["hf-label"]}>Llegada</span>
                            <input
                                type="date"
                                className={styles["hf-input"]}
                                value={startDate}
                                min={TODAY}
                                onChange={handleStartChange}
                                aria-label="Fecha de llegada"
                            />
                        </label>
                        <span className={styles["hf-dates-sep"]}>→</span>
                        <label className={`${styles["hf-field"]} ${styles["hf-date"]}`}>
                            <span className={styles["hf-label"]}>Salida</span>
                            <input
                                type="date"
                                className={styles["hf-input"]}
                                value={endDate}
                                min={startDate || TODAY}
                                onChange={handleEndChange}
                                aria-label="Fecha de salida"
                            />
                        </label>
                    </div>
                </div>

                <div className={styles["hf-divider"]} />

                <button className={styles["hf-search-btn"]} onClick={handleSubmit}>
                    Buscar <span className={styles["hf-arrow"]}>→</span>
                </button>
            </div>

            <div className={styles["hf-categories"]}>
                <span className={styles["hf-label"]}>Categorías</span>
                <div className={styles["hf-tags"]}>
                    {loadingCategories ? (
                        <span className={styles["hf-tags-loading"]}>Cargando…</span>
                    ) : (
                        categories.map((cat) => (
                            <button
                                key={cat.catSec}
                                type="button"
                                className={`${styles["hf-tag"]}${selectedCategories.includes(cat.catSec) ? ` ${styles["is-active"]}` : ""
                                    }`}
                                onClick={() => toggleCategory(cat.catSec)}
                            >
                                {cat.catName}
                            </button>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};
