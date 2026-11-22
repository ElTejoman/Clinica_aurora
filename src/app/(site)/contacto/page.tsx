import type { Metadata } from "next";
import { ContactChannels } from "@/components/contact/ContactChannels";
import { ContactForm } from "@/components/contact/ContactForm";
import { Intro } from "@/components/motion/Intro";
import { Reveal } from "@/components/motion/Reveal";
import { SplitLines } from "@/components/motion/SplitLines";
import { ButtonLink } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { pageContainer } from "@/components/ui/styles";
import { SITE } from "@/config/site";
import { VISIT_RECOMMENDATIONS } from "@/data/clinic";

/**
 * PÁGINA · CONTACTO   (ruta: /contacto/)
 *   sede: mapa + antes de tu visita (#sede) → otros canales + formulario (#escribenos)
 */
export const metadata: Metadata = {
  title: "Contacto",
  description: `Visítanos en ${SITE.address}, llámanos o escríbenos por WhatsApp.`,
};

const mapsQuery = encodeURIComponent(SITE.address);

export default function ContactPage() {
  return (
    <>
      <Intro>
        <section className="bg-mist">
          <div className="mx-auto flex max-w-[860px] flex-col items-center gap-4 px-4 pb-12 pt-14 text-center">
            <span data-fade="" className="eyebrow">
              Estamos para ayudarte
            </span>
            <h1 className="m-0 font-display text-[clamp(34px,4.6vw,54px)] font-semibold leading-[1.1] text-ink">
              <SplitLines lines={["Contáctanos"]} />
            </h1>
            <p data-fade="" className="m-0 text-lg leading-relaxed text-muted">
              Visítanos en Miraflores, llámanos o escríbenos.
            </p>
          </div>
        </section>
      </Intro>

      <LocationSection />
      <WriteUsSection />
    </>
  );
}

function LocationSection() {
  return (
    <section id="sede" className="scroll-mt-28 py-16">
      <div className={pageContainer}>
        <Reveal>
          <SectionHeading intro={SITE.address}>Nuestra sede</SectionHeading>
        </Reveal>
        <Reveal className="mx-auto mt-10 grid max-w-[1100px] overflow-hidden rounded-[28px] border border-line bg-white lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
          <iframe
            title={`Mapa de ${SITE.name}`}
            src={`https://maps.google.com/maps?q=${mapsQuery}&z=16&output=embed`}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="h-[340px] w-full border-0 lg:h-full lg:min-h-[460px]"
          />
          <div className="flex flex-col gap-6 p-6 sm:p-8">
            <div className="flex flex-col gap-4">
              <span className="inline-flex items-start gap-2 font-display text-lg font-semibold text-ink">
                <Icon name="mapPin" size={20} className="mt-1 flex-none text-teal" />
                {SITE.address}
              </span>
              <ButtonLink href={`https://www.google.com/maps/dir/?api=1&destination=${mapsQuery}`} target="_blank" rel="noopener noreferrer" variant="ghost" size="sm" className="self-start">
                <Icon name="mapPin" />
                Cómo llegar
              </ButtonLink>
            </div>
            <div className="border-t border-line-soft pt-5">
              <h3 className="m-0 mb-3.5 font-display text-base font-semibold text-ink">Antes de tu visita</h3>
              <ul className="m-0 flex list-none flex-col gap-2.5 p-0">
                {VISIT_RECOMMENDATIONS.map((r) => (
                  <li key={r} className="flex gap-2.5 text-[15px] leading-snug text-subink">
                    <Icon name="check" size={16} strokeWidth={2.4} className="mt-0.5 flex-none text-leaf" />
                    {r}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function WriteUsSection() {
  return (
    <section id="escribenos" className="scroll-mt-28 bg-mist py-16">
      <div className={pageContainer}>
        <div className="mx-auto grid max-w-[1100px] gap-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] lg:gap-14">
          <Reveal className="flex flex-col gap-7" stagger={70}>
            <SectionHeading align="left" intro="Llámanos o escríbenos por el canal que prefieras; también puedes dejarnos tu consulta aquí.">
              ¿Prefieres escribirnos?
            </SectionHeading>
            <ContactChannels layout="list" />
          </Reveal>
          <Reveal className="flex flex-col gap-5 self-start rounded-[24px] border border-line bg-white p-6 shadow-soft sm:p-8">
            <div className="flex flex-col gap-1">
              <h3 className="m-0 font-display text-xl font-semibold text-ink">Nos encanta leerte</h3>
              <p className="m-0 text-[15px] text-muted">Te responderemos por WhatsApp lo antes posible.</p>
            </div>
            <ContactForm />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
