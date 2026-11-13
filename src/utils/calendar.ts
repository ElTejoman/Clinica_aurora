/**
 * Genera un archivo .ics (calendario) compatible con Google Calendar,
 * Apple Calendar y Outlook, sin integraciones.
 */
export interface CalendarEvent {
  title: string;
  description: string;
  location: string;
  /** "YYYY-MM-DD" en la hora local de la clínica. */
  date: string;
  /** "HH:mm" en la hora local de la clínica. */
  time: string;
  durationMin: number;
  /** Desfase de la hora local respecto de UTC, en horas (Lima: −5). */
  utcOffsetHours: number;
}

const formatUtc = (date: Date) => date.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
const escapeText = (text: string) => text.replace(/([,;\\])/g, "\\$1").replace(/\n/g, "\\n");

export function buildIcs(event: CalendarEvent): string {
  const [y, m, d] = event.date.split("-").map(Number) as [number, number, number];
  const [hh, mm] = event.time.split(":").map(Number) as [number, number];
  const start = new Date(Date.UTC(y, m - 1, d, hh - event.utcOffsetHours, mm));
  const end = new Date(start.getTime() + event.durationMin * 60_000);

  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Clinica Aurora//Reservas//ES",
    "BEGIN:VEVENT",
    `UID:${start.getTime()}-${Math.random().toString(36).slice(2)}@clinicaaurora`,
    `DTSTAMP:${formatUtc(new Date())}`,
    `DTSTART:${formatUtc(start)}`,
    `DTEND:${formatUtc(end)}`,
    `SUMMARY:${escapeText(event.title)}`,
    `DESCRIPTION:${escapeText(event.description)}`,
    `LOCATION:${escapeText(event.location)}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
}
