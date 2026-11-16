"use client";

import type { Doctor } from "@/models";
import { SlotPicker } from "@/components/availability/SlotPicker";
import { Icon } from "@/components/ui/Icon";
import { useDoctorDays } from "@/hooks/useAvailability";
import { formatModes } from "@/utils/format";

/**
 * <BookingWidget> — Panel "Reserva tu cita" del perfil (columna derecha, fija)
 * =============================================================================
 * Tarjeta que envuelve al <SlotPicker>: el paciente elige día y hora SIN salir
 * del perfil y el botón lo lleva a /reservar con todo preseleccionado.
 * Solo ofrece horas dentro del horario del profesional (data/schedules.ts).
 *
 * Los horarios se calculan en el navegador. Es `position: sticky` en escritorio.
 */
const VISIBLE_DAYS = 5;

export function BookingWidget({ doctor, serviceSlug }: { doctor: Doctor; serviceSlug?: string }) {
  const days = useDoctorDays(doctor.slug, VISIBLE_DAYS);

  return (
    <div className="flex flex-col gap-5 rounded-[28px] border border-[#DCE6E2] bg-white p-6 shadow-float">
      <div className="flex flex-col gap-1">
        <span className="font-display text-2xl font-semibold leading-[1.1]">Reserva tu cita</span>
        <span className="text-sm text-muted">Consulta de 30 minutos · {formatModes(doctor.modes)}</span>
      </div>

      {days === undefined && <p className="m-0 min-h-[260px] text-sm text-muted">Buscando horarios…</p>}
      {days?.length === 0 && <p className="m-0 text-base">Por ahora no hay horarios publicados. Escríbenos y te avisamos.</p>}
      {days && days.length > 0 && <SlotPicker doctor={doctor} days={days} serviceSlug={serviceSlug} trackLocation="profile_widget" />}

      <span className="flex items-center gap-2 text-[13px] text-muted">
        <Icon name="check" className="flex-none text-leaf" />
        La clínica confirma tu horario por WhatsApp
      </span>
    </div>
  );
}
