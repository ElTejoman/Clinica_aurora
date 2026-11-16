"use client";

import { useRef } from "react";
import type { DayAvailability, Doctor } from "@/models";
import { Magnetic } from "@/components/motion/Magnetic";
import { ButtonLink } from "@/components/ui/Button";
import { toggleClass } from "@/components/ui/styles";
import { ROUTES } from "@/config/routes";
import { useSlotSelection } from "@/hooks/useSlotSelection";
import { useStaggeredEntrance } from "@/hooks/useStaggeredEntrance";
import { cn } from "@/utils/cn";
import { formatTime12h } from "@/utils/format";

/**
 * Selector de día + hora de un profesional con botón "Reservar mar 17 a las
 * 3:00 p. m.", que abre /reservar con profesional, servicio, día y hora ya
 * elegidos (de ahí sale el mensaje de WhatsApp a la clínica).
 *
 * Reutilizable: recibe los días ya calculados (useDoctorDays) y no depende de
 * la tarjeta que lo envuelve. `trackLocation` identifica dónde está en la analítica.
 */
export function SlotPicker({
  doctor,
  days,
  serviceSlug,
  trackLocation,
}: {
  doctor: Pick<Doctor, "slug">;
  days: readonly DayAvailability[];
  serviceSlug?: string;
  trackLocation: string;
}) {
  const { day, time, dayIndex, selectDay, selectTime } = useSlotSelection(days);
  const slotsRef = useRef<HTMLDivElement>(null);
  useStaggeredEntrance(slotsRef, "button", dayIndex);

  if (!day || !time) return null;

  return (
    <>
      <fieldset className="m-0 flex flex-col gap-2.5 border-0 p-0">
        <legend className="mb-2.5 p-0 text-[13px] font-semibold">Día</legend>
        <div className="grid grid-cols-5 gap-1.5">
          {days.map((d, i) => (
            <button
              key={d.date}
              type="button"
              aria-pressed={i === dayIndex}
              onClick={() => selectDay(i)}
              className={cn(toggleClass(i === dayIndex), "flex h-16 flex-col items-center justify-center gap-0.5 rounded-[14px]")}
            >
              <span className="text-[11px] font-semibold tracking-[.6px]">{d.dow}</span>
              <span className="text-lg font-semibold">{d.dayNumber}</span>
            </button>
          ))}
        </div>
      </fieldset>

      <fieldset className="m-0 flex flex-col border-0 p-0">
        <legend className="mb-2.5 p-0 text-[13px] font-semibold">Hora</legend>
        <div ref={slotsRef} className="grid grid-cols-3 gap-1.5">
          {day.slots.map((t) => (
            <button
              key={t}
              type="button"
              aria-pressed={t === time}
              onClick={() => selectTime(t)}
              className={cn(toggleClass(t === time), "h-[46px] rounded-xl text-sm font-medium")}
            >
              {formatTime12h(t)}
            </button>
          ))}
        </div>
      </fieldset>

      <Magnetic className="flex" strength={0.12}>
        <ButtonLink
          href={ROUTES.booking({ medico: doctor.slug, servicio: serviceSlug, dia: day.date, hora: time })}
          size="lg"
          shape="soft"
          className="w-full"
          trackAs={{ event: "cta_click", props: { location: trackLocation, doctor: doctor.slug } }}
        >
          Reservar {day.label} a las {formatTime12h(time)}
        </ButtonLink>
      </Magnetic>
    </>
  );
}
