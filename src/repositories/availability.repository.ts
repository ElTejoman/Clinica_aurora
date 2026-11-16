import type { ScheduleDay } from "@/models";
import type { ScheduleRepository } from "./schedule.repository";
import { timeToMinutes, weekdayOf } from "@/utils/date";

/**
 * Fuente de los horarios libres de cada profesional.
 *
 * 🔌 Para conectar una agenda real (Google Calendar, tu sistema clínico…)
 *    crea otra implementación de `AvailabilityRepository` que consulte esa API
 *    desde el navegador y pásala a `createAvailabilityService` en
 *    src/hooks/useAvailability.ts. Nada más del sitio cambia.
 */
export interface AvailabilityRepository {
  /** Horarios libres ("HH:mm") por fecha ISO, para las fechas pedidas. */
  getSlotsByDate(doctorSlug: string, dates: string[]): Promise<Record<string, string[]>>;
}

const SLOT_MINUTES = 30;
const MAX_SLOTS_PER_DAY = 6;

/** Generador pseudoaleatorio con semilla (mulberry32): mismo profesional + día ⇒ mismos horarios. */
function seededRandom(seedText: string): () => number {
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

const toTime = (minutes: number) => `${String(Math.floor(minutes / 60)).padStart(2, "0")}:${String(minutes % 60).padStart(2, "0")}`;

/** Todos los inicios de consulta posibles dentro del horario de atención de ese día. */
export function candidateSlots(day: ScheduleDay | undefined): string[] {
  return (day?.ranges ?? []).flatMap(([start, end]) => {
    const slots: string[] = [];
    for (let m = timeToMinutes(start); m + SLOT_MINUTES <= timeToMinutes(end); m += SLOT_MINUTES) slots.push(toTime(m));
    return slots;
  });
}

/**
 * ⚠️ SIMULADO: horarios ocupados/libres falsos pero estables, y siempre dentro
 * del horario de atención DE ESE PROFESIONAL. La clínica confirma la hora
 * real por WhatsApp.
 */
export function createSimulatedAvailabilityRepository(schedules: ScheduleRepository): AvailabilityRepository {
  const simulate = (doctorSlug: string, date: string): string[] => {
    const weekday = weekdayOf(date);
    const pool = candidateSlots(schedules.getForDoctor(doctorSlug).days.find((d) => d.weekday === weekday));
    const rand = seededRandom(`${doctorSlug}:${date}`);
    const target = Math.min(pool.length, 3 + Math.floor(rand() * 4)); // entre 3 y 6 horarios
    return pool.filter(() => rand() < target / Math.max(pool.length, 1) + 0.05).slice(0, MAX_SLOTS_PER_DAY);
  };

  return {
    async getSlotsByDate(doctorSlug, dates) {
      return Object.fromEntries(dates.map((date) => [date, simulate(doctorSlug, date)]));
    },
  };
}
