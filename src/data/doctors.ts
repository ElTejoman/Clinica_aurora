import type { Doctor } from "@/types";

/**
 * =============================================================================
 * MÉDICOS
 * =============================================================================
 * ⚠️  DATOS DE MUESTRA. Los nombres, biografías y horarios son ficticios y
 *     sirven para maquetar. Antes de publicar:
 *       1. Reemplaza cada médico por uno real (o conecta un CMS, ver abajo).
 *       2. Completa todo lo que está entre corchetes: [N.º], [PRECIO], [AÑO]…
 *       3. Sube las fotos a /public/doctors/<slug>.jpg y rellena `photo`.
 *       4. Sube el video de 60 s y rellena `videoUrl`.
 *
 * ¿CÓMO PASAR A UN CMS / BASE DE DATOS?
 *   Las páginas nunca importan este array directamente: usan las funciones
 *   de abajo (`getDoctors`, `getDoctorBySlug`…). Cambia el cuerpo de esas
 *   funciones para leer de Supabase/Sanity/etc. (pueden volverse `async`)
 *   y mantén el tipo `Doctor`.
 *
 * El ORDEN del array es el orden en que aparecen en el directorio. Los cuatro
 * primeros son los que se destacan en la página de inicio.
 */

/** Formación genérica mientras no haya datos reales. */
const PLACEHOLDER_EDUCATION = (residency: string, sub?: string) =>
  [
    ...(sub ? [{ year: "[AÑO]", title: sub, place: "[INSTITUCIÓN]" }] : []),
    { year: "[AÑO]", title: residency, place: "[HOSPITAL]" },
    { year: "[AÑO]", title: "Médico Cirujano", place: "[UNIVERSIDAD]" },
  ];

export const DOCTORS: Doctor[] = [
  {
    slug: "valeria-quispe",
    name: "Dra. Valeria Quispe",
    shortName: "la Dra. Quispe",
    initials: "VQ",
    specialty: "Traumatología",
    subspecialty: "Medicina deportiva",
    zone: "espalda",
    treats: ["Dolor de espalda", "Rodilla", "Lesiones deportivas"],
    conditions: [
      "Lumbalgia",
      "Dolor de cuello",
      "Hernia de disco",
      "Dolor de rodilla",
      "Esguinces",
      "Tendinitis",
      "Lesiones deportivas",
      "Dolor de hombro",
    ],
    modes: ["presencial", "video"],
    tint: "#DCE9E5",
    bio: "Ayuda a personas con dolor de espalda, rodilla y lesiones deportivas a volver a moverse sin miedo. Prioriza un diagnóstico claro y un plan de recuperación que puedas seguir en casa.",
    cmp: "[N.º]",
    rne: "[N.º]",
    languages: "[IDIOMAS]",
    yearsExperience: "[X]",
    price: "[PRECIO]",
    durationMin: "[DURACIÓN]",
    education: PLACEHOLDER_EDUCATION(
      "Residencia en Traumatología y Ortopedia",
      "Subespecialidad en Medicina Deportiva",
    ),
    referralHint: "Si tienes dolor de espalda, rodilla o una lesión",
    related: ["andres-huaman", "martin-salazar", "lucia-paredes"],
  },
  {
    slug: "martin-salazar",
    name: "Dr. Martín Salazar",
    shortName: "el Dr. Salazar",
    initials: "MS",
    specialty: "Neurología",
    zone: "cabeza",
    treats: ["Migraña", "Mareos", "Hormigueo", "Insomnio"],
    conditions: ["Migraña", "Cefalea tensional", "Mareos y vértigo", "Hormigueo", "Adormecimiento", "Insomnio"],
    modes: ["presencial"],
    tint: "#E3EBDD",
    bio: "Neurólogo. Atiende migraña, mareos, hormigueo y problemas de sueño, con un enfoque en identificar desencadenantes y reducir la frecuencia de las crisis.",
    cmp: "[N.º]",
    rne: "[N.º]",
    languages: "[IDIOMAS]",
    yearsExperience: "[X]",
    price: "[PRECIO]",
    durationMin: "[DURACIÓN]",
    education: PLACEHOLDER_EDUCATION("Residencia en Neurología"),
    referralHint: "Si hay hormigueo o adormecimiento",
    related: ["lucia-paredes", "valeria-quispe", "andres-huaman"],
  },
  {
    slug: "camila-rojas",
    name: "Dra. Camila Rojas",
    shortName: "la Dra. Rojas",
    initials: "CR",
    specialty: "Gastroenterología",
    zone: "estomago",
    treats: ["Gastritis", "Reflujo", "Colon irritable"],
    conditions: ["Gastritis", "Reflujo", "Colon irritable", "Hinchazón abdominal", "Estreñimiento", "Acidez"],
    modes: ["presencial", "video"],
    tint: "#E6EEEC",
    bio: "Gastroenteróloga. Acompaña a pacientes con gastritis, reflujo y colon irritable para encontrar la causa y ajustar hábitos y tratamiento.",
    cmp: "[N.º]",
    rne: "[N.º]",
    languages: "[IDIOMAS]",
    yearsExperience: "[X]",
    price: "[PRECIO]",
    durationMin: "[DURACIÓN]",
    education: PLACEHOLDER_EDUCATION("Residencia en Gastroenterología"),
    referralHint: "Si el malestar es digestivo",
    related: ["lucia-paredes", "andres-huaman", "sofia-medina"],
  },
  {
    slug: "andres-huaman",
    name: "Dr. Andrés Huamán",
    shortName: "el Dr. Huamán",
    initials: "AH",
    specialty: "Reumatología",
    zone: "articulaciones",
    treats: ["Dolor articular", "Artritis", "Fibromialgia"],
    conditions: ["Dolor articular", "Artritis", "Artrosis", "Fibromialgia", "Rigidez matutina", "Gota"],
    modes: ["presencial"],
    tint: "#DDE7E9",
    bio: "Reumatólogo. Trata el dolor articular, la artritis y la fibromialgia con seguimiento cercano para controlar la inflamación a largo plazo.",
    cmp: "[N.º]",
    rne: "[N.º]",
    languages: "[IDIOMAS]",
    yearsExperience: "[X]",
    price: "[PRECIO]",
    durationMin: "[DURACIÓN]",
    education: PLACEHOLDER_EDUCATION("Residencia en Reumatología"),
    referralHint: "Si el dolor articular es inflamatorio",
    related: ["valeria-quispe", "lucia-paredes", "martin-salazar"],
  },
  {
    slug: "sofia-medina",
    name: "Dra. Sofía Medina",
    shortName: "la Dra. Medina",
    initials: "SM",
    specialty: "Dermatología",
    zone: "piel",
    treats: ["Alergias", "Acné", "Manchas"],
    conditions: ["Alergias en la piel", "Acné", "Manchas", "Dermatitis", "Caída del cabello", "Lunares"],
    modes: ["presencial", "video"],
    tint: "#E8EDE2",
    bio: "Dermatóloga. Atiende alergias, acné y manchas con tratamientos explicados paso a paso.",
    cmp: "[N.º]",
    rne: "[N.º]",
    languages: "[IDIOMAS]",
    yearsExperience: "[X]",
    price: "[PRECIO]",
    durationMin: "[DURACIÓN]",
    education: PLACEHOLDER_EDUCATION("Residencia en Dermatología"),
    referralHint: "Si la molestia aparece en la piel",
    related: ["camila-rojas", "lucia-paredes", "andres-huaman"],
  },
  {
    slug: "lucia-paredes",
    name: "Dra. Lucía Paredes",
    shortName: "la Dra. Paredes",
    initials: "LP",
    specialty: "Psiquiatría",
    zone: "mente",
    treats: ["Ansiedad", "Estrés", "Sueño", "Ánimo"],
    conditions: ["Ansiedad", "Estrés", "Insomnio", "Ánimo bajo", "Ataques de pánico", "Agotamiento"],
    modes: ["video"],
    tint: "#E1E9EE",
    bio: "Psiquiatra. Atiende ansiedad, estrés, problemas de sueño y ánimo en consultas por video.",
    cmp: "[N.º]",
    rne: "[N.º]",
    languages: "[IDIOMAS]",
    yearsExperience: "[X]",
    price: "[PRECIO]",
    durationMin: "[DURACIÓN]",
    education: PLACEHOLDER_EDUCATION("Residencia en Psiquiatría"),
    referralHint: "Si el dolor afecta tu sueño o ánimo",
    related: ["martin-salazar", "camila-rojas", "valeria-quispe"],
  },
];

