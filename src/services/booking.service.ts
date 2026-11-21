import type { BookingPreselection, BookingRequest, ConsultMode, DayAvailability, Doctor, Service } from "@/models";
import type { ContactMessage } from "@/models/contact";
import { SCHEDULE, SITE } from "@/config/site";
import { buildIcs } from "@/utils/calendar";
import { formatLongDate } from "@/utils/date";
import { CONSULT_MODE_LABEL, formatSoles, formatTime12h } from "@/utils/format";
import { whatsappUrl } from "@/utils/whatsapp";

/**
 * Reserva y contacto por WhatsApp: el sitio no guarda datos. Arma un mensaje
 * con lo que eligió el paciente y abre WhatsApp hacia el número de la clínica,
 * que confirma la cita respondiendo ese chat.
 */

export interface BookingDetails {
  request: BookingRequest;
  doctor: Pick<Doctor, "name">;
  service: Pick<Service, "name">;
}

export function bookingPlace(mode: ConsultMode): string {
  return mode === "presencial" ? SITE.address : "Enlace por WhatsApp";
}

export function buildBookingMessage({ request, doctor, service }: BookingDetails): string {
  const lines = [
    `Hola, quiero reservar una cita en ${SITE.name}:`,
    "",
    `*Servicio:* ${service.name}`,
    `*Profesional:* ${doctor.name}`,
    request.details ? `*Detalle:* ${request.details}` : null,
    `*Modalidad:* ${CONSULT_MODE_LABEL[request.mode]}`,
    `*Fecha y hora:* ${formatLongDate(request.date)} · ${formatTime12h(request.time)}`,
    `*Nombre:* ${request.patient.fullName}`,
    request.patient.documentId ? `*DNI/CE:* ${request.patient.documentId}` : null,
  ];
  return lines.filter((line): line is string => line !== null).join("\n");
}

export function buildBookingWhatsAppUrl(details: BookingDetails): string {
  return whatsappUrl(SITE.whatsapp.booking, buildBookingMessage(details));
}

/** Enlace directo "Agenda aquí" de un servicio, con el mensaje ya iniciado. */
export function serviceWhatsAppUrl(service: Pick<Service, "name">): string {
  return whatsappUrl(SITE.whatsapp.booking, `Hola, quiero agendar una cita de ${service.name} en ${SITE.name}.`);
}

/** Solicitud de un plan o perfil por WhatsApp (servicios sin agenda, como el laboratorio). */
export function planWhatsAppUrl(service: Pick<Service, "name">, plan: { title: string; price: number }): string {
  return whatsappUrl(SITE.whatsapp.booking, `Hola, me interesa el ${plan.title} (${formatSoles(plan.price)}) de ${service.name} en ${SITE.name}.`);
}

/** Mensaje del formulario "Nos encanta leerte". */
export function buildContactWhatsAppUrl(message: ContactMessage): string {
  const lines = [
    `Hola, les escribo desde la web de ${SITE.name}.`,
    "",
    `*Nombre:* ${message.fullName}`,
    message.email ? `*Correo:* ${message.email}` : null,
    `*Consulta:* ${message.message}`,
  ];
  return whatsappUrl(SITE.whatsapp.general, lines.filter((l): l is string => l !== null).join("\n"));
}

/** Archivo .ics "Agregar a mi calendario" (la cita queda como "por confirmar"). */
export function buildBookingCalendarFile({ request, doctor, service }: BookingDetails): string {
  return buildIcs({
    title: `${service.name} con ${doctor.name} (por confirmar) · ${SITE.name}`,
    description: request.details ? `Detalle: ${request.details}` : service.name,
    location: bookingPlace(request.mode),
    date: request.date,
    time: request.time,
    durationMin: SCHEDULE.defaultDurationMin,
    utcOffsetHours: SCHEDULE.utcOffsetHours,
  });
}

/** Preselección desde la URL de /reservar: ?servicio, ?medico, ?dia, ?hora, ?motivo. */
export function parseBookingPreselection(get: (key: string) => string | null): BookingPreselection {
  return {
    serviceSlug: get("servicio") ?? undefined,
    doctorSlug: get("medico") ?? undefined,
    date: get("dia") ?? undefined,
    time: get("hora") ?? undefined,
    details: get("motivo")?.trim().slice(0, 200) || undefined,
  };
}

/**
 * Paso en que abre la reserva: el primero que falta según lo que el paciente
 * ya eligió antes de llegar (por URL). Solo cuenta lo que es válido.
 *   nada → 1 Servicio · servicio → 2 Profesional · profesional → 3 Fecha y hora
 *   profesional + día y hora → 4 Tus datos
 */
export function resolveStartStep(
  preselection: Pick<BookingPreselection, "date" | "time">,
  valid: { service: boolean; doctor: boolean },
): 1 | 2 | 3 | 4 {
  if (valid.doctor) return preselection.date && preselection.time ? 4 : 3;
  return valid.service ? 2 : 1;
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
