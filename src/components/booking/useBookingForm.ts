"use client";

import { useMemo, useState } from "react";
import type { ZodIssue } from "zod";
import type { BookingPreselection, BookingRequestInput, ConsultMode, Doctor } from "@/models";
import { BOOKING_REASONS } from "@/data/booking";
import { useAvailabilityMap } from "@/hooks/useAvailability";
import { track } from "@/lib/analytics";
import { motionAllowed } from "@/lib/motion";
import { bookingRequestSchema } from "@/models/booking";
import {
  bookingPlace,
  buildBookingCalendarFile,
  buildBookingWhatsAppUrl,
  resolveInitialSlot,
} from "@/services/booking.service";
import { downloadFile } from "@/utils/download";
import { describeAppointmentTime } from "@/utils/format";

/**
 * Estado y reglas del flujo de reserva:
 *   1 Motivo → 2 Especialista → 3 Fecha y hora → 4 Tus datos → 5 WhatsApp
 *
 * - "Continuar" solo avanza si el paso está completo.
 * - Lo que llega por URL (médico, día, hora, motivo) ya viene marcado.
 * - Al confirmar se abre WhatsApp con el mensaje armado (no se guarda nada).
 */

export type BookingStep = 1 | 2 | 3 | 4 | 5;
export type PatientField = "fullName" | "documentId" | "consent";
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

export function useBookingForm({ doctors, preselection }: { doctors: Doctor[]; preselection: BookingPreselection }) {
  const initialDoctor = doctors.find((d) => d.slug === preselection.doctorSlug) ?? doctors[0]!;
  const slugs = useMemo(() => doctors.map((d) => d.slug), [doctors]);
  const availability = useAvailabilityMap(slugs, AVAILABILITY_DAYS);

  const [step, setStep] = useState<BookingStep>(1);
  const [reason, setReason] = useState<string | null>(preselection.reason ?? null);
  const [details, setDetails] = useState("");
  const [doctorSlug, setDoctorSlug] = useState(initialDoctor.slug);
  const [mode, setMode] = useState<ConsultMode>(initialDoctor.modes[0]!);
  /** `null` = el paciente aún no eligió: se usa la preselección de la URL. */
  const [chosenSlot, setChosenSlot] = useState<Slot | null>(null);
  const [fullName, setFullName] = useState("");
  const [documentId, setDocumentId] = useState("");
  // Consentimiento desmarcado por defecto: la Ley N.º 29733 exige aceptación expresa.
  const [consent, setConsent] = useState(false);
  const [showErrors, setShowErrors] = useState(false);
  const [whatsAppUrl, setWhatsAppUrl] = useState<string | null>(null);

  const doctor = doctors.find((d) => d.slug === doctorSlug) ?? initialDoctor;
  const days = availability?.[doctorSlug];
  const slot: Slot = chosenSlot ?? (days ? resolveInitialSlot(days, preselection) : { date: "", time: null });
  const day = days?.find((d) => d.date === slot.date);
  /** Resumen: "jue 12 · 10:15" · Frase: "el jue 12 a las 10:15" */
  const whenLabel = day && slot.time ? `${day.label} · ${slot.time}` : "";
  const whenPhrase = day && slot.time ? describeAppointmentTime(day, slot.time) : "";

  const reasons = useMemo<string[]>(() => {
    const base: string[] = [...BOOKING_REASONS];
    return preselection.reason && !base.includes(preselection.reason) ? [preselection.reason, ...base] : base;
  }, [preselection.reason]);

  // `consent` es boolean en el formulario; el esquema exige `true` para aceptar la reserva.
  const input = {
    doctorSlug,
    reason: reason ?? "",
    details: details.trim() || undefined,
    mode,
    date: slot.date,
    time: slot.time ?? "",
    patient: { fullName, documentId },
    consent,
  } satisfies Omit<BookingRequestInput, "consent"> & { consent: boolean };
  const parsed = bookingRequestSchema.safeParse(input);
  const errors = showErrors && !parsed.success ? collectPatientErrors(parsed.error.issues) : {};

  const stepComplete: Record<1 | 2 | 3 | 4, boolean> = {
    1: Boolean(reason),
    2: Boolean(doctorSlug && mode),
    3: Boolean(slot.date && slot.time),
    4: parsed.success,
  };

  const goTo = (next: BookingStep) => {
    setStep(next);
    setShowErrors(false);
    window.scrollTo({ top: 0, behavior: motionAllowed() ? "smooth" : "auto" });
    if (next <= 4) track("booking_step", { step: next, doctor: doctorSlug });
  };

  const chooseDoctor = (slug: string) => {
    const next = doctors.find((d) => d.slug === slug);
    if (!next) return;
    setDoctorSlug(slug);
    if (!next.modes.includes(mode)) setMode(next.modes[0]!);
    setChosenSlot(resolveInitialSlot(availability?.[slug] ?? [], slot));
  };

  const next = () => {
    if (step === 4) sendToWhatsApp();
    else if (step < 4 && stepComplete[step as 1 | 2 | 3]) goTo((step + 1) as BookingStep);
  };

  const back = () => {
    if (step > 1 && step < 5) goTo((step - 1) as BookingStep);
  };

  const sendToWhatsApp = () => {
    if (!parsed.success) {
      setShowErrors(true);
      return;
    }
    const url = buildBookingWhatsAppUrl({ request: parsed.data, doctor });
    // Dentro del clic: los navegadores no lo bloquean como ventana emergente.
    window.open(url, "_blank", "noopener,noreferrer");
    setWhatsAppUrl(url);
    track("booking_confirmed", { doctor: doctorSlug, mode, date: slot.date });
    goTo(5);
  };

  return {
    step,
    doctors,
    doctor,
    availability,
    days,
    reasons,
    reason,
    details,
    mode,
    slot,
    whenLabel,
    whenPhrase,
    place: bookingPlace(mode),
    patient: { fullName, documentId, consent },
    errors,
    whatsAppUrl,
    recommendedSlug: preselection.doctorSlug === initialDoctor.slug ? initialDoctor.slug : null,
    canContinue: step === 4 || (step < 4 && stepComplete[step as 1 | 2 | 3]),
    setReason,
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
      if (parsed.success) downloadFile("cita-clinica-aurora.ics", buildBookingCalendarFile({ request: parsed.data, doctor }), "text/calendar");
    },
  };
}
