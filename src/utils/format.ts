import type { ConsultMode, DayAvailability, Doctor } from "@/models";

export const CONSULT_MODE_LABEL: Record<ConsultMode, string> = {
  presencial: "Presencial",
  video: "Videoconsulta",
};

/** "Presencial · Video" */
export function formatModes(modes: ConsultMode[]): string {
  return modes.map((m) => (m === "presencial" ? "Presencial" : "Video")).join(" · ");
}

/** "Presencial o video" / "Por video" / "Presencial" */
export function describeModes(modes: ConsultMode[]): string {
  if (modes.length > 1) return "Presencial o video";
  return modes[0] === "video" ? "Por video" : "Presencial";
}

/** "de la Dra. Quispe" / "del Dr. Salazar" (contracción correcta en español). */
export function ofDoctor(doctor: Pick<Doctor, "shortName">): string {
  return doctor.shortName.startsWith("el ") ? `del ${doctor.shortName.slice(3)}` : `de ${doctor.shortName}`;
}

/** "hoy a las 09:30" / "el jue 12 a las 10:15" */
export function describeAppointmentTime(day: Pick<DayAvailability, "isToday" | "label">, time: string): string {
  return day.isToday ? `hoy a las ${time}` : `el ${day.label} a las ${time}`;
}
