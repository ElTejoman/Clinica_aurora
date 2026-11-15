import type { RatingSummary, Review } from "@/models";

/**
 * Reseñas públicas de Google de la clínica, en su idioma original. Algunas
 * están abreviadas o con la ortografía corregida, sin cambiar su sentido.
 * Solo reseñas verificables: nunca inventes testimonios.
 * Se excluyó una reseña escrita por un miembro del staff.
 *
 * `serviceSlugs` decide en qué página de servicio aparece cada una;
 * en el inicio se muestran todas.
 */

const GOOGLE_PLACE_ID = "ChIJY0qZ6lPJBZERtwkCDWM_DOA";

export const RATING: RatingSummary = {
  source: "Google",
  count: 48,
  url: `https://www.google.com/maps/search/?api=1&query=Google&query_place_id=${GOOGLE_PLACE_ID}`,
};

/** Enlace oficial de Google para dejar una reseña. */
export const WRITE_REVIEW_URL = `https://search.google.com/local/writereview?placeid=${GOOGLE_PLACE_ID}`;

export const REVIEWS: Review[] = [
  {
    author: "MaríaMalamalita",
    rating: 5,
    source: "Google",
    serviceSlugs: ["acupuntura"],
    text: "Llevo varios meses tratando mi diabetes e hígado graso con el Dr. Ricardo Meza, especialista en medicina china y acupuntura, con estudios realizados en China, y los resultados han sido realmente notables. Un tratamiento serio, personalizado y con una evolución que yo misma no esperaba tan positiva. El local es cómodo, limpio, muy bien ubicado y cuenta con estacionamiento, lo que siempre se agradece en Lima. Pero lo que marca la diferencia es la experiencia y el conocimiento del Dr. Meza. Totalmente recomendado para quienes buscan una alternativa complementaria seria y efectiva. ¡Mil puntos!",
  },
  {
    author: "Jessica Villanueva",
    rating: 5,
    source: "Google",
    serviceSlugs: ["acupuntura"],
    text: "Las sesiones de acupuntura son muy efectivas y me está dando buenos resultados para el tratamiento de mi hernia lumbar. La atención es muy buena y siempre están atentos a mi evolución. El doctor es muy paciente y te explica todas tus inquietudes. Recomendado.",
  },
  {
    author: "Isabel Amparo Cáceres",
    rating: 5,
    source: "Google",
    serviceSlugs: ["acupuntura"],
    text: "Acudí a este centro por un dolor en la rodilla izquierda, me hice acupuntura y me está yendo bien, pues el dolor me alivió muchísimo, la atención muy amable.",
  },
  {
    author: "Jesus Olivera",
    rating: 5,
    source: "Google",
    serviceSlugs: ["acupuntura"],
    text: "Soy una señora de 80 años, estoy pasando por un cáncer de mama y axila HER2. Con las sesiones de acupuntura del Dr. Ricardo Meza, con agujas descartables, no he sentido las secuelas de las 15 sesiones de quimio (dolor de cabeza y estómago, calambres, mareos, dolor de manos, neuropatía). La recuperación después de la operación fue muy rápida y sin dolor. Estoy muy agradecida con el Dr. Meza.",
  },
  {
    author: "Beau Bradley D",
    rating: 5,
    source: "Google",
    serviceSlugs: ["acupuntura"],
    text: "Great experience with Dr. Ricardo. Very professional, explained the cause of my problems with my left knee and migraines, laid out a treatment plan and I already feel the difference after 2 sessions. Thanks to your good staff.",
  },
  {
    author: "Robyn Marlow",
    rating: 5,
    source: "Google",
    serviceSlugs: ["acupuntura"],
    text: "The team at Lima Natural Health are competent and professional. I am being treated for neck pain related to disc replacement and ligament ossification. Since I have been receiving acupuncture my quality of life has significantly improved. Thank you, Dr. Meza!",
  },
  {
    author: "Laura Veronica Nieto Serna",
    rating: 5,
    source: "Google",
    serviceSlugs: [],
    text: "Excelente servicio y atención A1, quedé completamente satisfecha, cien por ciento recomendable.",
  },
];