/* -----------------------------------------------------------------------------
 * Funciones de acceso. Úsalas siempre en lugar del array.
 * -------------------------------------------------------------------------- */

/** Todos los médicos, en el orden del directorio. */
export function getDoctors(): Doctor[] {
  return DOCTORS;
}

/** Médicos destacados en la página de inicio. Cambia el criterio si quieres. */
export function getFeaturedDoctors(limit = 4): Doctor[] {
  return DOCTORS.slice(0, limit);
}

/** Un médico por slug, o `undefined` si no existe (la página mostrará 404). */
export function getDoctorBySlug(slug: string): Doctor | undefined {
  return DOCTORS.find((d) => d.slug === slug);
}

/** Médico destacado del hero ("Disponible hoy"). */
export function getHeroDoctor(): Doctor {
  return DOCTORS[0]!;
}

/** Médico del bloque de video en la página de inicio. */
export function getSpotlightDoctor(): Doctor {
  return getDoctorBySlug("martin-salazar") ?? DOCTORS[0]!;
}

/** Médicos relacionados que se sugieren en un perfil. */
export function getRelatedDoctors(doctor: Doctor): Doctor[] {
  return doctor.related.map(getDoctorBySlug).filter((d): d is Doctor => Boolean(d));
}

/** Texto legible de las modalidades: "Presencial · Video" */
export function formatModes(modes: Doctor["modes"]): string {
  return modes.map((m) => (m === "presencial" ? "Presencial" : "Video")).join(" · ");
}

/** "de la Dra. Quispe" / "del Dr. Salazar" (contracción correcta en español). */
export function ofDoctor(doctor: Pick<Doctor, "shortName">): string {
  return doctor.shortName.startsWith("el ") ? `del ${doctor.shortName.slice(3)}` : `de ${doctor.shortName}`;
}
