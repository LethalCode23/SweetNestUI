export const listing = {
  title: "City Studio en el corazón de Chapinero",
  summary:
    "Loft entero en Bogotá, Colombia · 2 huéspedes · 1 habitación · 1 cama queen · 1 baño privado",
  rating: 4.89,
  reviews: 119,
  photos: [
    { src: "/images/loft-main.jpg", alt: "Sala del loft con ladrillo a la vista" },
    { src: "/images/loft-kitchen.jpg", alt: "Cocina gourmet equipada" },
    { src: "/images/loft-terrace.jpg", alt: "Terraza jardín privada" },
    { src: "/images/loft-bedroom.jpg", alt: "Habitación principal con cama queen" },
    { src: "/images/loft-bathroom.jpg", alt: "Baño privado con ducha" },
  ],
  totalPhotos: 28,
  price: {
    original: 361921,
    nightly: 264917,
    discountPercent: 27,
  },
  breakdown: {
    nights: 2,
    cleaning: 45000,
    service: 32000,
    earlyBirdDiscount: 40000,
  },
  host: {
    name: "Joey SweetNest",
    avatar: "/images/host-joey.jpg",
    superhost: true,
    years: 8,
    responseTime: "menos de 1h",
  },
  amenities: [
    "Wi-Fi de fibra óptica ultra rápido (300 Mbps)",
    "Cocina gourmet equipada con cafetera espresso",
    "Terraza jardín privada y patio con vegetación",
    "Climatización y calefactor cerámico de ambiente",
    "Lavadora y secadora integrada en la unidad",
    'Smart TV 55" 4K (Netflix, Disney+, Prime Video)',
    "Monitoreo y seguridad privada 24/7 en el edificio",
    "Café colombiano de origen y té artesanal incluido",
  ],
  totalAmenities: 34,
  highlights: [
    {
      title: "Llegada autónoma sin fricciones",
      body: "Accede de inmediato mediante cerradura con teclado numérico digital y código único.",
    },
    {
      title: "Ubicación inmejorable en Chapinero Alto",
      body: "El 98% de los huéspedes valoraron el vecindario con 5 estrellas por su seguridad y oferta gastronómica.",
    },
    {
      title: "Cancelación flexible",
      body: "Cancela sin penalidad hasta 48 horas antes del check-in para un reembolso completo.",
    },
    {
      title: "SweetNest Protect™",
      body: "Garantía de reembolso y atención al cliente prioritaria 24/7 durante tu viaje.",
    },
  ],
  rules: [
    "Check-in: 3:00 PM – 9:00 PM",
    "Check-out: 11:00 AM",
    "No se permite fumar en espacios interiores",
    "Prohibidas las fiestas o eventos ruidosos",
  ],
};

export function formatCOP(value) {
  return `$${value.toLocaleString("es-CO")} COP`;
}
