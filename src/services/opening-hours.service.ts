import type { OpeningDay } from "@/config/site";
import { addDays, timeToMinutes, weekdayOf, type ZonedNow } from "@/utils/date";

export type OpeningStatus =
  | { isOpen: true; closesAt: string }
  | { isOpen: false; opensAt: { day: string; time: string } | null };

const DAYS_TO_SCAN = 7;

/**
 * ¿La clínica está abierta ahora? Si lo está, dice a qué hora cierra el tramo
 * actual; si no, cuándo vuelve a abrir ("hoy", "mañana" o el nombre del día).
 */
export function getOpeningStatus(hours: readonly OpeningDay[], now: ZonedNow): OpeningStatus {
  const today = dayOf(hours, weekdayOf(now.date));
  const current = today?.ranges.find(([start, end]) => timeToMinutes(start) <= now.minutes && now.minutes < timeToMinutes(end));
  if (current) return { isOpen: true, closesAt: current[1] };

  const laterToday = today?.ranges.find(([start]) => timeToMinutes(start) > now.minutes);
  if (laterToday) return { isOpen: false, opensAt: { day: "hoy", time: laterToday[0] } };

  for (let offset = 1; offset <= DAYS_TO_SCAN; offset++) {
    const day = dayOf(hours, weekdayOf(addDays(now.date, offset)));
    const first = day?.ranges[0];
    if (day && first) return { isOpen: false, opensAt: { day: offset === 1 ? "mañana" : `el ${day.day.toLowerCase()}`, time: first[0] } };
  }
  return { isOpen: false, opensAt: null };
}

function dayOf(hours: readonly OpeningDay[], weekday: number): OpeningDay | undefined {
  return hours.find((d) => d.weekday === weekday);
}
