import type { ConsultMode, DayAvailability } from "@/models";

export const CONSULT_MODE_LABEL: Record<ConsultMode, string> = {
  presencial: "Presencial",
  video: "Videoconsulta",
};

/** "Presencial · Video" */
export function formatModes(modes: ConsultMode[]): string {
  return modes.map((m) => (m === "presencial" ? "Presencial" : "Video")).join(" · ");
}

/** "hoy a las 09:30" / "el jue 12 a las 10:15" */
export function describeAppointmentTime(day: Pick<DayAvailability, "isToday" | "label">, time: string): string {
  return day.isToday ? `hoy a las ${time}` : `el ${day.label} a las ${time}`;
}

/** "14:30" → "2:30 p. m." */
export function formatTime12h(time: string): string {
  const [h, m] = time.split(":").map(Number) as [number, number];
  return `${h % 12 || 12}:${String(m).padStart(2, "0")} ${h < 12 ? "a. m." : "p. m."}`;
}

/** [["09:00","11:30"],["14:00","18:30"]] → "9:00 a. m. – 11:30 a. m. y 2:00 p. m. – 6:30 p. m." */
export function formatTimeRanges(ranges: readonly (readonly [string, string])[]): string {
  return ranges.map(([start, end]) => `${formatTime12h(start)} – ${formatTime12h(end)}`).join(" y ");
}
