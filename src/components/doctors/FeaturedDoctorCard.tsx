import type { Doctor } from "@/models";
import { AvailableTodayBadge } from "@/components/availability/AvailableTodayBadge";
import { FeaturedSlots } from "@/components/availability/FeaturedSlots";
import { DoctorPortrait } from "@/components/ui/DoctorPortrait";
import { ButtonLink } from "@/components/ui/Button";
import { ROUTES } from "@/config/routes";

/**
 * <FeaturedDoctorCard> — Médico destacado del hero (inicio)
 * =============================================================================
 * Tarjeta "de cristal" (backdrop-blur) sobre la ola 3D. Es la pieza clave de
 * un embudo centrado en médicos: el visitante ve a una persona real, que
 * atiende HOY, con horarios clicables que llevan directo a la reserva con
 * todo preseleccionado (/reservar/?medico=…&dia=…&hora=…).
 *
 * Los horarios se calculan en el navegador (<FeaturedSlots>, <AvailableTodayBadge>):
 * el HTML es estático y la hora cambia.
 */
export function FeaturedDoctorCard({ doctor }: { doctor: Doctor }) {
  return (
    <div className="flex w-full max-w-[420px] flex-col gap-[18px] rounded-[28px] border border-[#DCE6E2] bg-white/80 p-5 shadow-float backdrop-blur-[14px] transition-[transform,box-shadow] duration-[450ms] ease-out hover:-translate-y-1.5">
      <DoctorPortrait doctor={doctor} className="aspect-[4/3.4] rounded-[20px]" initialsSize={120} label="FOTO DEL MÉDICO" rings="top" priority>
        <AvailableTodayBadge
          slug={doctor.slug}
          label="Disponible hoy"
          className="absolute left-3.5 top-3.5 rounded-full bg-white px-3 py-[7px]"
        />
      </DoctorPortrait>

      <div className="flex flex-col gap-1 px-1">
        <span className="text-xs font-semibold uppercase tracking-[1.2px] text-leaf">
          {doctor.specialty}
          {doctor.subspecialty && ` · ${doctor.subspecialty}`}
        </span>
        <span className="font-serif text-[34px] leading-[1.1]">{doctor.name}</span>
        <span className="text-sm text-muted">{doctor.treats.join(", ")}</span>
      </div>

      <FeaturedSlots slug={doctor.slug} />

      <div className="flex flex-wrap gap-2.5">
        <ButtonLink
          href={ROUTES.booking({ medico: doctor.slug })}
          shape="soft"
          className="flex-[1_1_180px]"
          trackAs={{ event: "cta_click", props: { location: "hero_featured", doctor: doctor.slug } }}
        >
          Reservar con {doctor.shortName}
        </ButtonLink>
        <ButtonLink href={ROUTES.doctor(doctor.slug)} variant="ghost" shape="soft">
          Ver perfil
        </ButtonLink>
      </div>
    </div>
  );
}
