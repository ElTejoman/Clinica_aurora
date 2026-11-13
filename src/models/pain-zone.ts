/** Zonas del cuerpo / grupos de molestia que guían el embudo. */
export type PainZoneId = "cabeza" | "espalda" | "articulaciones" | "estomago" | "piel" | "mente";

/** Una molestia del cuestionario y de la grilla "Busca por molestia". */
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

/** Atajo "Lo más consultado" del hero: texto visible + zona a la que lleva. */
export interface QuickPain {
  label: string;
  zone: PainZoneId;
}
