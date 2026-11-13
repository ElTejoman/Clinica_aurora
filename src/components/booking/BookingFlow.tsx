"use client";

import anime from "animejs";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import type { ConsultMode, DayAvailability, Doctor } from "@/types";
import { BookingSummary } from "./BookingSummary";
import { Confirmation } from "./Confirmation";
import { Button } from "@/components/ui/Button";
import { DoctorPortrait } from "@/components/ui/DoctorPortrait";
import { fieldClass, optionClass } from "@/components/ui/styles";
import { BOOKING_REASONS } from "@/data/pains";
import { appointmentSchema } from "@/lib/validation";
import { buildIcs, downloadFile } from "@/lib/calendar";
import { SITE } from "@/lib/site";
import { track } from "@/lib/analytics";
import { motionAllowed } from "@/lib/motion";
import { cn } from "@/lib/cn";

/**
 * <BookingFlow> — Reserva en 4 pasos + confirmación
 * =============================================================================
 *   1. Motivo          (opciones + texto libre opcional)
 *   2. Especialista    (preseleccionado si viene de un perfil/cuestionario) + modalidad
 *   3. Fecha y hora    (días y horarios del médico elegido)
 *   4. Tus datos       (nombre, DNI, celular, correo, consentimiento)
 *   5. Confirmación    (POST /api/appointments → animación + calendario)
 *
 * Reglas de conversión aplicadas:
 *   - El botón "Continuar" solo se habilita cuando el paso está completo.
 *   - Si llegas con médico/día/hora en la URL, ya están marcados.
 *   - El resumen de la derecha refleja todo en vivo (confianza).
 *   - Si el horario se ocupó mientras reservabas (409), te devolvemos al
 *     paso 3 con un aviso, sin perder lo escrito.
 *
 * Validación: el mismo esquema zod que usa el servidor (src/lib/validation.ts).
 */

type Step = 1 | 2 | 3 | 4 | 5;
const STEP_LABELS = ["Motivo", "Especialista", "Fecha y hora", "Tus datos"];
const MODE_LABEL: Record<ConsultMode, string> = { presencial: "Presencial", video: "Videoconsulta" };

export interface BookingInitial {
  doctorSlug: string;
  /** El médico vino preseleccionado desde otra página (muestra "Recomendado"). */
  recommended: boolean;
  date?: string;
  time?: string;
  reason?: string;
}

