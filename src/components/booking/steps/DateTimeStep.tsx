"use client";

import { useRef } from "react";
import type { DayAvailability } from "@/models";
import { toggleClass } from "@/components/ui/styles";
import { useStaggeredEntrance } from "@/hooks/useStaggeredEntrance";
import { cn } from "@/utils/cn";
import { stepTitleClass } from "./stepStyles";

export function DateTimeStep({
  days,
  date,
  time,
  onDateChange,
  onTimeChange,
}: {
  /** `undefined` mientras se calculan los horarios. */
  days: DayAvailability[] | undefined;
  date: string;
  time: string | null;
  onDateChange: (date: string) => void;
  onTimeChange: (time: string) => void;
}) {
  const slotsRef = useRef<HTMLDivElement>(null);
  useStaggeredEntrance(slotsRef, "button", date);
  const day = days?.find((d) => d.date === date);

  return (
    <>
      <h1 data-ph="" className={stepTitleClass}>
        ¿Cuándo te viene bien?
      </h1>
      {days === undefined && <p className="m-0 text-base text-muted">Buscando horarios…</p>}
      {days?.length === 0 && <p className="m-0 text-base text-muted">No hay horarios publicados para este especialista esta semana.</p>}
      {days && days.length > 0 && (
        <>
          <div className="grid grid-cols-[repeat(auto-fit,minmax(84px,1fr))] gap-2">
            {days.map((d) => (
              <button
                key={d.date}
                type="button"
                data-it=""
                aria-pressed={d.date === date}
                onClick={() => onDateChange(d.date)}
                className={cn(toggleClass(d.date === date), "flex h-[76px] flex-col items-center justify-center gap-0.5 rounded-2xl")}
              >
                <span className="text-[11px] font-semibold tracking-[.6px]">{d.dow}</span>
                <span className="text-[22px] font-semibold">{d.dayNumber}</span>
              </button>
            ))}
          </div>
          <div className="flex flex-col gap-3">
            <span className="text-sm font-semibold">Horarios libres</span>
            <div ref={slotsRef} className="grid grid-cols-[repeat(auto-fit,minmax(96px,1fr))] gap-2">
              {day?.slots.map((t) => (
                <button
                  key={t}
                  type="button"
                  aria-pressed={t === time}
                  onClick={() => onTimeChange(t)}
                  className={cn(toggleClass(t === time), "h-[50px] rounded-[14px] text-[15px] font-medium")}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </>
  );
}
