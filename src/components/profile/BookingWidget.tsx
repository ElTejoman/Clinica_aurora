"use client";

import { useRef, useState } from "react";
import type { DayAvailability, Doctor } from "@/models";
import { Magnetic } from "@/components/motion/Magnetic";
import { ButtonLink } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { toggleClass } from "@/components/ui/styles";
import { ROUTES } from "@/config/routes";
import { SITE } from "@/config/site";
import { useDoctorDays } from "@/hooks/useAvailability";
import { useStaggeredEntrance } from "@/hooks/useStaggeredEntrance";
import { cn } from "@/utils/cn";
import { describeModes } from "@/utils/format";

/**
 * <BookingWidget> — Panel "Reserva tu cita" del perfil (columna derecha, fija)
 * =============================================================================
 * Permite elegir día y hora SIN salir del perfil; el botón final cambia su
 * texto ("Reservar jue 12 a las 10:30") y lleva a /reservar con todo
 * preseleccionado. Así el paso de reserva solo pide motivo y datos.
 *
 * Los horarios se calculan en el navegador; al cambiar de día entran con un
 * pequeño rebote (anime.js). Es `position: sticky` en escritorio.
 */
const VISIBLE_DAYS = 5;

export function BookingWidget({ doctor }: { doctor: Doctor }) {
  const days = useDoctorDays(doctor.slug, VISIBLE_DAYS);

  return (
    <div className="flex flex-col gap-5 rounded-[28px] border border-[#DCE6E2] bg-white p-6 shadow-float">
      <div className="flex flex-col gap-1">
        <span className="font-serif text-3xl leading-[1.1]">Reserva tu cita</span>
        <span className="text-sm text-muted">
          S/ {doctor.price} · {doctor.durationMin} min · {describeModes(doctor.modes)}
        </span>
      </div>

      {days === undefined && <p className="m-0 min-h-[260px] text-sm text-muted">Buscando horarios…</p>}
      {days?.length === 0 && <p className="m-0 text-base">Por ahora no hay horarios publicados. Escríbenos y te avisamos.</p>}
      {days && days.length > 0 && <SlotPicker doctor={doctor} days={days} />}

      <span className="flex items-center gap-2 text-[13px] text-muted">
        <Icon name="check" className="flex-none text-leaf" />
        {SITE.reschedulePolicy}
      </span>
    </div>
  );
}

function SlotPicker({ doctor, days }: { doctor: Doctor; days: DayAvailability[] }) {
  const [dayIdx, setDayIdx] = useState(0);
  const [slotIdx, setSlotIdx] = useState(0);
  const slotsRef = useRef<HTMLDivElement>(null);
  useStaggeredEntrance(slotsRef, "button", dayIdx);

  const day = days[Math.min(dayIdx, days.length - 1)]!;
  const time = day.slots[Math.min(slotIdx, day.slots.length - 1)]!;

  return (
    <>
      <fieldset className="m-0 flex flex-col gap-2.5 border-0 p-0">
        <legend className="mb-2.5 p-0 text-[13px] font-semibold">Día</legend>
        <div className="grid grid-cols-5 gap-1.5">
          {days.map((d, i) => (
            <button
              key={d.date}
              type="button"
              aria-pressed={i === dayIdx}
              onClick={() => {
                setDayIdx(i);
                setSlotIdx(0);
              }}
              className={cn(toggleClass(i === dayIdx), "flex h-16 flex-col items-center justify-center gap-0.5 rounded-[14px]")}
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
              className={cn(toggleClass(t === time), "h-[46px] rounded-xl text-sm font-medium")}
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
    </>
  );
}
