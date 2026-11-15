"use client";

import anime from "animejs";
import Link from "next/link";
import { useEffect, useRef } from "react";
import type { BookingPreselection, Doctor } from "@/models";
import { Button } from "@/components/ui/Button";
import { ROUTES } from "@/config/routes";
import { motionAllowed } from "@/lib/motion";
import { CONSULT_MODE_LABEL } from "@/utils/format";
import { BookingProgress } from "./BookingProgress";
import { BookingSummary } from "./BookingSummary";
import { Confirmation } from "./Confirmation";
import { DateTimeStep } from "./steps/DateTimeStep";
import { DoctorStep } from "./steps/DoctorStep";
import { PatientStep } from "./steps/PatientStep";
import { ServiceStep } from "./steps/ServiceStep";
import { useBookingForm, type BookingService } from "./useBookingForm";

/**
 * <BookingFlow> — Reserva en 4 pasos + envío por WhatsApp
 * =============================================================================
 * Solo compone la vista: el estado y las reglas viven en `useBookingForm`,
 * y el mensaje de WhatsApp se arma en services/booking.service.ts.
 * El resumen de la derecha refleja todo en vivo (confianza).
 */
export interface BookingFlowProps {
  doctors: Doctor[];
  services: BookingService[];
  preselection?: BookingPreselection;
}

const NO_PRESELECTION: BookingPreselection = {};

export function BookingFlow({ doctors, services, preselection = NO_PRESELECTION }: BookingFlowProps) {
  const form = useBookingForm({ doctors, services, preselection });
  const { step } = form;
  const panelRef = useRef<HTMLDivElement>(null);

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

  return (
    <main className="mx-auto flex max-w-checkout flex-wrap items-start gap-10 px-4 sm:px-8 pb-[100px] pt-12">
      <section className="flex min-w-0 flex-[999_1_580px] flex-col gap-8">
        {step < 5 && <BookingProgress step={step} />}

        <div ref={panelRef} key={step} className="flex flex-col gap-6">
          {step === 1 && (
            <ServiceStep
              services={form.services}
              selected={form.service?.slug}
              onSelect={form.chooseService}
              details={form.details}
              onDetailsChange={form.setDetails}
            />
          )}
          {step === 2 && (
            <DoctorStep
              doctors={form.serviceDoctors}
              selected={form.doctor}
              recommendedSlug={form.recommendedSlug}
              availability={form.availability}
              onSelect={form.chooseDoctor}
              mode={form.mode}
              onModeChange={form.setMode}
            />
          )}
          {step === 3 && (
            <DateTimeStep
              days={form.days}
              date={form.slot.date}
              time={form.slot.time}
              onDateChange={form.chooseDate}
              onTimeChange={form.chooseTime}
            />
          )}
          {step === 4 && (
            <PatientStep
              {...form.patient}
              errors={form.errors}
              onFullNameChange={form.setFullName}
              onDocumentIdChange={form.setDocumentId}
              onConsentChange={form.setConsent}
            />
          )}
          {step === 5 && form.whatsAppUrl && (
            <Confirmation
              firstName={form.patient.fullName.trim().split(" ")[0] || "listo"}
              doctorShortName={form.doctor.shortName}
              when={form.whenPhrase}
              whatsAppUrl={form.whatsAppUrl}
              onAddToCalendar={form.addToCalendar}
            />
          )}
        </div>

        {step < 5 && (
          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-line pt-2">
            {step === 1 ? (
              <Link
                href={ROUTES.home}
                className="inline-flex h-[50px] items-center rounded-full border border-line-strong px-[18px] text-sm !text-ink no-underline hover:bg-tint"
              >
                Cancelar
              </Link>
            ) : (
              <Button variant="ghost" onClick={form.back} className="text-sm font-normal">
                ← Atrás
              </Button>
            )}
            {/* En el paso 4 el botón queda activo para poder mostrar los errores al pulsarlo. */}
            <Button size="lg" arrow onClick={form.next} disabled={!form.canContinue}>
              {step === 4 ? "Confirmar por WhatsApp" : "Continuar"}
            </Button>
          </div>
        )}
      </section>

      <aside aria-label="Resumen de tu cita" className="top-6 min-w-0 flex-[1_1_340px] lg:sticky">
        <BookingSummary
          doctor={form.doctor}
          serviceName={form.service?.name ?? ""}
          modeLabel={CONSULT_MODE_LABEL[form.mode]}
          when={form.whenLabel}
          place={form.place}
        />
      </aside>
    </main>
  );
}
