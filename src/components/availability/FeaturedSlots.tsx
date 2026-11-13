"use client";

import Link from "next/link";
import { chipClass } from "@/components/ui/styles";
import { ROUTES } from "@/config/routes";
import { useDoctorDays } from "@/hooks/useAvailability";

const VISIBLE_SLOTS = 3;

/**
 * Primeros horarios libres de un médico como chips que llevan a la reserva
 * con todo preseleccionado (/reservar/?medico=…&dia=…&hora=…).
 * Reserva el alto mientras carga para que la tarjeta no "salte".
 */
export function FeaturedSlots({ slug }: { slug: string }) {
  const days = useDoctorDays(slug, 1);
  const day = days?.[0];

  if (days && !day) return null;

  return (
    <div className="flex min-h-[78px] flex-col gap-2.5 px-1" aria-busy={!day}>
      <span className="text-[13px] text-muted">{day ? `Horarios libres ${day.label}` : "Buscando horarios…"}</span>
      <div className="flex flex-wrap gap-2">
        {day?.slots.slice(0, VISIBLE_SLOTS).map((time) => (
          <Link key={time} href={ROUTES.booking({ medico: slug, dia: day.date, hora: time })} className={chipClass()}>
            {time}
          </Link>
        ))}
      </div>
    </div>
  );
}
