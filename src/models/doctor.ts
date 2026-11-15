/** Modalidades de consulta. */
export type ConsultMode = "presencial" | "video";

/** Un hito de formación o experiencia (línea de tiempo del perfil). */
export interface CredentialItem {
  title: string;
  place?: string;
  year?: string;
}

/** Un área de especialidad del profesional ("Nutrición renal: …"). */
export interface SpecialtyItem {
  title: string;
  description?: string;
}

/** Ficha de un profesional del staff. */
export interface Doctor {
  /** URL: /staff-de-profesionales/[slug]/ */
  slug: string;
  /** Nombre con título: "Dr. Ricardo Meza" */
  name: string;
  /** Nombre corto con artículo, para frases: "el Dr. Meza" */
  shortName: string;
  initials: string;
  /** Especialidad visible en tarjetas y filtros: "Acupuntura" */
  specialty: string;
  /** Servicios que atiende (slugs de src/data/services.ts). */
  serviceSlugs: string[];
  /** Etiquetas cortas de lo que trata (tarjetas). */
  treats: string[];
  modes: ConsultMode[];
  /** Color de fondo del retrato provisional. */
  tint: string;
  bio: string;
  cmp?: string;
  rne?: string;
  /** Ruta de la foto en /public (p. ej. "/images/staff/ricardo-meza.webp"). */
  photo?: string;
  /** URL del video de presentación (YouTube/Vimeo/MP4). */
  videoUrl?: string;
  experience: CredentialItem[];
  specialties: SpecialtyItem[];
  /** Slugs de profesionales que se sugieren en su perfil. */
  related: string[];
}
