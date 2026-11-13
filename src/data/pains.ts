import type { PainZone, PainZoneId } from "@/types";

/**
 * =============================================================================
 * MOLESTIAS (ZONAS DEL EMBUDO)
 * =============================================================================
 * Esta tabla es el "corazón" del embudo: conecta lo que el visitante siente
 * con el especialista que debe ver.
 *
 *   visitante escribe/elige molestia → PainZone → doctorSlug → perfil/reserva
 *
 * Para añadir una especialidad nueva:
 *   1. Añade el id en `PainZoneId` (src/types/index.ts).
 *   2. Añade aquí su entrada con icono, palabras clave y médico.
 *   3. Añade su forma 3D en src/lib/three/shapes.ts (opcional; si no, usa la esfera).
 */

export const PAIN_ZONES: PainZone[] = [
  {
    id: "cabeza",
    label: "Cabeza",
    title: "Dolor de cabeza y migraña",
    hint: "Migraña, mareos, hormigueo",
    filterLabel: "Cabeza",
    icon: "M12 3a7 7 0 0 0-7 7c0 2.4 1.2 4 2.5 5.2V20h7v-2h2a1.5 1.5 0 0 0 1.5-1.5V14l1.5-.6-1.6-3.2A7 7 0 0 0 12 3z",
    keywords: ["cabeza", "migraña", "migrana", "mareo", "vertigo", "hormigueo", "jaqueca", "cefalea"],
    doctorSlug: "martin-salazar",
  },
  {
    id: "espalda",
    label: "Espalda y cuello",
    title: "Espalda y cuello",
    hint: "Lumbalgia, contracturas",
    filterLabel: "Espalda",
    icon: "M12 3v18M9 6h6M8.5 10h7M8 14h8M8.5 18h7",
    keywords: ["espalda", "cuello", "lumbar", "lumbalgia", "columna", "contractura", "hernia", "cintura"],
    doctorSlug: "valeria-quispe",
  },
  {
    id: "articulaciones",
    label: "Articulaciones",
    title: "Dolor en articulaciones",
    hint: "Rodilla, manos, hombro",
    filterLabel: "Articulaciones",
    icon: "M8 3v6a4 4 0 0 0 8 0V3M8 21v-6a4 4 0 0 1 8 0v6",
    keywords: ["articulacion", "rodilla", "hombro", "mano", "artritis", "artrosis", "fibromialgia", "codo", "tobillo"],
    doctorSlug: "andres-huaman",
  },
  {
    id: "estomago",
    label: "Estómago",
    title: "Estómago y digestión",
    hint: "Acidez, hinchazón, colon",
    filterLabel: "Estómago",
    icon: "M9 3v4a3 3 0 0 1-3 3 3 3 0 0 0-3 3v1a7 7 0 0 0 7 7h2a7 7 0 0 0 7-7v-2a4 4 0 0 0-4-4h-1",
    keywords: ["estomago", "gastritis", "reflujo", "acidez", "colon", "digestion", "hinchazon", "barriga"],
    doctorSlug: "camila-rojas",
  },
  {
    id: "piel",
    label: "Piel",
    title: "Piel, alergias y manchas",
    hint: "Alergias, acné, manchas",
    filterLabel: "Piel",
    icon: "M12 3s6 6.5 6 11a6 6 0 0 1-12 0c0-4.5 6-11 6-11z",
    keywords: ["piel", "alergia", "acne", "mancha", "dermatitis", "picazon", "cabello", "granos"],
    doctorSlug: "sofia-medina",
  },
  {
    id: "mente",
    label: "Mente y ánimo",
    title: "Estrés, ansiedad y ánimo",
    hint: "Estrés, ansiedad, sueño",
    filterLabel: "Ánimo y sueño",
    icon: "M3 12h3l2-5 4 10 3-7 2 2h4",
    keywords: ["ansiedad", "estres", "animo", "depresion", "sueño", "sueno", "insomnio", "panico", "tristeza"],
    doctorSlug: "lucia-paredes",
  },
];

/** "¿Cómo la describirías?" (paso 2 del cuestionario). */
export const PAIN_KINDS = [
  "Punzante o aguda",
  "Constante y sorda",
  "Ardor o quemazón",
  "Va y viene",
  "Rigidez o hinchazón",
  "No me deja dormir",
] as const;

/** "¿Desde cuándo te pasa?" (paso 3 del cuestionario). */
export const PAIN_DURATIONS = ["Unos días", "Algunas semanas", "Varios meses", "Más de un año"] as const;

/** Chips "Lo más consultado" del hero: texto + zona a la que llevan. */
export const QUICK_PAINS: { label: string; zone: PainZoneId }[] = [
  { label: "Dolor de espalda", zone: "espalda" },
  { label: "Migraña", zone: "cabeza" },
  { label: "Dolor de rodilla", zone: "articulaciones" },
  { label: "Gastritis", zone: "estomago" },
  { label: "Ansiedad", zone: "mente" },
  { label: "Alergias en la piel", zone: "piel" },
];

/** Motivos de consulta del paso 1 de la reserva. */
export const BOOKING_REASONS = [
  "Dolor de espalda o cuello",
  "Dolor de rodilla",
  "Lesión deportiva",
  "Dolor de cabeza",
  "Dolor articular",
  "Molestia digestiva",
  "Control o resultados",
  "Otro motivo",
] as const;

export function getPainZone(id: string | null | undefined): PainZone | undefined {
  return PAIN_ZONES.find((z) => z.id === id);
}

/** Quita tildes y pasa a minúsculas para comparar texto libre. */
export function normalizeText(text: string): string {
  return text.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
}

/**
 * Intenta adivinar la zona a partir de lo que el visitante escribió en el
 * buscador del hero ("me duele la espalda al despertar" → "espalda").
 * Es una coincidencia por palabras clave, simple y predecible.
 * Si más adelante quieres algo más inteligente, este es el punto a cambiar
 * (por ejemplo, llamar a un endpoint de clasificación).
 */
export function matchZoneFromText(text: string): PainZone | undefined {
  const q = normalizeText(text);
  if (!q.trim()) return undefined;
  return PAIN_ZONES.find((z) => z.keywords.some((k) => q.includes(normalizeText(k))));
}
