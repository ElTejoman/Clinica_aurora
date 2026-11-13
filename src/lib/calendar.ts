/**
 * Genera un archivo .ics (calendario) para el botón "Agregar a mi calendario".
 * Funciona con Google Calendar, Apple Calendar y Outlook sin integraciones.
 * Las horas se escriben con la zona America/Lima (UTC−5, sin horario de verano).
 */
export function buildIcs({
  title,
  description,
  location,
  date,
  time,
  durationMin = 40,
}: {
  title: string;
  description: string;
  location: string;
  /** "YYYY-MM-DD" */
  date: string;
  /** "HH:mm" (hora de Lima) */
  time: string;
  durationMin?: number;
}): string {
  const [y, m, d] = date.split("-").map(Number) as [number, number, number];
  const [hh, mm] = time.split(":").map(Number) as [number, number];
  // Lima = UTC−5 → sumamos 5 h para pasar a UTC
  const start = new Date(Date.UTC(y, m - 1, d, hh + 5, mm));
  const end = new Date(start.getTime() + durationMin * 60_000);
  const fmt = (dt: Date) => dt.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
  const esc = (s: string) => s.replace(/([,;\\])/g, "\\$1").replace(/\n/g, "\\n");

  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Clinica Aurora//Reservas//ES",
    "BEGIN:VEVENT",
    `UID:${Date.now()}@clinicaaurora`,
    `DTSTAMP:${fmt(new Date())}`,
    `DTSTART:${fmt(start)}`,
    `DTEND:${fmt(end)}`,
    `SUMMARY:${esc(title)}`,
    `DESCRIPTION:${esc(description)}`,
    `LOCATION:${esc(location)}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
}

/** Descarga un texto como archivo en el navegador. */
export function downloadFile(filename: string, content: string, type = "text/calendar") {
  const url = URL.createObjectURL(new Blob([content], { type }));
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
