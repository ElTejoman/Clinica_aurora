"use client";

import { useMemo, useState } from "react";
import type { ZodIssue } from "zod";
import type { BookingPreselection, BookingRequestInput, ConsultMode, Doctor, Service } from "@/models";
import { useAvailabilityMap } from "@/hooks/useAvailability";
import { track } from "@/lib/analytics";
import { motionAllowed } from "@/lib/motion";
import { bookingRequestSchema } from "@/models/booking";
import { bookingPlace, buildBookingCalendarFile, buildBookingWhatsAppUrl, resolveInitialSlot } from "@/services/booking.service";
import { downloadFile } from "@/utils/download";
import { describeAppointmentTime } from "@/utils/format";

/**
 * Estado y reglas del flujo de reserva:
 *   1 Servicio → 2 Profesional → 3 Fecha y hora → 4 Tus datos → 5 WhatsApp
 *
 * - "Continuar" solo avanza si el paso está completo.
 * - Lo que llega por URL (servicio, profesional, día, hora, motivo) ya viene marcado.
 * - En el paso 2 solo aparecen los profesionales del servicio elegido.
 * - Al confirmar se abre WhatsApp con el mensaje armado (no se guarda nada).
 */

export type BookingStep = 1 | 2 | 3 | 4 | 5;
export type PatientField = "fullName" | "documentId" | "consent";
export type BookingService = Pick<Service, "slug" | "name" | "tagline" | "icon">;
type Slot = { date: string; time: string | null };

const AVAILABILITY_DAYS = 7;

function collectPatientErrors(issues: ZodIssue[]): Partial<Record<PatientField, string>> {
  const errors: Partial<Record<PatientField, string>> = {};
  for (const issue of issues) {
    const field = (issue.path[0] === "patient" ? issue.path[1] : issue.path[0]) as PatientField;
    if (["fullName", "documentId", "consent"].includes(field)) errors[field] ??= issue.message;
  }
  return errors;
}

/** Servicio y profesional iniciales a partir de la URL, siempre coherentes entre sí. */
function resolveInitialSelection(doctors: Doctor[], services: BookingService[], pre: BookingPreselection) {
  const preDoctor = doctors.find((d) => d.slug === pre.doctorSlug);
  const service = services.find((s) => s.slug === pre.serviceSlug) ?? services.find((s) => s.slug === preDoctor?.serviceSlugs[0]);
  const offers = (d: Doctor) => !service || d.serviceSlugs.includes(service.slug);
  const doctor = (preDoctor && offers(preDoctor) ? preDoctor : doctors.find(offers)) ?? doctors[0]!;
  return { serviceSlug: service?.slug ?? null, doctor };
}

