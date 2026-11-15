/** Un elemento dentro de una sección de servicio: condición tratada, protocolo, suero, plan… */
export interface ServiceItem {
  title: string;
  description?: string;
  bullets?: string[];
}

/**
 * Bloque de contenido de la página de un servicio.
 *   "cards" → tarjetas con título + descripción ("Problemas de salud que atendemos")
 *   "lists" → tarjetas con título + viñetas (protocolos, sueros, planes)
 */
export interface ServiceSection {
  title: string;
  intro?: string;
  layout: "cards" | "lists";
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
  /** Párrafo de presentación de la página del servicio. */
  intro: string;
  hero: {
    src: string;
    /** Versión liviana para móvil (solo banners). */
    srcMobile?: string;
    alt: string;
    /** `true` si la imagen es un banner con el título ya diseñado dentro. */
    banner: boolean;
  };
  sections: ServiceSection[];
  /** Párrafo de cierre opcional ("Ozonoterapia en Lima"). */
  closing?: { title: string; text: string };
}
