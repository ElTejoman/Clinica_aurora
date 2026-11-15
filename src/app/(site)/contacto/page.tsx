import type { Metadata } from "next";
import { ContactChannels } from "@/components/contact/ContactChannels";
import { ContactForm } from "@/components/contact/ContactForm";
import { OpeningHours } from "@/components/layout/OpeningHours";
import { Intro } from "@/components/motion/Intro";
import { Reveal } from "@/components/motion/Reveal";
import { SplitLines } from "@/components/motion/SplitLines";
import { ButtonLink } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { pageContainer } from "@/components/ui/styles";
import { ROUTES } from "@/config/routes";
import { SITE } from "@/config/site";
import { VISIT_RECOMMENDATIONS } from "@/data/clinic";

/**
 * PÁGINA · CONTACTO   (ruta: /contacto/)
 * Anclas usadas desde otras páginas: #agendar · #escribenos · #sede
 */
export const metadata: Metadata = {
  title: "Contacto",
  description: `Agenda tu cita por WhatsApp, escríbenos o visítanos en ${SITE.address}.`,
};

const mapsQuery = encodeURIComponent(SITE.address);

export default function ContactPage() {
  return (
    <>
      <Intro>
        <section className="bg-mist">
          <div className="mx-auto flex max-w-[860px] flex-col items-center gap-4 px-4 py-16 text-center">
            <span data-fade="" className="eyebrow">
              Estamos para ayudarte
            </span>
            <h1 className="m-0 font-display text-[clamp(34px,4.6vw,54px)] font-semibold leading-[1.1] text-ink">
              <SplitLines lines={["Contáctanos"]} />
            </h1>
            <p data-fade="" className="m-0 text-lg leading-relaxed text-muted">
              Agenda tu cita, resuelve tus dudas o visítanos en Miraflores.
            </p>
          </div>
        </section>
      </Intro>

      <section id="agendar" className={`${pageContainer} scroll-mt-28 py-16`}>
        <Reveal>
          <SectionHeading intro="Escríbenos por WhatsApp o elige día y hora en línea: te confirmamos por el mismo chat.">Agenda tu cita ahora</SectionHeading>
        </Reveal>
        <Reveal className="mt-10" stagger={70}>
          <ContactChannels />
        </Reveal>
        <div className="mt-8 flex justify-center">
          <ButtonLink href={ROUTES.booking()} size="lg" trackAs={{ event: "cta_click", props: { location: "contact_booking" } }}>
            <Icon name="calendar" />
            Reservar en línea
          </ButtonLink>
        </div>
      </section>

      <section id="escribenos" className="scroll-mt-28 bg-mist py-16">
        <div className={`${pageContainer} grid gap-12 lg:grid-cols-2`}>
          <Reveal className="flex flex-col gap-5">
            <SectionHeading align="left" intro="Déjanos tu consulta y te responderemos por WhatsApp lo antes posible.">
              Nos encanta leerte
            </SectionHeading>
            <div className="rounded-[22px] border border-line bg-white p-6">
              <h3 className="m-0 mb-4 font-display text-lg font-semibold text-ink">Recomendaciones generales antes de tu sesión</h3>
              <ul className="m-0 flex list-none flex-col gap-2.5 p-0">
                {VISIT_RECOMMENDATIONS.map((r) => (
                  <li key={r} className="flex gap-2.5 text-[15px] leading-snug text-subink">
                    <Icon name="check" size={16} strokeWidth={2.4} className="mt-0.5 flex-none text-leaf" />
                    {r}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
          <Reveal className="rounded-[24px] border border-line bg-white p-6 shadow-soft sm:p-8">
            <ContactForm />
          </Reveal>
        </div>
      </section>

      <section id="sede" className={`${pageContainer} scroll-mt-28 py-16`}>
        <Reveal>
          <SectionHeading intro={SITE.address}>Nuestra sede</SectionHeading>
        </Reveal>
        <Reveal className="mt-10 grid overflow-hidden rounded-[28px] border border-line bg-white lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
          <iframe
            title={`Mapa de ${SITE.name}`}
            src={`https://maps.google.com/maps?q=${mapsQuery}&z=16&output=embed`}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="h-[380px] w-full border-0 lg:h-full lg:min-h-[420px]"
          />
          <div className="flex flex-col gap-5 p-6 sm:p-8">
            <span className="inline-flex items-start gap-2 font-display text-lg font-semibold text-ink">
              <Icon name="mapPin" size={20} className="mt-1 flex-none text-teal" />
              {SITE.address}
            </span>
            <div className="text-[15px] text-subink">
              <h3 className="m-0 mb-3 font-display text-base font-semibold text-ink">Horario de atención</h3>
              <OpeningHours />
            </div>
            <ButtonLink href={`https://www.google.com/maps/dir/?api=1&destination=${mapsQuery}`} target="_blank" rel="noopener noreferrer" variant="ghost" className="mt-auto self-start">
              <Icon name="mapPin" />
              Cómo llegar
            </ButtonLink>
          </div>
        </Reveal>
      </section>
    </>
  );
}
