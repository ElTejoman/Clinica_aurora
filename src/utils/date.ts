/**
 * Fechas como texto ISO "YYYY-MM-DD" (sin hora), para que el resultado no
 * dependa de la zona horaria del navegador ni del servidor.
 */

export interface ZonedNow {
  /** Fecha local en la zona pedida: "YYYY-MM-DD". */
  date: string;
  /** Minutos transcurridos desde las 00:00 locales. */
  minutes: number;
}

/** Fecha y hora actuales en una zona horaria IANA (p. ej. "America/Lima"). */
export function nowInTimeZone(timeZone: string, now: Date = new Date()): ZonedNow {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(now);
  const get = (type: string) => parts.find((p) => p.type === type)?.value ?? "00";
  return {
    date: `${get("year")}-${get("month")}-${get("day")}`,
    minutes: (Number(get("hour")) % 24) * 60 + Number(get("minute")),
  };
}

/** Mediodía UTC de una fecha ISO: evita saltos de día por horario de verano. */
function toUtcNoon(isoDate: string): Date {
  const [y, m, d] = isoDate.split("-").map(Number) as [number, number, number];
  return new Date(Date.UTC(y, m - 1, d, 12));
}

export function addDays(isoDate: string, days: number): string {
  const date = toUtcNoon(isoDate);
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
}

/** 0 = domingo … 6 = sábado */
export function weekdayOf(isoDate: string): number {
  return toUtcNoon(isoDate).getUTCDay();
}

export function dayOfMonth(isoDate: string): number {
  return toUtcNoon(isoDate).getUTCDate();
}

/** "16:45" → 1005 */
export function timeToMinutes(time: string): number {
  const [h, m] = time.split(":").map(Number) as [number, number];
  return h * 60 + m;
}

/** "2026-11-13" → "jueves, 13 de noviembre" (sin depender de la zona del navegador). */
export function formatLongDate(isoDate: string, locale = "es-PE"): string {
  return new Intl.DateTimeFormat(locale, { weekday: "long", day: "numeric", month: "long", timeZone: "UTC" }).format(toUtcNoon(isoDate));
}
