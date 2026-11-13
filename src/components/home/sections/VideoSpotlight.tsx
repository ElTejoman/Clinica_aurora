import type { Doctor } from "@/models";
import { Reveal } from "@/components/motion/Reveal";
import { Magnetic } from "@/components/motion/Magnetic";
import { ButtonLink } from "@/components/ui/Button";
import { DoctorPortrait } from "@/components/ui/DoctorPortrait";
import { VideoButton } from "@/components/doctors/VideoButton";
import { ROUTES } from "@/config/routes";
import { pageContainer } from "@/components/ui/styles";

export function VideoSpotlight({ doctor }: { doctor: Doctor }) {
  return (
    <section className={`${pageContainer} pb-10 pt-[100px]`}>
      <Reveal className="grid grid-cols-[repeat(auto-fit,minmax(min(460px,100%),1fr))] overflow-hidden rounded-[32px] bg-night">
        <div className="relative flex min-h-[460px] items-center justify-center overflow-hidden bg-night-2">
          {doctor.photo && (
            <DoctorPortrait doctor={doctor} className="absolute inset-0 opacity-60" label={null} rings="none" />
          )}
          <svg viewBox="0 0 600 460" preserveAspectRatio="xMidYMid slice" aria-hidden="true" className="absolute inset-0 h-full w-full">
            {[260, 190, 120].map((r) => (
              <circle key={r} cx="300" cy="230" r={r} fill="none" stroke="rgba(234,242,239,.09)" strokeWidth={1} />
            ))}
          </svg>
          <span className="absolute bottom-5 left-6 text-[11px] font-semibold tracking-[1.2px] text-night-soft">
            VIDEO DE PRESENTACIÓN · 60 s
          </span>
          <VideoButton doctorName={doctor.name} videoUrl={doctor.videoUrl} />
        </div>

        <div className="flex flex-col justify-center gap-[22px] p-7 text-night-ice sm:p-14">
          <span className="text-[13px] font-semibold uppercase tracking-[1.6px] text-leaf-mint">Antes de tu cita</span>
          <h2 className="m-0 font-serif text-[clamp(34px,3.6vw,52px)] font-normal leading-[1.06]">
            Conoce {doctor.shortName.startsWith("el") ? "al" : "a la"} {doctor.name} en 60 segundos.
          </h2>
          <p className="m-0 max-w-[460px] text-[17px] leading-[1.65] text-night-muted">
            {doctor.bio} Cada médico de Aurora graba una presentación corta para que llegues a consulta sabiendo con
            quién vas a hablar.
          </p>
          <div className="mt-1.5 flex flex-wrap gap-3">
            <Magnetic>
              <ButtonLink
                href={ROUTES.booking({ medico: doctor.slug })}
                variant="light"
                trackAs={{ event: "cta_click", props: { location: "video_spotlight", doctor: doctor.slug } }}
              >
                Reservar con {doctor.shortName}
              </ButtonLink>
            </Magnetic>
            <ButtonLink href={ROUTES.doctor(doctor.slug)} variant="outline">
              Ver perfil completo
            </ButtonLink>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
