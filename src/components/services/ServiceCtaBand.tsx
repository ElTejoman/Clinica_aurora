import { Magnetic } from "@/components/motion/Magnetic";
import { Reveal } from "@/components/motion/Reveal";
import { ButtonLink } from "@/components/ui/Button";
import { WhatsAppIcon } from "@/components/ui/Icon";
import { pageContainer } from "@/components/ui/styles";
import { ROUTES } from "@/config/routes";
import { serviceWhatsAppUrl } from "@/services/booking.service";

/** Banda final "Agenda aquí" de cada servicio. */
export function ServiceCtaBand({ service, title, text }: { service: { slug: string; name: string }; title?: string; text?: string }) {
  return (
    <section className={`${pageContainer} py-16`}>
      <Reveal className="flex flex-col items-center gap-5 rounded-[28px] bg-teal-deep px-6 py-12 text-center text-night-ice sm:px-14">
        <h2 className="m-0 font-display text-[clamp(26px,3vw,36px)] font-semibold">{title ?? `¿Quieres empezar tu tratamiento de ${service.name.toLowerCase()}?`}</h2>
        <p className="m-0 max-w-[620px] text-[17px] leading-relaxed text-night-muted">
          {text ?? "Escríbenos y te ayudamos a elegir el horario y el profesional adecuados para ti."}
        </p>
        <div className="mt-2 flex flex-wrap justify-center gap-3">
          <Magnetic>
            <a
              href={serviceWhatsAppUrl(service)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-[54px] items-center gap-2.5 rounded-full bg-[#25D366] px-[26px] font-display text-base font-semibold !text-white no-underline hover:brightness-95"
            >
              <WhatsAppIcon size={20} />
              Agenda aquí
            </a>
          </Magnetic>
          <ButtonLink href={ROUTES.booking({ servicio: service.slug })} variant="light" size="lg">
            Reservar en línea
          </ButtonLink>
        </div>
      </Reveal>
    </section>
  );
}
