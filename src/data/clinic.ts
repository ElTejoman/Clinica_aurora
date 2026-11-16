/**
 * Contenido institucional de la clínica (textos fijos de secciones).
 * Edita aquí los textos; los componentes solo los muestran.
 */

import type { GalleryPhoto } from "@/models";

export interface Banner {
  src: string;
  srcMobile: string;
  alt: string;
  /** A dónde lleva el banner al hacer clic. */
  href: string;
}

/** Carrusel del inicio: banners con el texto ya diseñado (1600×800, versión móvil 800×400). */
export const HOME_BANNERS: Banner[] = [
  { src: "/images/banners/banner-medicina-integrativa-1600.webp", srcMobile: "/images/banners/banner-medicina-integrativa-800.webp", alt: "Clínica de medicina integrativa: medicina china, terapias naturales, manejo del dolor y salud integral", href: "/servicios/" },
  { src: "/images/banners/banner-acupuntura-1600.webp", srcMobile: "/images/banners/banner-acupuntura-800.webp", alt: "Servicio de acupuntura", href: "/servicios/acupuntura/" },
  { src: "/images/banners/banner-ozonoterapia-1600.webp", srcMobile: "/images/banners/banner-ozonoterapia-800.webp", alt: "Servicio de ozonoterapia", href: "/servicios/ozonoterapia/" },
  { src: "/images/banners/banner-nutricion-embarazadas-1600.webp", srcMobile: "/images/banners/banner-nutricion-embarazadas-800.webp", alt: "Servicio de nutrición para embarazadas", href: "/servicios/nutricion/" },
  { src: "/images/banners/banner-prp-facial-1600.webp", srcMobile: "/images/banners/banner-prp-facial-800.webp", alt: "Servicio de plasma rico en plaquetas facial", href: "/servicios/ozonoterapia/" },
  { src: "/images/banners/banner-dr-rondon-1600.webp", srcMobile: "/images/banners/banner-dr-rondon-800.webp", alt: "Doctor Rondón, especialista en ozonoterapia", href: "/staff-de-profesionales/ronald-rondon/" },
];

/**
 * Galería del inicio (fotos reales de la clínica). El ORDEN importa: en el
 * mosaico las verticales ocupan dos filas y las dos fotos del mismo paciente
 * (acupuntura en camilla y evaluación de postura) quedan en diagonal, nunca
 * lado a lado. Escritorio (4 col.):  vertical | 2 | 3 | vertical
 *                                              | 5 | 6 |
 */
export const GALLERY: readonly GalleryPhoto[] = [
  { src: "/images/clinic/sueroterapia.webp", alt: "Aplicación de sueroterapia a una paciente en un sillón", caption: "Sueroterapia", orientation: "portrait" },
  { src: "/images/clinic/terapia-acupuntura.webp", alt: "Sesión de acupuntura en camilla", caption: "Sesión de acupuntura", orientation: "landscape" },
  { src: "/images/clinic/dos-profesionales.webp", alt: "Paciente y profesional sonrientes en la sala de espera", caption: "Sala de espera", orientation: "landscape" },
  { src: "/images/clinic/tratamiento-acupuntura.webp", alt: "Tratamiento de acupuntura a una paciente en camilla", caption: "Tratamiento de acupuntura", orientation: "portrait" },
  { src: "/images/clinic/clinica-moderna.webp", alt: "Profesional y paciente en un consultorio luminoso", caption: "Consultorio", orientation: "landscape" },
  { src: "/images/clinic/evaluacion-postura.webp", alt: "Evaluación de postura a un paciente", caption: "Evaluación de postura", orientation: "landscape" },
];

/** "Tenemos el respaldo de:" */
export const AFFILIATIONS = [
  { name: "Colegio Médico del Perú", logo: "/images/respaldo/colegio-medico.webp", detail: "Médicos colegiados en el Perú, con número CMP." },
  {
    name: "Beijing University of Chinese Medicine",
    logo: "/images/respaldo/beijing-university.webp",
    detail: "Formación en Medicina China y Acupuntura de nuestro especialista.",
  },
  { name: "Dongzhimen Hospital", logo: "/images/respaldo/dongzhimen-hospital.webp", detail: "Experiencia clínica en Acupuntura y Moxibustión en Beijing." },
];

/** "¿Por qué elegir Clínica Aurora?" */
export const WHY_CHOOSE = [
  { title: "Consultas médicas de 30 minutos", text: "Dedicamos el tiempo necesario para escucharte, conocer tu historia clínica y evaluar tus necesidades, sin apresurar la atención." },
  { title: "Atención verdaderamente personalizada", text: "Nuestros médicos se toman el tiempo de conversar contigo, resolver tus dudas y explicarte tus opciones de tratamiento." },
  { title: "Profesionales de distintas especialidades", text: "Un equipo multidisciplinario para atender diferentes necesidades de salud." },
  { title: "Enfoque integral de la salud", text: "Consideramos a cada paciente de manera global, buscando alternativas de atención adaptadas a sus necesidades." },
  { title: "Instalaciones modernas y acogedoras", text: "Un espacio diseñado para brindarte comodidad, tranquilidad y confianza." },
  { title: "Atención trilingüe", text: "Te atendemos en español, inglés y chino." },
];

/** Recomendaciones generales antes de una sesión (página de contacto). */
export const VISIT_RECOMMENDATIONS = [
  "Llega 10 a 15 minutos antes de tu cita.",
  "Usa ropa cómoda y holgada (se recomienda short para algunas terapias).",
  "Toma agua antes y después de la sesión.",
  "Ingiere una comida ligera antes de tu tratamiento.",
  "Informa al personal sobre cambios en tu salud o medicamentos nuevos.",
  "Date un tiempo para descansar después de la sesión.",
];
