import type { BookingPreselection, BookingRequest, ConsultMode, DayAvailability, Doctor } from "@/models";
import { SCHEDULE, SITE } from "@/config/site";
import { buildIcs } from "@/utils/calendar";
import { formatLongDate } from "@/utils/date";
import { CONSULT_MODE_LABEL } from "@/utils/format";
import { whatsappUrl } from "@/utils/whatsapp";

/**
 * Reserva por WhatsApp: el sitio no guarda citas. Arma un mensaje con todo lo
 * que eligió el paciente y abre WhatsApp hacia el número de la clínica, que
 * confirma la cita respondiendo ese chat.
 */

export interface BookingDetails {
  request: BookingRequest;
  doctor: Doctor;
}

export function bookingPlace(mode: ConsultMode): string {
  return mode === "presencial" ? SITE.address : "Enlace por WhatsApp";
}

export function buildBookingMessage({ request, doctor }: BookingDetails): string {
  const lines = [
    `Hola, quiero reservar una cita en ${SITE.name}:`,
    "",
    `*Especialista:* ${doctor.name} (${doctor.specialty})`,
    `*Motivo:* ${request.reason}`,
    request.details ? `*Detalle:* ${request.details}` : null,
    `*Modalidad:* ${CONSULT_MODE_LABEL[request.mode]}`,
    `*Fecha y hora:* ${formatLongDate(request.date)} · ${request.time}`,
    `*Nombre:* ${request.patient.fullName}`,
    request.patient.documentId ? `*DNI/CE:* ${request.patient.documentId}` : null,
  ];
  return lines.filter((line): line is string => line !== null).join("\n");
}

export function buildBookingWhatsAppUrl(details: BookingDetails): string {
  return whatsappUrl(SITE.whatsapp, buildBookingMessage(details));
}

/** Archivo .ics "Agregar a mi calendario" (la cita queda como "por confirmar"). */
export function buildBookingCalendarFile({ request, doctor }: BookingDetails): string {
  return buildIcs({
    title: `Cita con ${doctor.name} (por confirmar) · ${SITE.name}`,
    description: `${doctor.specialty}. Motivo: ${request.reason}.`,
    location: bookingPlace(request.mode),
    date: request.date,
    time: request.time,
    durationMin: Number(doctor.durationMin) || SCHEDULE.defaultDurationMin,
    utcOffsetHours: SCHEDULE.utcOffsetHours,
  });
}

/** Preselección desde la URL de /reservar: ?medico, ?dia, ?hora, ?motivo. */
export function parseBookingPreselection(get: (key: string) => string | null): BookingPreselection {
  return {
    doctorSlug: get("medico") ?? undefined,
    date: get("dia") ?? undefined,
    time: get("hora") ?? undefined,
    reason: get("motivo")?.trim().slice(0, 120) || undefined,
  };
}

/** Día y hora iniciales: los preseleccionados si siguen libres; si no, el primer día sin hora. */
export function resolveInitialSlot(
  days: DayAvailability[],
  preselection: { date?: string; time?: string | null },
): { date: string; time: string | null } {
  const { date, time } = preselection;
  const stillFree = Boolean(date && time && days.some((d) => d.date === date && d.slots.includes(time)));
  return stillFree ? { date: date!, time: time! } : { date: days[0]?.date ?? "", time: null };
}
