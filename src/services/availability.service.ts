import type { DayAvailability } from "@/models";
import type { AvailabilityRepository } from "@/repositories/availability.repository";
import { SCHEDULE } from "@/config/site";
import { addDays, dayOfMonth, nowInTimeZone, timeToMinutes, weekdayOf, type ZonedNow } from "@/utils/date";
import { formatTime12h } from "@/utils/format";
import { capitalize } from "@/utils/text";

/**
 * Reglas de agenda: qué días y horas se pueden reservar y cómo se nombran.
 * Los horarios en bruto vienen del repositorio; aquí se aplican las reglas
 * de la clínica (días cerrados, margen para hoy) y las etiquetas.
 *
 * Depende de la hora actual ⇒ se ejecuta en el navegador (ver hooks/useAvailability).
 */

const WEEKDAY_ABBR = ["DOM", "LUN", "MAR", "MIÉ", "JUE", "VIE", "SÁB"] as const;
/** Ventana máxima (días) en la que se buscan horarios. */
const SEARCH_WINDOW_DAYS = 21;

export interface AvailabilityService {
  /** Próximos `count` días con al menos un horario libre. */
  getDays(doctorSlug: string, count?: number): Promise<DayAvailability[]>;
  /** "Hoy · 16:00", "Mañana · 09:30", "Jue 12 · 11:00" */
  getNextAvailableLabel(doctorSlug: string): Promise<string>;
}

export type Clock = () => ZonedNow;

function openDates(today: string): string[] {
  const dates: string[] = [];
  for (let offset = 0; offset < SEARCH_WINDOW_DAYS; offset++) {
    const date = addDays(today, offset);
    if (!SCHEDULE.closedWeekdays.includes(weekdayOf(date))) dates.push(date);
  }
  return dates;
}

function toDayAvailability(date: string, slots: string[], today: string): DayAvailability {
  const isToday = date === today;
  const dow = WEEKDAY_ABBR[weekdayOf(date)]!;
  const dayNumber = String(dayOfMonth(date));
  return {
    date,
    isToday,
    dow: isToday ? "HOY" : dow,
    dayNumber,
    label: isToday ? "hoy" : `${dow.toLowerCase()} ${dayNumber}`,
    slots,
  };
}

/** "Hoy" | "Mañana" | "Jue 12" */
function relativeDayLabel(day: DayAvailability, today: string): string {
  if (day.isToday) return "Hoy";
  if (day.date === addDays(today, 1)) return "Mañana";
  return capitalize(day.label);
}

function isBookable(date: string, time: string, now: ZonedNow): boolean {
  return date !== now.date || timeToMinutes(time) > now.minutes + SCHEDULE.sameDayLeadMinutes;
}

export function createAvailabilityService(
  repository: AvailabilityRepository,
  clock: Clock = () => nowInTimeZone(SCHEDULE.timeZone),
): AvailabilityService {
  async function loadDays(doctorSlug: string, count: number, now: ZonedNow): Promise<DayAvailability[]> {
    const dates = openDates(now.date);
    const slotsByDate = await repository.getSlotsByDate(doctorSlug, dates);
    return dates
      .map((date) => {
        const slots = (slotsByDate[date] ?? []).filter((time) => isBookable(date, time, now));
        return toDayAvailability(date, slots, now.date);
      })
      .filter((day) => day.slots.length > 0)
      .slice(0, count);
  }

  return {
    getDays: (doctorSlug, count = 7) => loadDays(doctorSlug, count, clock()),

    async getNextAvailableLabel(doctorSlug) {
      const now = clock();
      const [first] = await loadDays(doctorSlug, 1, now);
      return first ? `${relativeDayLabel(first, now.date)} · ${formatTime12h(first.slots[0]!)}` : "Consultar horarios";
    },
  };
}
