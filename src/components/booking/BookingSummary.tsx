"use client";

import anime from "animejs";
import { useEffect, useRef } from "react";
import type { Doctor } from "@/models";
import { DoctorPortrait } from "@/components/ui/DoctorPortrait";
import { motionAllowed } from "@/lib/motion";

/**
 * <BookingSummary> — Resumen oscuro "TU CITA" (columna derecha de /reservar)
 * =============================================================================
 * Refleja en vivo cada elección. Cuando un valor cambia, ese valor hace un
 * pequeño "pop" (anime.js) para que el ojo note que se actualizó.
 */
export function BookingSummary({
  doctor,
  serviceName,
  modeLabel,
  when,
  place,
}: {
  doctor: Doctor;
  serviceName: string;
  modeLabel: string;
  when: string;
  place: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const first = useRef(true);

  // Entrada desde la derecha al montar
  useEffect(() => {
    if (!ref.current || !motionAllowed()) return;
    anime({ targets: ref.current, opacity: [0, 1], translateX: [40, 0], duration: 1100, delay: 200, easing: "easeOutExpo" });
  }, []);

  // "Pop" cuando cambia algo
  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    if (!ref.current || !motionAllowed()) return;
    anime({
      targets: ref.current.querySelectorAll("[data-sum]"),
      scale: [0.92, 1],
      opacity: [0.3, 1],
      duration: 600,
      easing: "easeOutBack",
    });
  }, [doctor.slug, serviceName, modeLabel, when]);

  const rows: [string, string][] = [
    ["Servicio", serviceName || "—"],
    ["Modalidad", modeLabel],
    ["Fecha y hora", when || "—"],
    ["Lugar", place],
  ];

  return (
    <div ref={ref} className="flex flex-col gap-[18px] rounded-[28px] bg-night p-6 text-night-ice">
      <span className="text-xs font-semibold tracking-[1.4px] text-leaf-mint">TU CITA</span>
      <div className="flex items-center gap-3.5">
        <span data-sum="">
          <DoctorPortrait doctor={doctor} className="h-16 w-16 rounded-2xl" initialsSize={28} label={null} rings="none" sizes="64px" />
        </span>
        <span className="flex flex-col gap-[3px]">
          <span className="font-display text-[26px] leading-[1.1]">{doctor.name}</span>
          <span className="text-[13px] text-night-soft">{doctor.specialty}</span>
        </span>
      </div>
      <dl className="m-0 flex flex-col border-t border-night-ice/15">
        {rows.map(([label, value], i) => (
          <div
            key={label}
            className={`flex justify-between gap-3 py-3.5 text-sm ${i < rows.length - 1 ? "border-b border-night-ice/15" : ""}`}
          >
            <dt className="text-night-soft">{label}</dt>
            <dd data-sum="" className="m-0 text-right">
              {value}
            </dd>
          </div>
        ))}
      </dl>
      <span className="text-[13px] leading-relaxed text-night-soft">La clínica confirma tu cita por WhatsApp. Consulta de 30 minutos.</span>
    </div>
  );
}
