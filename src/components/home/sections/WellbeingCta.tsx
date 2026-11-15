import Image from "next/image";
import { Magnetic } from "@/components/motion/Magnetic";
import { Reveal } from "@/components/motion/Reveal";
import { ButtonLink } from "@/components/ui/Button";
import { ROUTES } from "@/config/routes";


export function WellbeingCta() {
  return (
    <section className="px-2 pb-24 sm:px-3">
      <Reveal className="mx-auto grid max-w-[1440px] overflow-hidden rounded-[28px] bg-mist md:grid-cols-2">
        <div className="relative min-h-[320px]">
          <Image src="/images/clinic/clinica-moderna.webp" alt="Profesional de la clínica con una paciente" fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover" />
        </div>
        <div className="flex flex-col justify-center gap-5 px-6 py-12 sm:px-14">
          <span className="font-display text-[15px] font-medium italic text-sage">¿Por qué elegirnos?</span>
          <h2 className="m-0 font-display text-[clamp(28px,3.2vw,40px)] font-semibold leading-[1.15] text-ink">Tu bienestar es nuestra prioridad</h2>
          <p className="m-0 max-w-[520px] text-[17px] leading-relaxed text-muted">
            Tu salud merece la mejor atención: combinamos años de experiencia, técnicas avanzadas y un enfoque personalizado
            para acompañarte en tu recuperación.
          </p>
          <div className="mt-2 flex flex-wrap gap-3">
            <Magnetic>
              <ButtonLink href={ROUTES.booking()} trackAs={{ event: "cta_click", props: { location: "wellbeing_cta" } }}>
                Agendar cita
              </ButtonLink>
            </Magnetic>
            <ButtonLink href={ROUTES.contact()} variant="ghost">
              Contáctanos
            </ButtonLink>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
