import { useState, useEffect } from "react";
import { getAll as getAllCategories } from "../../services/categoryServices/categoryService";
import styles from "./HotelFilters.module.css";

const MAX_PRICE = 1000000;

export const HotelFilters = ({ onSearch }) => {
    const [citName, setCitName] = useState("");
    const [minCost, setMinCost] = useState(0);
    const [maxCost, setMaxCost] = useState(MAX_PRICE);
    const [categories, setCategories] = useState([]);
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [loadingCategories, setLoadingCategories] = useState(true);

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

    const handleSubmit = () => {
        onSearch({ citName, minCost, maxCost, categoryIds: selectedCategories });
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
                    <input
                        className={styles["hf-input"]}
                        type="text"
                        placeholder="¿A dónde vas?"
                        value={citName}
                        onChange={(e) => setCitName(e.target.value)}
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
                                className={`${styles["hf-tag"]}${
                                    selectedCategories.includes(cat.catSec) ? ` ${styles["is-active"]}` : ""
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