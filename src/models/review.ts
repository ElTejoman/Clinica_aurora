/** Reseña pública de un paciente (hoy, copiadas de Google). */
export interface Review {
  author: string;
  text: string;
  /** 1 a 5 estrellas. */
  rating: number;
  source: "Google";
  /** Servicios a los que se refiere (para mostrarla en esa página). */
  serviceSlugs: string[];
}

/** Resumen de la calificación pública. */
export interface RatingSummary {
  source: "Google";
  /** Promedio (omitir si no se conoce con exactitud: no lo inventes). */
  average?: number;
  count: number;
  /** Enlace a la ficha pública (para leer todas o escribir una reseña). */
  url?: string;
}
