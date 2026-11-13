import type { DayAvailability } from "@/types";

/**
 * =============================================================================
 * SERVICIO DE DISPONIBILIDAD (SIMULADO)
 * =============================================================================
 * Genera horarios libres FALSOS pero estables (el mismo médico y día siempre
 * dan los mismos horarios) para que el embudo funcione de punta a punta.
 *
 * 🔌 CÓMO CONECTARLO A TU AGENDA REAL
 *   Reemplaza el cuerpo de `getDoctorAvailability` por una llamada a tu
 *   sistema (Supabase, Google Calendar, Doctoralia, tu HIS…) y devuelve
 *   `DayAvailability[]`. Ejemplo con fetch:
 *
 *     const res = await fetch(`${API}/agenda/${slug}?desde=${from}`, {
 *       next: { revalidate: 60 },   // cachea 60 s en el servidor
 *     });
 *     return (await res.json()) as DayAvailability[];
 *
 *   Nada más del sitio necesita cambiar.
 *
 * Todas las fechas se calculan en la zona horaria de Lima, sin importar
 * dónde esté alojado el servidor.
 */

const TIME_ZONE = "America/Lima";
const DOW = ["DOM", "LUN", "MAR", "MIÉ", "JUE", "VIE", "SÁB"] as const;

/** Horas posibles de la clínica; el simulador elige un subconjunto por día. */
const SLOT_POOL = [
  "08:00", "08:30", "09:00", "09:30", "10:15", "11:00", "11:30", "12:00",
  "14:30", "15:00", "15:30", "16:00", "16:45", "17:30", "18:15", "19:00",
];

/** Fecha y hora actuales en Lima: { date: "YYYY-MM-DD", minutes: minutos desde 00:00 }. */
function nowInLima(): { date: string; minutes: number } {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(new Date());
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? "00";
  return {
    date: `${get("year")}-${get("month")}-${get("day")}`,
    minutes: (Number(get("hour")) % 24) * 60 + Number(get("minute")),
  };
}

/** Suma días a una fecha "YYYY-MM-DD" (aritmética en UTC para evitar saltos de horario). */
function addDays(isoDate: string, days: number): Date {
  const [y, m, d] = isoDate.split("-").map(Number) as [number, number, number];
  return new Date(Date.UTC(y, m - 1, d + days, 12));
}

function toIso(date: Date): string {
  return date.toISOString().slice(0, 10);
}

/** Generador pseudoaleatorio con semilla (mulberry32) para resultados estables. */
function seeded(seedText: string) {
  let h = 1779033703;
  for (let i = 0; i < seedText.length; i++) h = Math.imul(h ^ seedText.charCodeAt(i), 3432918353);
  let a = h >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Próximos días con horarios libres de un médico.
 * @param slug  médico
 * @param days  cuántos días hábiles devolver (por defecto 7; se saltan los domingos)
 */
export async function getDoctorAvailability(slug: string, days = 7): Promise<DayAvailability[]> {
  const now = nowInLima();
  const result: DayAvailability[] = [];

  for (let offset = 0; result.length < days && offset < days + 7; offset++) {
    const date = addDays(now.date, offset);
    const dowIndex = date.getUTCDay();
    if (dowIndex === 0) continue; // domingo: la clínica no atiende (ajústalo si cambia)

    const iso = toIso(date);
    const rand = seeded(`${slug}:${iso}`);
    const count = 3 + Math.floor(rand() * 4); // entre 3 y 6 horarios
    let slots = SLOT_POOL.filter(() => rand() < count / SLOT_POOL.length + 0.05).slice(0, 6);

    // Hoy: solo horarios que aún no pasaron (con 30 min de margen).
    if (offset === 0) {
      slots = slots.filter((s) => {
        const [h, m] = s.split(":").map(Number) as [number, number];
        return h * 60 + m > now.minutes + 30;
      });
    }
    if (slots.length === 0) continue;

    const isToday = offset === 0;
    const dow = isToday ? "HOY" : DOW[dowIndex]!;
    const dayNumber = String(date.getUTCDate());
    result.push({
      date: iso,
      dow,
      dayNumber,
      label: isToday ? "hoy" : `${DOW[dowIndex]!.toLowerCase()} ${dayNumber}`,
      slots,
    });
  }
  return result;
}

/**
 * Texto corto con la próxima cita libre, para tarjetas: "Hoy · 16:00",
 * "Mañana · 09:30", "Jue 12 · 11:00".
 */
export async function getNextAvailableLabel(slug: string): Promise<string> {
  const [first] = await getDoctorAvailability(slug, 2);
  if (!first) return "Consultar horarios";
  const now = nowInLima();
  const tomorrow = toIso(addDays(now.date, 1));
  const day =
    first.dow === "HOY"
      ? "Hoy"
      : first.date === tomorrow
        ? "Mañana"
        : first.label.charAt(0).toUpperCase() + first.label.slice(1);
  return `${day} · ${first.slots[0]}`;
}

/** Atajo: ¿atiende hoy? (para la etiqueta "Disponible hoy"). */
export async function isAvailableToday(slug: string): Promise<boolean> {
  const [first] = await getDoctorAvailability(slug, 1);
  return first?.dow === "HOY";
}

/** Disponibilidad de varios médicos a la vez: { slug: días[] }. */
export async function getAvailabilityMap(slugs: string[], days = 7): Promise<Record<string, DayAvailability[]>> {
  const entries = await Promise.all(slugs.map(async (s) => [s, await getDoctorAvailability(s, days)] as const));
  return Object.fromEntries(entries);
}

/** Próxima cita de varios médicos: { slug: "Hoy · 16:00" }. */
export async function getNextAvailableMap(slugs: string[]): Promise<Record<string, string>> {
  const entries = await Promise.all(slugs.map(async (s) => [s, await getNextAvailableLabel(s)] as const));
  return Object.fromEntries(entries);
}

/** Un horario concreto con etiqueta lista para mostrar ("Hoy 16:00", "Mañana 10:15", "Jue 15:30"). */
export interface UpcomingSlot {
  date: string;
  time: string;
  label: string;
}

/**
 * Los próximos `n` horarios libres de un médico, sin importar el día.
 * Lo usa el resultado del cuestionario para mostrar 3 botones de horario.
 */
export async function getUpcomingSlots(slug: string, n = 3): Promise<UpcomingSlot[]> {
  const days = await getDoctorAvailability(slug, 5);
  const tomorrow = toIso(addDays(nowInLima().date, 1));
  const out: UpcomingSlot[] = [];
  for (const day of days) {
    const dayLabel =
      day.dow === "HOY" ? "Hoy" : day.date === tomorrow ? "Mañana" : day.dow.charAt(0) + day.dow.slice(1).toLowerCase();
    for (const time of day.slots) {
      out.push({ date: day.date, time, label: `${dayLabel} ${time}` });
      if (out.length === n) return out;
    }
  }
  return out;
}