export function useBookingForm({
  doctors,
  services,
  preselection,
}: {
  doctors: Doctor[];
  services: BookingService[];
  preselection: BookingPreselection;
}) {
  const initial = useMemo(() => resolveInitialSelection(doctors, services, preselection), [doctors, services, preselection]);
  const slugs = useMemo(() => doctors.map((d) => d.slug), [doctors]);
  const availability = useAvailabilityMap(slugs, AVAILABILITY_DAYS);

  const [step, setStep] = useState<BookingStep>(1);
  const [serviceSlug, setServiceSlug] = useState<string | null>(initial.serviceSlug);
  const [details, setDetails] = useState(preselection.details ?? "");
  const [doctorSlug, setDoctorSlug] = useState(initial.doctor.slug);
  const [mode, setMode] = useState<ConsultMode>(initial.doctor.modes[0]!);
  /** `null` = el paciente aún no eligió: se usa la preselección de la URL. */
  const [chosenSlot, setChosenSlot] = useState<Slot | null>(null);
  const [fullName, setFullName] = useState("");
  const [documentId, setDocumentId] = useState("");
  // Consentimiento desmarcado por defecto: la Ley N.º 29733 exige aceptación expresa.
  const [consent, setConsent] = useState(false);
  const [showErrors, setShowErrors] = useState(false);
  const [whatsAppUrl, setWhatsAppUrl] = useState<string | null>(null);

  const service = services.find((s) => s.slug === serviceSlug);
  const doctor = doctors.find((d) => d.slug === doctorSlug) ?? initial.doctor;
  const serviceDoctors = service ? doctors.filter((d) => d.serviceSlugs.includes(service.slug)) : doctors;
  const days = availability?.[doctorSlug];
  const slot: Slot = chosenSlot ?? (days ? resolveInitialSlot(days, preselection) : { date: "", time: null });
  const day = days?.find((d) => d.date === slot.date);
  /** Resumen: "jue 12 · 10:15" · Frase: "el jue 12 a las 10:15" */
  const whenLabel = day && slot.time ? `${day.label} · ${slot.time}` : "";
  const whenPhrase = day && slot.time ? describeAppointmentTime(day, slot.time) : "";

  // `consent` es boolean en el formulario; el esquema exige `true` para aceptar la reserva.
  const input = {
    serviceSlug: serviceSlug ?? "",
    details: details.trim() || undefined,
    doctorSlug,
    mode,
    date: slot.date,
    time: slot.time ?? "",
    patient: { fullName, documentId },
    consent,
  } satisfies Omit<BookingRequestInput, "consent"> & { consent: boolean };
  const parsed = bookingRequestSchema.safeParse(input);
  const errors = showErrors && !parsed.success ? collectPatientErrors(parsed.error.issues) : {};

  const stepComplete: Record<1 | 2 | 3 | 4, boolean> = {
    1: Boolean(service),
    2: Boolean(doctorSlug && mode && (!service || doctor.serviceSlugs.includes(service.slug))),
    3: Boolean(slot.date && slot.time),
    4: parsed.success,
  };

  const goTo = (next: BookingStep) => {
    setStep(next);
    setShowErrors(false);
    window.scrollTo({ top: 0, behavior: motionAllowed() ? "smooth" : "auto" });
    if (next <= 4) track("booking_step", { step: next, doctor: doctorSlug, service: serviceSlug ?? "" });
  };

  const chooseDoctor = (slug: string) => {
    const next = doctors.find((d) => d.slug === slug);
    if (!next) return;
    setDoctorSlug(slug);
    if (!next.modes.includes(mode)) setMode(next.modes[0]!);
    setChosenSlot(resolveInitialSlot(availability?.[slug] ?? [], slot));
  };

  const chooseService = (slug: string) => {
    setServiceSlug(slug);
    if (!doctor.serviceSlugs.includes(slug)) {
      const first = doctors.find((d) => d.serviceSlugs.includes(slug));
      if (first) chooseDoctor(first.slug);
    }
  };

  const sendToWhatsApp = () => {
    if (!parsed.success || !service) {
      setShowErrors(true);
      return;
    }
    const url = buildBookingWhatsAppUrl({ request: parsed.data, doctor, service });
    // Dentro del clic: los navegadores no lo bloquean como ventana emergente.
    window.open(url, "_blank", "noopener,noreferrer");
    setWhatsAppUrl(url);
    track("booking_confirmed", { doctor: doctorSlug, service: service.slug, date: slot.date });
    goTo(5);
  };

  const next = () => {
    if (step === 4) sendToWhatsApp();
    else if (step < 4 && stepComplete[step as 1 | 2 | 3]) goTo((step + 1) as BookingStep);
  };

  const back = () => {
    if (step > 1 && step < 5) goTo((step - 1) as BookingStep);
  };

  return {
    step,
    services,
    service,
    serviceDoctors,
    doctor,
    availability,
    days,
    details,
    mode,
    slot,
    whenLabel,
    whenPhrase,
    place: bookingPlace(mode),
    patient: { fullName, documentId, consent },
    errors,
    whatsAppUrl,
    recommendedSlug: preselection.doctorSlug === initial.doctor.slug ? initial.doctor.slug : null,
    canContinue: step === 4 || (step < 4 && stepComplete[step as 1 | 2 | 3]),
    chooseService,
    setDetails,
    setMode,
    chooseDoctor,
    chooseDate: (date: string) => setChosenSlot({ date, time: null }),
    chooseTime: (time: string) => setChosenSlot({ date: slot.date, time }),
    setFullName,
    setDocumentId,
    setConsent,
    next,
    back,
    addToCalendar: () => {
      if (parsed.success && service) {
        downloadFile("cita-clinica-aurora.ics", buildBookingCalendarFile({ request: parsed.data, doctor, service }), "text/calendar");
      }
    },
  };
}
