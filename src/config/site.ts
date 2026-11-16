import type { ScheduleDay } from "@/models";
import { env } from "./env";

/**
 * Datos de la clínica en un solo lugar.
 * ➜ Lo que va entre corchetes está pendiente de confirmar: búscalo con "[".
 */
export const SITE = {
  name: "Clínica Aurora",
  tagline: "Medicina integrativa en Miraflores",
  description:
    "Ozonoterapia, acupuntura, sueroterapia, nutrición, medicina funcional y medicina general en Miraflores, Lima. Atención personalizada en español, inglés y chino.",
  url: env.siteUrl,
  city: "Lima",
  address: "Av. Roca y Boloña 681, Miraflores, Lima",
  phones: ["+51 912 724 465", "+51 946 453 531"],
  /** WhatsApp en formato internacional, solo dígitos. */
  whatsapp: {
    /** Consultas generales (botón flotante y pie de página). */
    general: "51912724465",
    /** Solicitudes de cita (reserva y "Agenda aquí"). */
    booking: "51946453531",
  },
  email: "admin@limanaturalhealth.com",
  languages: ["español", "inglés", "chino"],
  social: {
    facebook: "https://www.facebook.com/limanaturalhealthclinic",
    instagram: "https://www.instagram.com/lima_natural_health_clinic",
    tiktok: "https://www.tiktok.com/@lima.natural.health",
    youtube: "https://www.youtube.com/@doctorhierba1614",
  },
  /** Métodos de pago que se muestran junto a los planes (tomados del sitio actual de la clínica). */
  payment: {
    bank: "BCP",
    account: "1939920610080",
    cci: "00219300992061008014",
  },
  /** Datos del proveedor para el Libro de Reclamaciones (DS 011-2011-PCM / DS 002-2019-SA). */
  legal: {
    name: "[RAZÓN SOCIAL]",
    ruc: "[RUC]",
    address: "[DOMICILIO FISCAL]",
  },
} as const;

export type OpeningDay = ScheduleDay;

/**
 * Horario de atención de la CLÍNICA (pie, contacto, estado "Abierto ahora").
 * La agenda de cada profesional usa su propio horario (src/data/schedules.ts)
 * y, si aún no lo tiene, este.
 */
export const OPENING_HOURS: readonly OpeningDay[] = [
  { day: "Lunes", weekday: 1, ranges: [["09:00", "11:30"], ["14:00", "18:30"]] },
  { day: "Martes", weekday: 2, ranges: [["14:00", "18:30"]] },
  { day: "Miércoles", weekday: 3, ranges: [["08:30", "12:30"], ["14:30", "17:30"]] },
  { day: "Jueves", weekday: 4, ranges: [["09:00", "11:30"], ["14:00", "18:30"]] },
  { day: "Viernes", weekday: 5, ranges: [["09:30", "13:00"], ["14:00", "18:30"]] },
  { day: "Sábado", weekday: 6, ranges: [["08:30", "12:30"]] },
  { day: "Domingo", weekday: 0, ranges: [] },
];

export interface HoursSummaryRow {
  label: string;
  /** 0 = domingo … 6 = sábado */
  weekdays: readonly number[];
  /** Vacío = cerrado. */
  ranges: readonly (readonly [string, string])[];
}

/**
 * Horario RESUMIDO para el pie de página: el rango que cubre a todo el staff.
 * El detalle varía por profesional (src/data/schedules.ts); un test avisa si
 * algún horario queda fuera de este resumen.
 */
export const OPENING_HOURS_SUMMARY: readonly HoursSummaryRow[] = [
  { label: "Lunes a viernes", weekdays: [1, 2, 3, 4, 5], ranges: [["08:30", "18:30"]] },
  { label: "Sábados", weekdays: [6], ranges: [["08:30", "13:00"]] },
  { label: "Domingos", weekdays: [0], ranges: [] },
];

/** ¿Los números de WhatsApp tienen formato válido? (solo dígitos, con código de país) */
export const isWhatsAppConfigured = Object.values(SITE.whatsapp).every((n) => /^\d{9,15}$/.test(n));

/** Reglas de la agenda. */
export const SCHEDULE = {
  timeZone: "America/Lima",
  /** Desfase respecto de UTC en horas (Lima: −5, sin horario de verano). */
  utcOffsetHours: -5,
  /** Margen mínimo (min) entre "ahora" y el primer horario reservable de hoy. */
  sameDayLeadMinutes: 30,
  /** Duración de la consulta (min): la clínica dedica 30 minutos por paciente. */
  defaultDurationMin: 30,
  /** Días cerrados, derivados del horario. */
  closedWeekdays: OPENING_HOURS.filter((d) => d.ranges.length === 0).map((d) => d.weekday) as readonly number[],
} as const;
