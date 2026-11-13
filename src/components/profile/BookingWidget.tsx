"use client";

import anime from "animejs";
import { useEffect, useRef, useState } from "react";
import type { DayAvailability, Doctor } from "@/types";
import { ButtonLink } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { Magnetic } from "@/components/motion/Magnetic";
import { ROUTES, SITE } from "@/lib/site";
import { motionAllowed } from "@/lib/motion";
import { cn } from "@/lib/cn";

/**
 * <BookingWidget> — Panel "Reserva tu cita" del perfil (columna derecha, fija)
 * =============================================================================
 * Permite elegir día y hora SIN salir del perfil; el botón final cambia su
 * texto ("Reservar jue 12 a las 10:30") y lleva a /reservar con todo
 * preseleccionado. Así el paso de reserva solo pide motivo y datos.
 *
 * Al cambiar de día, los horarios entran con un pequeño rebote (anime.js).
 * Es `position: sticky` en escritorio: acompaña el scroll del perfil.
 */
export function BookingWidget({ doctor, days }: { doctor: Doctor; days: DayAvailability[] }) {
  const [dayIdx, setDayIdx] = useState(0);
  const [slotIdx, setSlotIdx] = useState(0);
  const slotsRef = useRef<HTMLDivElement>(null);

  const day = days[dayIdx];
  const time = day?.slots[Math.min(slotIdx, (day?.slots.length ?? 1) - 1)];

  useEffect(() => {
    if (!slotsRef.current || !motionAllowed()) return;
    const buttons = slotsRef.current.querySelectorAll("button");
    anime({ targets: buttons, opacity: [0, 1], translateY: [12, 0], scale: [0.94, 1], duration: 600, delay: anime.stagger(40), easing: "easeOutBack" });
  }, [dayIdx]);

  if (!day || !time) {
    return (
      <div className="rounded-[28px] border border-[#DCE6E2] bg-white p-6 shadow-float">
        <p className="m-0 text-base">Por ahora no hay horarios publicados. Escríbenos y te avisamos.</p>
      </div>
    );
  }

  const toggle = (on: boolean) =>
    cn("cursor-pointer border transition-colors", on ? "border-teal bg-teal text-white" : "border-line bg-white text-ink hover:border-teal");

  return (
    <div className="flex flex-col gap-5 rounded-[28px] border border-[#DCE6E2] bg-white p-6 shadow-float">
      <div className="flex flex-col gap-1">
        <span className="font-serif text-3xl leading-[1.1]">Reserva tu cita</span>
        <span className="text-sm text-muted">
          S/ {doctor.price} · {doctor.durationMin} min · {doctor.modes.length > 1 ? "Presencial o video" : doctor.modes[0] === "video" ? "Por video" : "Presencial"}
        </span>
      </div>

      <fieldset className="m-0 flex flex-col gap-2.5 border-0 p-0">
        <legend className="mb-2.5 p-0 text-[13px] font-semibold">Día</legend>
        <div className="grid grid-cols-5 gap-1.5">
          {days.slice(0, 5).map((d, i) => (
            <button
              key={d.date}
              type="button"
              aria-pressed={i === dayIdx}
              onClick={() => {
                setDayIdx(i);
                setSlotIdx(0);
              }}
              className={cn(toggle(i === dayIdx), "flex h-16 flex-col items-center justify-center gap-0.5 rounded-[14px]")}
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
          {day.slots.map((t, i) => (
            <button
              key={t}
              type="button"
              aria-pressed={t === time}
              onClick={() => setSlotIdx(i)}
              className={cn(toggle(t === time), "h-[46px] rounded-xl text-sm font-medium")}
            >
              {t}
            </button>
          ))}
        </div>
      </fieldset>

      <Magnetic className="flex" strength={0.12}>
        <ButtonLink
          href={ROUTES.booking({ medico: doctor.slug, dia: day.date, hora: time })}
          size="lg"
          shape="soft"
          className="w-full"
          trackAs={{ event: "cta_click", props: { location: "profile_widget", doctor: doctor.slug } }}
        >
          Reservar {day.label} a las {time}
        </ButtonLink>
      </Magnetic>

      <span className="flex items-center gap-2 text-[13px] text-muted">
        <Icon name="check" className="flex-none text-leaf" />
        {SITE.reschedulePolicy}
      </span>
    </div>
  );
}
