import Link from "next/link";
import type { Doctor } from "@/models";
import { DoctorPortrait } from "@/components/ui/DoctorPortrait";
import { ButtonLink } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { liftCardClass, tagClass } from "@/components/ui/styles";
import { NextAvailableText } from "@/components/availability/NextAvailableText";
import { formatModes } from "@/utils/format";
import { ROUTES } from "@/config/routes";
import { cn } from "@/utils/cn";

/**
 * Tarjetas de médico
 * =============================================================================
 * Tres formatos según el contexto del embudo:
 *
 *   <DoctorCard>          vertical, foto grande — grilla "Nuestros médicos" (inicio)
 *   <DirectoryCard>       horizontal con etiquetas — directorio /especialistas
 *   <RelatedDoctorCard>   compacta — "También te puede ayudar" (perfil)
 *
 * Todas llevan a la misma decisión: "Reservar" (primaria) o "Ver perfil".
 * "Próxima cita" se calcula en el navegador (<NextAvailableText>).
 */

export function DoctorCard({ doctor }: { doctor: Doctor }) {
  return (
    <article data-reveal-item="" className={cn(liftCardClass, "flex flex-col overflow-hidden")}>
      <DoctorPortrait doctor={doctor} className="aspect-[4/4.4]">
        <span className="absolute right-3.5 top-3.5 rounded-full bg-white px-2.5 py-1.5 text-xs font-semibold text-subink">
          {formatModes(doctor.modes)}
        </span>
      </DoctorPortrait>
      <div className="flex flex-1 flex-col gap-3.5 px-5 pb-[22px] pt-5">
        <div className="flex flex-col gap-1">
          <span className="text-xs font-semibold uppercase tracking-[1px] text-leaf">{doctor.specialty}</span>
          <h3 className="m-0 font-serif text-[28px] font-normal leading-[1.1]">{doctor.name}</h3>
        </div>
        <p className="m-0 text-sm leading-relaxed text-muted">
          Te ayuda con: {doctor.treats.map((t) => t.toLowerCase()).join(", ")}
        </p>
        <div className="mt-auto flex items-center gap-2 text-[13px] font-medium text-subink">
          <Icon name="clock" className="text-leaf" strokeWidth={1.8} />
          Próxima cita: <NextAvailableText slug={doctor.slug} />
        </div>
        <div className="flex gap-2">
          <ButtonLink
            href={ROUTES.booking({ medico: doctor.slug })}
            size="sm"
            shape="soft"
            className="flex-1"
            trackAs={{ event: "cta_click", props: { location: "home_doctor_card", doctor: doctor.slug } }}
          >
            Reservar
          </ButtonLink>
          <ButtonLink href={ROUTES.doctor(doctor.slug)} variant="ghost" size="sm" shape="soft" className="flex-1">
            Ver perfil
          </ButtonLink>
        </div>
      </div>
    </article>
  );
}

export function DirectoryCard({ doctor }: { doctor: Doctor }) {
  return (
    <article className="flex h-full flex-col overflow-hidden rounded-[26px] border border-line-soft bg-white transition-shadow duration-500 hover:shadow-lift">
      <div className="flex gap-[18px] p-[18px]">
        <DoctorPortrait
          doctor={doctor}
          className="h-40 w-[132px] flex-none rounded-[18px]"
          initialsSize={64}
          rings="none"
          sizes="132px"
        />
        <div className="flex min-w-0 flex-1 flex-col gap-2 pt-1">
          <span className="text-xs font-semibold uppercase tracking-[1px] text-leaf">{doctor.specialty}</span>
          <h2 className="m-0 font-serif text-[30px] font-normal leading-[1.05]">{doctor.name}</h2>
          <span className="text-[13px] text-muted">
            {formatModes(doctor.modes)} · Consulta S/ {doctor.price}
          </span>
          <span className="mt-auto inline-flex items-center gap-2 text-[13px] font-semibold text-leaf-ink">
            <span className="h-2 w-2 rounded-full bg-leaf" aria-hidden="true" />
            Próxima cita: <NextAvailableText slug={doctor.slug} />
          </span>
        </div>
      </div>
      <ul className="m-0 flex list-none flex-wrap gap-1.5 px-[18px] py-0" aria-label="Lo que trata">
        {doctor.treats.map((t) => (
          <li key={t} className={tagClass}>
            {t}
          </li>
        ))}
      </ul>
      <div className="mt-auto flex gap-2 p-[18px]">
        <ButtonLink
          href={ROUTES.booking({ medico: doctor.slug })}
          size="sm"
          shape="soft"
          className="flex-1"
          trackAs={{ event: "cta_click", props: { location: "directory_card", doctor: doctor.slug } }}
        >
          Reservar cita
        </ButtonLink>
        <ButtonLink href={ROUTES.doctor(doctor.slug)} variant="ghost" size="sm" shape="soft" className="flex-1">
          Ver perfil
        </ButtonLink>
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
      <DoctorPortrait
        doctor={doctor}
        className="h-[72px] w-[72px] flex-none rounded-2xl"
        initialsSize={30}
        label={null}
        rings="none"
        sizes="72px"
      />
      <span className="flex min-w-0 flex-col gap-1">
        <span className="text-xs font-semibold uppercase tracking-[1px] text-leaf">{doctor.specialty}</span>
        <span className="text-lg font-semibold">{doctor.name}</span>
        <span className="text-[13px] text-muted">{doctor.referralHint}</span>
      </span>
    </Link>
  );
}
