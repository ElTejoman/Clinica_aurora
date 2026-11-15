import Link from "next/link";
import type { Doctor } from "@/models";
import { NextAvailableText } from "@/components/availability/NextAvailableText";
import { ButtonLink } from "@/components/ui/Button";
import { DoctorPortrait } from "@/components/ui/DoctorPortrait";
import { Icon } from "@/components/ui/Icon";
import { ROUTES } from "@/config/routes";

/**
 * Tarjetas de profesional:
 *   <StaffCard>          foto vertical + datos + "Ver perfil" / "Reservar" (staff y páginas de servicio)
 *   <RelatedDoctorCard>  compacta, para "También te puede ayudar"
 */

export function StaffCard({ doctor, serviceSlug }: { doctor: Doctor; serviceSlug?: string }) {
  return (
    <article data-reveal-item="" className="group flex h-full flex-col overflow-hidden rounded-[24px] border border-line-soft bg-white transition-[transform,box-shadow] duration-[450ms] ease-out hover:-translate-y-1.5 hover:shadow-lift">
      <Link href={ROUTES.doctor(doctor.slug)} className="block no-underline" tabIndex={-1} aria-hidden="true">
        <DoctorPortrait doctor={doctor} className="aspect-[4/5] bg-gradient-to-b from-mist to-white" initialsSize={96} label={null} rings="none" sizes="(max-width: 640px) 100vw, 320px" />
      </Link>
      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="flex flex-col gap-1">
          <span className="text-xs font-semibold uppercase tracking-[1px] text-leaf">{doctor.specialty}</span>
          <h3 className="m-0 font-display text-xl font-semibold leading-tight">
            <Link href={ROUTES.doctor(doctor.slug)} className="!text-ink no-underline hover:!text-teal">
              {doctor.name}
            </Link>
          </h3>
          {doctor.cmp && (
            <span className="text-[13px] text-muted">
              CMP {doctor.cmp}
              {doctor.rne && ` · RNE ${doctor.rne}`}
            </span>
          )}
        </div>
        <span className="mt-auto inline-flex items-center gap-2 text-[13px] font-medium text-subink">
          <Icon name="clock" className="text-leaf" strokeWidth={1.8} />
          Próxima cita: <NextAvailableText slug={doctor.slug} />
        </span>
        <div className="flex gap-2">
          <ButtonLink href={ROUTES.doctor(doctor.slug)} variant="ghost" size="sm" shape="soft" className="flex-1">
            Ver perfil
          </ButtonLink>
          <ButtonLink
            href={ROUTES.booking({ medico: doctor.slug, servicio: serviceSlug })}
            size="sm"
            shape="soft"
            className="flex-1"
            trackAs={{ event: "cta_click", props: { location: "staff_card", doctor: doctor.slug } }}
          >
            Reservar
          </ButtonLink>
        </div>
      </div>
    </article>
  );
}

export function RelatedDoctorCard({ doctor }: { doctor: Doctor }) {
  return (
    <Link
      data-reveal-item=""
      href={ROUTES.doctor(doctor.slug)}
      className="flex items-center gap-4 rounded-[20px] border border-line-soft bg-white p-4 !text-ink no-underline transition-[transform,box-shadow] duration-[450ms] ease-out hover:-translate-y-1 hover:shadow-lift"
    >
      <DoctorPortrait doctor={doctor} className="h-[76px] w-[76px] flex-none rounded-2xl bg-mist" initialsSize={30} label={null} rings="none" sizes="76px" />
      <span className="flex min-w-0 flex-col gap-1">
        <span className="text-xs font-semibold uppercase tracking-[1px] text-leaf">{doctor.specialty}</span>
        <span className="font-display text-lg font-semibold">{doctor.name}</span>
        <span className="text-[13px] text-muted">{doctor.treats.join(" · ")}</span>
      </span>
    </Link>
  );
}