export function BookingFlow({
  doctors,
  availability,
  initial,
}: {
  doctors: Doctor[];
  availability: Record<string, DayAvailability[]>;
  initial: BookingInitial;
}) {
  // ---------------------------------------------------------------- estado
  const [step, setStep] = useState<Step>(1);
  const [reason, setReason] = useState<string | null>(initial.reason ?? null);
  const [details, setDetails] = useState("");
  const [doctorSlug, setDoctorSlug] = useState(initial.doctorSlug);
  const doctor = doctors.find((d) => d.slug === doctorSlug) ?? doctors[0]!;
  const [mode, setMode] = useState<ConsultMode>(doctor.modes[0]!);

  const days = availability[doctorSlug] ?? [];
  const initialDayValid = days.some((d) => d.date === initial.date && d.slots.includes(initial.time ?? ""));
  const [date, setDate] = useState<string>(initialDayValid ? initial.date! : (days[0]?.date ?? ""));
  const [time, setTime] = useState<string | null>(initialDayValid ? initial.time! : null);

  const [fullName, setFullName] = useState("");
  const [documentId, setDocumentId] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  // Consentimiento: desmarcado por defecto (la Ley 29733 exige aceptación expresa).
  const [consent, setConsent] = useState(false);

  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [showErrors, setShowErrors] = useState(false);
  const [appointmentId, setAppointmentId] = useState<string | null>(null);

  const panelRef = useRef<HTMLDivElement>(null);
  const slotsRef = useRef<HTMLDivElement>(null);

  // Opciones de motivo: si llegó un motivo libre por URL, se añade al inicio.
  const reasons = useMemo(() => {
    const base: string[] = [...BOOKING_REASONS];
    return initial.reason && !base.includes(initial.reason) ? [initial.reason, ...base] : base;
  }, [initial.reason]);

  const day = days.find((d) => d.date === date);

  // Al cambiar de médico: ajusta modalidad y limpia horario si ya no existe.
  const chooseDoctor = (slug: string) => {
    const next = doctors.find((d) => d.slug === slug)!;
    setDoctorSlug(slug);
    if (!next.modes.includes(mode)) setMode(next.modes[0]!);
    const nextDays = availability[slug] ?? [];
    if (!nextDays.some((d) => d.date === date && time && d.slots.includes(time))) {
      setDate(nextDays[0]?.date ?? "");
      setTime(null);
    }
  };

  // ------------------------------------------------------------ validación
  const payload = {
    doctorSlug,
    reason: reason ?? "",
    details: details || undefined,
    mode,
    date,
    time: time ?? "",
    patient: { fullName, documentId, phone, email },
    consent,
  };
  const parsed = appointmentSchema.safeParse(payload);
  const fieldErrors = parsed.success ? {} : parsed.error.flatten((i) => i.message).fieldErrors;
  const patientErrors = useMemo(() => {
    if (parsed.success) return {} as Record<string, string>;
    const out: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      if (issue.path[0] === "patient" && typeof issue.path[1] === "string") out[issue.path[1]] ??= issue.message;
      if (issue.path[0] === "consent") out.consent = issue.message;
    }
    return out;
  }, [parsed]);

  const stepComplete: Record<1 | 2 | 3 | 4, boolean> = {
    1: Boolean(reason),
    2: Boolean(doctorSlug && mode),
    3: Boolean(date && time) && !fieldErrors.time,
    4: parsed.success,
  };

  // ------------------------------------------------------------ navegación
  const goTo = (s: Step) => {
    setStep(s);
    setShowErrors(false);
    window.scrollTo({ top: 0, behavior: motionAllowed() ? "smooth" : "auto" });
    if (s <= 4) track("booking_step", { step: s, doctor: doctorSlug });
  };

  const next = async () => {
    if (step < 4) {
      if (stepComplete[step as 1 | 2 | 3]) goTo((step + 1) as Step);
      return;
    }
    // Paso 4 → enviar
    if (!parsed.success) {
      setShowErrors(true);
      return;
    }
    setSubmitting(true);
    setServerError(null);
    try {
      const res = await fetch("/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (res.status === 409) {
        setServerError("Ese horario se acaba de ocupar. Elige otro, por favor.");
        setTime(null);
        setStep(3);
        return;
      }
      if (!res.ok) throw new Error(json.error ?? "Error");
      setAppointmentId(json.appointmentId);
      track("booking_confirmed", { doctor: doctorSlug, mode, date });
      goTo(5);
    } catch {
      setServerError("No pudimos registrar la cita. Inténtalo de nuevo o escríbenos por WhatsApp.");
    } finally {
      setSubmitting(false);
    }
  };

  const back = () => (step > 1 && step < 5 ? goTo((step - 1) as Step) : undefined);

  // ------------------------------------------------------------ animaciones
  useEffect(() => {
    const panel = panelRef.current;
    if (!panel || !motionAllowed() || step === 5) return;
    anime({ targets: panel.querySelectorAll("[data-ph]"), opacity: [0, 1], translateY: [26, 0], duration: 900, easing: "easeOutExpo" });
    anime({
      targets: panel.querySelectorAll("[data-it]"),
      opacity: [0, 1],
      translateY: [20, 0],
      duration: 800,
      delay: anime.stagger(40, { start: 120 }),
      easing: "easeOutExpo",
    });
  }, [step]);

  useEffect(() => {
    if (!slotsRef.current || !motionAllowed()) return;
    anime({
      targets: slotsRef.current.querySelectorAll("button"),
      opacity: [0, 1],
      translateY: [10, 0],
      scale: [0.94, 1],
      duration: 600,
      delay: anime.stagger(40),
      easing: "easeOutBack",
    });
  }, [date, doctorSlug]);

  // ------------------------------------------------------------ textos
  const whenText = day && time ? `${day.label} · ${time}` : "";
  const placeText = mode === "presencial" ? SITE.address : "Enlace por WhatsApp";
  const pct = Math.round(((Math.min(step, 4) - 1) / 4) * 100 + 12.5);

  const addToCalendar = () => {
    if (!day || !time) return;
    const ics = buildIcs({
      title: `Cita con ${doctor.name} · Clínica Aurora`,
      description: `${doctor.specialty}. Motivo: ${reason ?? ""}. Código: ${appointmentId ?? ""}`,
      location: placeText,
      date: day.date,
      time,
      durationMin: Number(doctor.durationMin) || 40,
    });
    downloadFile("cita-clinica-aurora.ics", ics);
  };

  const err = (key: string) =>
    showErrors && patientErrors[key] ? (
      <span id={`err-${key}`} className="text-[13px] text-[#9B2C1F]">
        {patientErrors[key]}
      </span>
    ) : null;

  return (
    <main className="mx-auto flex max-w-checkout flex-wrap items-start gap-10 px-4 sm:px-8 pb-[100px] pt-12">
      <section className="flex min-w-0 flex-[999_1_580px] flex-col gap-8">
        {/* ---------- Progreso ---------- */}
        {step < 5 && (
          <div className="flex flex-col gap-3">
            <ol className="m-0 flex list-none flex-wrap justify-between gap-2 p-0">
              {STEP_LABELS.map((label, i) => {
                const n = i + 1;
                const done = n < step;
                const current = n === step;
                return (
                  <li
                    key={label}
                    aria-current={current ? "step" : undefined}
                    className={cn("inline-flex items-center gap-2 text-[13px] font-medium", current || done ? "text-ink" : "text-faint")}
                  >
                    <span
                      className={cn(
                        "inline-flex h-[26px] w-[26px] items-center justify-center rounded-full border text-xs font-semibold",
                        current ? "border-teal bg-teal text-white" : done ? "border-teal bg-tint text-teal" : "border-line-field bg-white text-teal",
                      )}
                    >
                      {done ? "✓" : n}
                    </span>
                    {label}
                  </li>
                );
              })}
            </ol>
            <div className="h-1 overflow-hidden rounded bg-line">
              <div className="h-full bg-teal transition-[width] duration-700 ease-out" style={{ width: `${pct}%` }} />
            </div>
          </div>
        )}

        {serverError && (
          <div role="alert" className="rounded-2xl border border-warn-line bg-warn-bg px-5 py-4 text-sm text-warn-ink">
            {serverError}
          </div>
        )}

        <div ref={panelRef} key={step} className="flex flex-col gap-6">
          {/* ===== 1 · MOTIVO ===== */}
          {step === 1 && (
            <>
              <h1 data-ph="" className="m-0 font-serif text-[clamp(38px,4.2vw,56px)] font-normal leading-[1.04]">
                ¿Cuál es el motivo de tu consulta?
              </h1>
              <div className="grid grid-cols-[repeat(auto-fit,minmax(min(220px,100%),1fr))] gap-2.5">
                {reasons.map((r) => (
                  <button
                    key={r}
                    type="button"
                    data-it=""
                    aria-pressed={reason === r}
                    onClick={() => setReason(r)}
                    className={cn(optionClass(reason === r), "min-h-[60px] rounded-2xl px-[18px] text-[15px] font-medium hover:translate-y-0")}
                  >
                    {r}
                  </button>
                ))}
              </div>
              <div data-it="" className="flex flex-col gap-2">
                <label htmlFor="details" className="text-sm font-semibold">
                  Cuéntanos un poco más <span className="font-normal text-muted">(opcional)</span>
                </label>
                <textarea
                  id="details"
                  rows={3}
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  placeholder="Ej. Me duele la zona lumbar al levantarme, desde hace 3 semanas."
                  className={cn(fieldClass, "h-auto resize-y py-3.5")}
                />
              </div>
            </>
          )}

          {/* ===== 2 · ESPECIALISTA ===== */}
          {step === 2 && (
            <>
              <h1 data-ph="" className="m-0 font-serif text-[clamp(38px,4.2vw,56px)] font-normal leading-[1.04]">
                Elige a tu especialista
              </h1>
              <div className="flex flex-col gap-2.5">
                {doctors.map((d) => {
                  const on = d.slug === doctorSlug;
                  const first = availability[d.slug]?.[0];
                  return (
                    <button
                      key={d.slug}
                      type="button"
                      data-it=""
                      aria-pressed={on}
                      onClick={() => chooseDoctor(d.slug)}
                      className={cn(optionClass(on), "flex items-center gap-4 rounded-[20px] p-3.5 hover:translate-y-0")}
                    >
                      <DoctorPortrait doctor={d} className="h-16 w-16 flex-none rounded-[14px]" initialsSize={28} label={null} rings="none" sizes="64px" />
                      <span className="flex min-w-0 flex-1 flex-col gap-[3px]">
                        <span className="text-[17px] font-semibold">{d.name}</span>
                        <span className="text-[13px] text-muted">
                          {d.specialty}
                          {first && ` · Próxima cita: ${first.label} ${first.slots[0]}`}
                        </span>
                      </span>
                      {initial.recommended && d.slug === initial.doctorSlug && (
                        <span className="flex-none text-xs font-semibold text-leaf-ink">Recomendado</span>
                      )}
                    </button>
                  );
                })}
              </div>
              <fieldset className="m-0 flex flex-col gap-2.5 border-0 p-0">
                <legend className="mb-2.5 p-0 text-sm font-semibold">Modalidad</legend>
                <div className="flex flex-wrap gap-2.5">
                  {doctor.modes.map((m) => (
                    <button
                      key={m}
                      type="button"
                      aria-pressed={mode === m}
                      onClick={() => setMode(m)}
                      className={cn(optionClass(mode === m), "h-12 rounded-full px-5 text-sm font-medium hover:translate-y-0")}
                    >
                      {MODE_LABEL[m]}
                    </button>
                  ))}
                </div>
              </fieldset>
            </>
          )}

          {/* ===== 3 · FECHA Y HORA ===== */}
          {step === 3 && (
            <>
              <h1 data-ph="" className="m-0 font-serif text-[clamp(38px,4.2vw,56px)] font-normal leading-[1.04]">
                ¿Cuándo te viene bien?
              </h1>
              {days.length === 0 ? (
                <p className="m-0 text-base text-muted">No hay horarios publicados para este especialista esta semana.</p>
              ) : (
                <>
                  <div className="grid grid-cols-[repeat(auto-fit,minmax(84px,1fr))] gap-2">
                    {days.map((d) => {
                      const on = d.date === date;
                      return (
                        <button
                          key={d.date}
                          type="button"
                          data-it=""
                          aria-pressed={on}
                          onClick={() => {
                            setDate(d.date);
                            setTime(null);
                          }}
                          className={cn(
                            "flex h-[76px] cursor-pointer flex-col items-center justify-center gap-0.5 rounded-2xl border transition-colors",
                            on ? "border-teal bg-teal text-white" : "border-line bg-white text-ink hover:border-teal",
                          )}
                        >
                          <span className="text-[11px] font-semibold tracking-[.6px]">{d.dow}</span>
                          <span className="text-[22px] font-semibold">{d.dayNumber}</span>
                        </button>
                      );
                    })}
                  </div>
                  <div className="flex flex-col gap-3">
                    <span className="text-sm font-semibold">Horarios libres</span>
                    <div ref={slotsRef} className="grid grid-cols-[repeat(auto-fit,minmax(96px,1fr))] gap-2">
                      {day?.slots.map((t) => {
                        const on = t === time;
                        return (
                          <button
                            key={t}
                            type="button"
                            aria-pressed={on}
                            onClick={() => setTime(t)}
                            className={cn(
                              "h-[50px] cursor-pointer rounded-[14px] border text-[15px] font-medium transition-colors",
                              on ? "border-teal bg-teal text-white" : "border-line bg-white text-ink hover:border-teal",
                            )}
                          >
                            {t}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </>
              )}
            </>
          )}

          {/* ===== 4 · DATOS ===== */}
          {step === 4 && (
            <>
              <h1 data-ph="" className="m-0 font-serif text-[clamp(38px,4.2vw,56px)] font-normal leading-[1.04]">
                Tus datos para confirmar
              </h1>
              <div className="grid grid-cols-[repeat(auto-fit,minmax(min(260px,100%),1fr))] gap-4">
                <Field id="fullName" label="Nombre y apellido" error={err("fullName")}>
                  <input id="fullName" autoComplete="name" value={fullName} onChange={(e) => setFullName(e.target.value)} className={fieldClass} aria-invalid={Boolean(showErrors && patientErrors.fullName)} aria-describedby="err-fullName" />
                </Field>
                <Field id="documentId" label="DNI o CE" error={err("documentId")}>
                  <input id="documentId" inputMode="numeric" value={documentId} onChange={(e) => setDocumentId(e.target.value)} className={fieldClass} aria-describedby="err-documentId" />
                </Field>
                <Field id="phone" label="Celular (WhatsApp)" error={err("phone")}>
                  <input id="phone" type="tel" autoComplete="tel" placeholder="9XX XXX XXX" value={phone} onChange={(e) => setPhone(e.target.value)} className={fieldClass} aria-invalid={Boolean(showErrors && patientErrors.phone)} aria-describedby="err-phone" />
                </Field>
                <Field id="email" label="Correo" error={err("email")}>
                  <input id="email" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} className={fieldClass} aria-describedby="err-email" />
                </Field>
              </div>
              <div data-it="" className="flex flex-col gap-1.5">
                <label htmlFor="consent" className="flex cursor-pointer items-start gap-3 text-sm leading-normal text-subink">
                  <input
                    id="consent"
                    type="checkbox"
                    checked={consent}
                    onChange={(e) => setConsent(e.target.checked)}
                    className="mt-px h-5 w-5 accent-teal"
                  />
                  <span>
                    {/* TODO: enlazar la página real de política de privacidad */}
                    Acepto la <a href="#">política de privacidad</a> y recibir la confirmación por WhatsApp.
                  </span>
                </label>
                {err("consent")}
              </div>
            </>
          )}

          {/* ===== 5 · CONFIRMACIÓN ===== */}
          {step === 5 && appointmentId && (
            <Confirmation
              firstName={fullName.trim().split(" ")[0] || "listo"}
              doctorShortName={doctor.shortName}
              when={whenText ? `el ${whenText}` : ""}
              appointmentId={appointmentId}
              onAddToCalendar={addToCalendar}
            />
          )}
        </div>

        {/* ---------- Navegación ---------- */}
        {step < 5 && (
          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-line pt-2">
            {step === 1 ? (
              <Link href="/" className="inline-flex h-[50px] items-center rounded-full border border-line-strong px-[18px] text-sm !text-ink no-underline hover:bg-tint">
                Cancelar
              </Link>
            ) : (
              <Button variant="ghost" onClick={back} className="text-sm font-normal">
                ← Atrás
              </Button>
            )}
            <Button
              size="lg"
              arrow
              onClick={next}
              // En el paso 4 dejamos el botón activo para poder mostrar los errores al pulsarlo.
              disabled={submitting || (step < 4 && !stepComplete[step as 1 | 2 | 3])}
              aria-busy={submitting}
            >
              {submitting ? "Confirmando…" : step === 4 ? "Confirmar cita" : "Continuar"}
            </Button>
          </div>
        )}
      </section>

      {/* ---------- Resumen ---------- */}
      <aside aria-label="Resumen de tu cita" className="top-6 min-w-0 flex-[1_1_340px] lg:sticky">
        <BookingSummary doctor={doctor} reason={reason ?? ""} modeLabel={MODE_LABEL[mode]} when={whenText} place={placeText} />
      </aside>
    </main>
  );
}

/** Campo de formulario con etiqueta y error accesibles. */
function Field({ id, label, error, children }: { id: string; label: string; error: React.ReactNode; children: React.ReactNode }) {
  return (
    <div data-it="" className="flex flex-col gap-2">
      <label htmlFor={id} className="text-sm font-semibold">
        {label}
      </label>
      {children}
      {error}
    </div>
  );
}
