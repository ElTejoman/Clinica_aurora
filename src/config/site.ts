import { env } from "./env";

/**
 * Datos de la clínica en un solo lugar.
 * ➜ Reemplaza los valores entre corchetes antes de publicar. Una búsqueda de
 *   "[" en el proyecto muestra cualquier dato pendiente.
 * ⚠️ `whatsapp` es OBLIGATORIO: la reserva termina enviando un mensaje a ese número.
 */
export const SITE = {
  name: "Clínica Aurora",
  tagline: "Especialistas que te escuchan primero.",
  url: env.siteUrl,
  city: "Lima",

  phone: "[TELÉFONO]",
  /** Número de WhatsApp en formato internacional, solo dígitos (ej. 51987654321). */
  whatsapp: "[NÚMERO]",
  email: "[CORREO]",
  address: "[DIRECCIÓN]",
  hours: "[HORARIO DE ATENCIÓN]",
  insurers: "[ASEGURADORAS]",

  reschedulePolicy: "Cancela o reprograma gratis hasta 12 h antes",
} as const;

/** ¿El número de WhatsApp tiene formato válido? (solo dígitos, con código de país) */
export const isWhatsAppConfigured = /^\d{9,15}$/.test(SITE.whatsapp);

/** Reglas de la agenda. Cambia aquí si la clínica abre domingos o cambia de zona horaria. */
export const SCHEDULE = {
  timeZone: "America/Lima",
  /** Desfase respecto de UTC en horas (Lima: −5, sin horario de verano). */
  utcOffsetHours: -5,
  /** Días cerrados (0 = domingo … 6 = sábado). */
  closedWeekdays: [0] as readonly number[],
  /** Margen mínimo (min) entre "ahora" y el primer horario reservable de hoy. */
  sameDayLeadMinutes: 30,
  /** Duración por defecto de la consulta si el médico aún no tiene `durationMin`. */
  defaultDurationMin: 40,
} as const;
