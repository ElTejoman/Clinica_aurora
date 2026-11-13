/**
 * =============================================================================
 * TIPOS DE DOMINIO
 * =============================================================================
 * Un solo lugar con la forma de los datos que usa el sitio. Cuando conectes un
 * CMS o una base de datos (Supabase, Sanity, Strapi…), haz que tu capa de datos
 * devuelva EXACTAMENTE estos tipos y el resto del sitio no tendrá que cambiar.
 */

/** Zonas del cuerpo / grupos de molestia que guían el embudo. */
export type PainZoneId =
  | "cabeza"
  | "espalda"
  | "articulaciones"
  | "estomago"
  | "piel"
  | "mente";

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
  /** Especialidad principal: "Traumatología" */
  specialty: string;
  /** Subtítulo de especialidad (opcional): "Medicina deportiva" */
  subspecialty?: string;
  /** Zona del embudo que atiende (une el cuestionario con el médico). */
  zone: PainZoneId;
  /** Etiquetas cortas de lo que trata (tarjetas). */
  treats: string[];
  /** Lista más larga de condiciones (perfil → "Lo que trata"). */
  conditions: string[];
  /** Modalidades disponibles. */
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

/** Una molestia/zona del cuestionario y de la grilla "Busca por molestia". */
export interface PainZone {
  id: PainZoneId;
  /** Etiqueta del cuestionario: "Espalda y cuello" */
  label: string;
  /** Título más descriptivo para la grilla de inicio. */
  title: string;
  /** Ejemplos bajo la etiqueta: "Lumbalgia, contracturas" */
  hint: string;
  /** Nombre corto para los filtros del directorio. */
  filterLabel: string;
  /** Path SVG (viewBox 0 0 24 24, trazo) del icono. */
  icon: string;
  /** Palabras que, si aparecen en el buscador, llevan a esta zona. */
  keywords: string[];
  /** Slug del médico recomendado para esta zona. */
  doctorSlug: string;
}

/** Un día con sus horarios libres. */
export interface DayAvailability {
  /** Fecha ISO local "YYYY-MM-DD" (se usa en la URL de reserva). */
  date: string;
  /** "HOY", "MIÉ"… */
  dow: string;
  /** Día del mes: "12" */
  dayNumber: string;
  /** Texto para frases: "hoy", "jue 12" */
  label: string;
  /** Horas libres "HH:mm" */
  slots: string[];
}

/** Datos que el formulario de reserva envía a POST /api/appointments. */
export interface AppointmentRequest {
  doctorSlug: string;
  reason: string;
  details?: string;
  mode: ConsultMode;
  date: string;
  time: string;
  patient: {
    fullName: string;
    documentId?: string;
    phone: string;
    email?: string;
  };
  consent: boolean;
}

/** Respuesta de la API de citas. */
export interface AppointmentResponse {
  ok: true;
  appointmentId: string;
}
