import Link from "next/link";
import { Intro } from "@/components/motion/Intro";
import { Magnetic } from "@/components/motion/Magnetic";
import { SplitLines } from "@/components/motion/SplitLines";
import { AuroraWave } from "@/components/three/AuroraWave";
import { ButtonLink } from "@/components/ui/Button";
import { Icon, PathIcon } from "@/components/ui/Icon";
import { ROUTES } from "@/config/routes";
import type { Service } from "@/models";

type ServicePill = Pick<Service, "slug" | "name" | "icon">;

/**
 * Titular principal del inicio (H1) bajo el carrusel, con la ola de
 * partículas 3D detrás del texto en opacidad baja. Da a Google y a los lectores
 * de pantalla el tema de la página, que en los banners está dentro de la imagen.
 */
export function WelcomeIntro({ services }: { services: readonly ServicePill[] }) {
  return (
    <section className="relative overflow-hidden">
      <AuroraWave
        variant="hero"
        className="pointer-events-none absolute inset-0 h-full w-full opacity-30 [mask-image:linear-gradient(to_bottom,transparent,#000_25%,#000_75%,transparent)]"
      />
      <Intro>
        <div className="relative z-10 mx-auto flex max-w-[1040px] flex-col items-center gap-5 px-4 py-16 text-center">
          <span data-fade="" className="eyebrow">
            Clínica de medicina integrativa · Miraflores
          </span>
          <h1 className="m-0 font-display text-[clamp(32px,4.6vw,54px)] font-semibold leading-[1.1] tracking-[-1px] text-ink">
            <SplitLines lines={["Medicina integrativa", <span key="b" className="text-teal">para cuidar de ti</span>]} />
          </h1>
          <ServicePills services={services} />
          <p data-fade="" className="m-0 max-w-[620px] text-lg leading-relaxed text-muted">
            Consultas de 30 minutos y atención en español, inglés y chino.
          </p>
          <div data-fade="" className="mt-2 flex flex-wrap justify-center gap-3">
            <Magnetic>
              <ButtonLink href={ROUTES.booking()} size="lg" trackAs={{ event: "cta_click", props: { location: "home_intro" } }}>
                <Icon name="calendar" />
                Agendar cita
              </ButtonLink>
            </Magnetic>
            <ButtonLink href={ROUTES.services} variant="ghost" size="lg" arrow>
              Ver servicios
            </ButtonLink>
          </div>
        </div>
      </Intro>
    </section>
  );
}

function ServicePills({ services }: { services: readonly ServicePill[] }) {
  return (
    <ul data-fade="" aria-label="Especialidades" className="m-0 flex list-none flex-wrap justify-center gap-2 p-0">
      {services.map((service) => (
        <li key={service.slug}>
          <Link
            href={ROUTES.service(service.slug)}
            className="inline-flex items-center gap-2 rounded-full border border-teal/20 bg-white/80 px-4 py-2 text-[15px] font-semibold text-teal backdrop-blur-sm transition-colors duration-200 hover:border-teal hover:bg-teal hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal"
          >
            <PathIcon d={service.icon} size={18} strokeWidth={1.8} />
            {service.name}
          </Link>
        </li>
      ))}
    </ul>
  );
}
