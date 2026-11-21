/** Datos de precio de un plan o paquete (sección "plans"). Montos en soles. */
export interface PlanPricing {
  /** "1 mes (cada 15 días)". Opcional: un perfil de análisis no tiene duración. */
  duration?: string;
  price: number;
  /** Ahorro frente a pagar las consultas por separado. */
  savings?: number;
}

/** Un elemento dentro de una sección de servicio: condición tratada, protocolo, suero, plan… */
export interface ServiceItem {
  title: string;
  description?: string;
  bullets?: string[];
  /** Solo en secciones "plans". */
  plan?: PlanPricing;
}

/**
 * Bloque de contenido de la página de un servicio.
 *   "cards" → título + descripción ("Problemas de salud que atendemos")
 *   "lists" → título + viñetas (protocolos, sueros)
 *   "plans" → planes con duración, precio y botón de reserva, + métodos de pago
 *   "tests" → tarifario de laboratorio con buscador (los datos están en
 *             src/data/lab-tests.ts; `items` queda vacío)
 */
export interface ServiceSection {
  title: string;
  intro?: string;
  layout: "cards" | "lists" | "plans" | "tests";
  items: ServiceItem[];
}

/** Servicio de la clínica (ozonoterapia, acupuntura…). Es el eje del sitio. */
export interface Service {
  /** URL: /servicios/[slug]/ */
  slug: string;
  name: string;
  /** Título corto de la tarjeta del inicio ("Med. Funcional y Microbiota"). */
  cardTitle: string;
  /** Frase bajo el título de la tarjeta ("Alivio del dolor"). */
  tagline: string;
  /** Path SVG del icono (viewBox 0 0 24 24, trazo). */
  icon: string;
  /** Foto de la tarjeta del servicio: 4:3, 1200 × 900, en public/images/services/. */
  card: { src: string; alt: string };
  /** Tres condiciones que atiende, mostradas en la tarjeta. */
  highlights: [string, string, string];
  /** Párrafo de presentación de la página del servicio. */
  intro: string;
  hero: {
    src: string;
    /** Versión liviana para móvil (solo banners). */
    srcMobile?: string;
    alt: string;
    /** `true` si la imagen es un banner con el título ya diseñado dentro. */
    banner: boolean;
    /** Medidas reales del banner cuando no es 2:1 (1600 × 800), para no recortarlo. */
    size?: { width: number; height: number };
  };
  /**
   * Cómo se pide el servicio. Por defecto ("agenda") se reserva con un
   * profesional, día y hora. "whatsapp": no tiene agenda de profesionales
   * (laboratorio); se solicita solo por WhatsApp y no aparece en /reservar.
   */
  booking?: "agenda" | "whatsapp";
  sections: ServiceSection[];
  /**
   * Cierre opcional en la banda final: `title` va como etiqueta ("Ozonoterapia
   * en Lima"), `text` como párrafo y `heading` reemplaza la pregunta por defecto.
   */
  closing?: { title: string; text: string; heading?: string };
}
