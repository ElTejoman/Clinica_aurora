import Link from "next/link";
import type { Doctor } from "@/models";
import { AvailableTodayBadge } from "@/components/availability/AvailableTodayBadge";
import { VideoButton } from "@/components/doctors/VideoButton";
import { Intro } from "@/components/motion/Intro";
import { SplitLines } from "@/components/motion/SplitLines";
import { AuroraWave } from "@/components/three/AuroraWave";
import { DoctorPortrait } from "@/components/ui/DoctorPortrait";
import { ROUTES } from "@/config/routes";
import { formatModes } from "@/utils/format";

/**
 * Cabecera del perfil: retrato + video de 60 s + nombre + enfoque +
 * credenciales + datos clave. La ola 3D se desvanece hacia la derecha para
 * no pasar por detrás del texto.
 */
export function ProfileHero({ doctor }: { doctor: Doctor }) {
  // Titular en dos líneas: "Dra. Valeria" / "Quispe" (la 2ª en cursiva teal)
  const nameParts = doctor.name.split(" ");
  const lastName = nameParts.pop() ?? "";
  const firstLine = nameParts.join(" ");

  const credentials = [`CMP ${doctor.cmp} · RNE ${doctor.rne}`, formatModes(doctor.modes), `Idiomas: ${doctor.languages}`];
  // Datos clave: rellenar con datos reales (nunca inventar cifras)
  const keyFacts = [
    [doctor.yearsExperience, "años de experiencia"],
    [`S/ ${doctor.price}`, `consulta · ${doctor.durationMin} min`],
    ["[N]", "reseñas verificadas"],
  ] as const;

  return (
    <section className="relative">
      <AuroraWave
        variant="profile"
        className="absolute inset-x-0 top-[140px] h-[460px] w-full [mask-image:linear-gradient(90deg,#000_0%,#000_30%,transparent_52%)]"
      />
      <Intro>
        <div className="relative mx-auto flex max-w-page flex-col gap-7 px-4 sm:px-8 pb-16 pt-5">
          <nav aria-label="Ruta" className="flex flex-wrap gap-2 text-[13px] text-muted">
            <Link href={ROUTES.specialists()} className="no-underline">
              Especialistas
            </Link>
            <span aria-hidden="true">/</span>
            <span>{doctor.specialty}</span>
            <span aria-hidden="true">/</span>
            <span className="font-medium text-ink" aria-current="page">
              {doctor.name}
            </span>
          </nav>

          <div className="grid grid-cols-[repeat(auto-fit,minmax(min(420px,100%),1fr))] items-end gap-12">
            <div data-fade="">
              <DoctorPortrait
                doctor={doctor}
                className="aspect-[5/5.4] max-w-[560px] rounded-[32px]"
                initialsSize={200}
                label="FOTO PROFESIONAL · RETRATO VERTICAL"
                rings="top"
                priority
                sizes="(max-width: 900px) 100vw, 560px"
              >
                <div className="absolute bottom-5 right-5">
                  <VideoButton
                    doctorName={doctor.name}
                    videoUrl={doctor.videoUrl}
                    variant="pill"
                    label={`Conóce${doctor.name.startsWith("Dra") ? "la" : "lo"} en 60 s`}
                  />
                </div>
              </DoctorPortrait>
            </div>

            <div className="flex flex-col gap-[22px] pb-2">
              <AvailableTodayBadge
                slug={doctor.slug}
                label="Atiende hoy"
                className="self-start rounded-full border border-line bg-white px-3 py-[7px]"
              />
              <span data-fade="" className="eyebrow">
                {doctor.specialty}
                {doctor.subspecialty && ` · ${doctor.subspecialty}`}
              </span>
              <h1 className="m-0 font-serif text-[clamp(52px,6.4vw,96px)] font-normal leading-[.96] tracking-[-2px]">
                <SplitLines
                  lines={[
                    firstLine,
                    <em key="l2" className="italic text-teal">
                      {lastName}
                    </em>,
                  ]}
                />
              </h1>
              <p data-fade="" className="m-0 max-w-[520px] text-lg leading-relaxed text-muted">
                {doctor.bio}
              </p>
              <ul data-fade="" className="m-0 flex list-none flex-wrap gap-2.5 p-0 text-sm text-subink">
                {credentials.map((text) => (
                  <li key={text} className="inline-flex h-9 items-center rounded-full border border-line bg-white px-3.5">
                    {text}
                  </li>
                ))}
              </ul>
              <dl data-fade="" className="m-0 flex flex-wrap gap-8 border-t border-line pt-2">
                {keyFacts.map(([value, label]) => (
                  <div key={label} className="flex flex-col-reverse gap-0.5 pt-4">
                    <dt className="text-[13px] text-muted">{label}</dt>
                    <dd className="m-0 font-serif text-4xl leading-none">{value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </div>
      </Intro>
    </section>
  );
}
