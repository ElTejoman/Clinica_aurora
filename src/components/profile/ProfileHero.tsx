import Link from "next/link";
import type { Doctor, Service } from "@/models";
import { AvailableTodayBadge } from "@/components/availability/AvailableTodayBadge";
import { VideoButton } from "@/components/doctors/VideoButton";
import { Intro } from "@/components/motion/Intro";
import { SplitLines } from "@/components/motion/SplitLines";
import { AuroraWave } from "@/components/three/AuroraWave";
import { DoctorPortrait } from "@/components/ui/DoctorPortrait";
import { ROUTES } from "@/config/routes";

/**
 * Cabecera del perfil: retrato + nombre + especialidad + biografía +
 * colegiatura + servicios que atiende. La ola 3D se desvanece hacia la derecha.
 */
export function ProfileHero({ doctor, services }: { doctor: Doctor; services: Service[] }) {
  const nameParts = doctor.name.split(" ");
  const lastName = nameParts.pop() ?? "";
  const firstLine = nameParts.join(" ");
  const credentials = [doctor.cmp && `CMP ${doctor.cmp}`, doctor.rne && `RNE ${doctor.rne}`, "Atención presencial"].filter(Boolean) as string[];

  return (
    <section className="relative bg-mist">
      <AuroraWave
        variant="profile"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[320px] w-full opacity-60 [mask-image:linear-gradient(90deg,#000_0%,#000_35%,transparent_60%)]"
      />
      <Intro>
        <div className="relative mx-auto flex max-w-page flex-col gap-7 px-4 pb-16 pt-6 sm:px-8">
          <nav aria-label="Ruta" className="flex flex-wrap gap-2 text-[13px] text-muted">
            <Link href={ROUTES.staff()} className="no-underline">
              Staff de profesionales
            </Link>
            <span aria-hidden="true">/</span>
            <span className="font-medium text-ink" aria-current="page">
              {doctor.name}
            </span>
          </nav>

          <div className="grid items-center gap-12 md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
            <div data-fade="">
              <DoctorPortrait
                doctor={doctor}
                className="aspect-[4/5] max-w-[440px] rounded-[32px] bg-gradient-to-b from-white to-mist shadow-float"
                initialsSize={160}
                label={null}
                rings="none"
                priority
                sizes="(max-width: 768px) 100vw, 440px"
              >
                {doctor.videoUrl && (
                  <div className="absolute bottom-5 right-5">
                    <VideoButton doctorName={doctor.name} videoUrl={doctor.videoUrl} variant="pill" label="Ver presentación" />
                  </div>
                )}
              </DoctorPortrait>
            </div>

            <div className="flex flex-col gap-5">
              <AvailableTodayBadge slug={doctor.slug} label="Atiende hoy" className="self-start rounded-full border border-line bg-white px-3 py-[7px]" />
              <span data-fade="" className="eyebrow">
                {doctor.specialty}
              </span>
              <h1 className="m-0 font-display text-[clamp(38px,5vw,64px)] font-semibold leading-[1.02] tracking-[-1px] text-ink">
                <SplitLines lines={[firstLine, <span key="l2" className="text-teal">{lastName}</span>]} />
              </h1>
              <p data-fade="" className="m-0 max-w-[600px] text-[17px] leading-relaxed text-muted">
                {doctor.bio}
              </p>
              <ul data-fade="" className="m-0 flex list-none flex-wrap gap-2 p-0 text-sm text-subink">
                {credentials.map((text) => (
                  <li key={text} className="inline-flex h-9 items-center rounded-full border border-line bg-white px-3.5">
                    {text}
                  </li>
                ))}
              </ul>
              {services.length > 0 && (
                <div data-fade="" className="flex flex-wrap items-center gap-2 text-sm">
                  <span className="font-semibold text-ink">Atiende:</span>
                  {services.map((s) => (
                    <Link key={s.slug} href={ROUTES.service(s.slug)} className="rounded-full bg-sage-soft px-3 py-1.5 font-semibold !text-teal-deep no-underline hover:bg-tint">
                      {s.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </Intro>
    </section>
  );
}
