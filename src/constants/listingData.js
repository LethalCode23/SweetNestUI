export const listing = {
  title: "City Studio en el corazón de Chapinero",
  summary:
    "Loft entero en Bogotá, Colombia · 2 huéspedes · 1 habitación · 1 cama queen · 1 baño privado",
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
  // Fallback de HU #26 si el hotel no trae políticas (mismo contenido que el seed del backend).
  policies: [
    {
      title: "Check-in y check-out",
      description:
        "El check-in es de 3:00 PM a 9:00 PM y el check-out hasta las 11:00 AM. La llegada anticipada o la salida tardía están sujetas a disponibilidad y deben coordinarse con el anfitrión.",
    },
    {
      title: "Cancelación",
      description:
        "Cancelación gratuita hasta 48 horas antes de la fecha de llegada. Después de ese plazo se cobra el valor de la primera noche.",
    },
    {
      title: "Normas de la casa",
      description:
        "No se permite fumar en espacios interiores ni realizar fiestas o eventos. Horario de silencio de 10:00 PM a 7:00 AM por respeto a los vecinos.",
    },
    {
      title: "Salud y seguridad",
      description:
        "El alojamiento cuenta con detector de humo, extintor y botiquín de primeros auxilios. Se realiza limpieza y desinfección profunda entre cada estadía.",
    },
    {
      title: "Mascotas",
      description:
        "Se admiten mascotas solo con aviso previo al anfitrión. El huésped es responsable de su cuidado y de cualquier daño que ocasionen.",
    },
    {
      title: "Cuidado del alojamiento",
      description:
        "Trata el mobiliario y los electrodomésticos con cuidado y reporta de inmediato cualquier daño o avería. Los daños causados durante la estadía serán cobrados al huésped.",
    },
  ],
};

export function formatCOP(value) {
  return `$${value.toLocaleString("es-CO")} COP`;
}
