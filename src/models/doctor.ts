import type { PainZoneId } from "./pain-zone";

/** Modalidades de consulta. */
export type ConsultMode = "presencial" | "video";

/** Un hito de formación del médico (se muestra como línea de tiempo). */
export interface EducationItem {
  /** Año o rango. Usa "[AÑO]" mientras no tengas el dato real. */
  year: string;
  title: string;
  place: string;
}

/** Ficha completa de un médico. Es la pieza central del sitio. */
export interface Doctor {
  /** Identificador para la URL: /especialistas/[slug] */
  slug: string;
  /** Nombre con título: "Dra. Valeria Quispe" */
  name: string;
  /** Nombre corto con artículo, para frases: "la Dra. Quispe" */
  shortName: string;
  /** Iniciales para el retrato provisional cuando aún no hay foto. */
  initials: string;
  specialty: string;
  subspecialty?: string;
  /** Zona del embudo que atiende (une el cuestionario con el médico). */
  zone: PainZoneId;
  /** Etiquetas cortas de lo que trata (tarjetas). */
  treats: string[];
  /** Lista más larga de condiciones (perfil → "Lo que trata"). */
  conditions: string[];
  modes: ConsultMode[];
  /** Color de fondo del retrato provisional. */
  tint: string;
  /** Biografía corta en tercera persona (perfil). */
  bio: string;
  /** Colegiatura. Deja "[N.º]" hasta tener el dato verificado. */
  cmp: string;
  rne: string;
  languages: string;
  yearsExperience: string;
  /** Precio de consulta en soles (texto para permitir "[PRECIO]"). */
  price: string;
  durationMin: string;
  /** Ruta de la foto (p. ej. "/doctors/valeria-quispe.jpg"). Si falta, se usan iniciales. */
  photo?: string;
  /** URL del video de presentación de 60 s (YouTube/Vimeo/MP4). */
  videoUrl?: string;
  education: EducationItem[];
  /** Frase para "También te puede ayudar": cuándo derivar a este médico. */
  referralHint: string;
  /** Slugs de médicos relacionados que se sugieren en su perfil. */
  related: string[];
}
