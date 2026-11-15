import type { Metadata } from "next";
import { OpenBook } from "@/components/complaints/OpenBook";
import { ContactChannels, contactChannels } from "@/components/contact/ContactChannels";
import { Intro } from "@/components/motion/Intro";
import { Reveal } from "@/components/motion/Reveal";
import { ButtonLink } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { pageContainer } from "@/components/ui/styles";
import { ROUTES } from "@/config/routes";
import { SITE } from "@/config/site";

/**
 * PÁGINA · LIBRO DE RECLAMACIONES   (ruta: /libro-de-reclamaciones/)
 * Canales de atención + hoja de reclamación imprimible + texto legal
 * (DS 002-2019-SA). Los datos del proveedor salen de SITE.legal.
 */
export const metadata: Metadata = {
  title: "Libro de Reclamaciones",
  description: `Presenta un reclamo o una queja sobre los servicios de salud de ${SITE.name}.`,
};

export default function ComplaintsPage() {
  const channels = contactChannels().filter((c) => c.icon !== "phone");

  return (
    <>
      <Intro>
        <section className="bg-mist">
          <div className="mx-auto grid max-w-page items-center gap-10 px-4 py-14 sm:px-8 md:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
            <div className="flex flex-col gap-4">
              <span data-fade="" className="eyebrow">
                Atención al usuario
              </span>
              <h1 className="m-0 font-display text-[clamp(34px,4.6vw,54px)] font-semibold leading-[1.1] text-ink">Libro de Reclamaciones</h1>
              <p data-fade="" className="m-0 max-w-[560px] text-lg leading-relaxed text-muted">
                Si algo no salió como esperabas, queremos saberlo. La presentación y atención de los reclamos es gratuita.
              </p>
            </div>
            <div data-fade="" className="flex justify-center">
              <OpenBook className="w-full max-w-[300px]" />
            </div>
          </div>
        </section>
      </Intro>

      <section className={`${pageContainer} py-16`}>
        <Reveal>
          <SectionHeading intro="Juntos resolveremos tus dudas.">
            ¿Necesitas <span className="text-teal">ayuda</span>?
          </SectionHeading>
        </Reveal>
        <Reveal className="mt-4 text-center">
          <h3 className="m-0 font-display text-xl font-semibold text-ink">Contáctanos por nuestros canales para consultas y solicitudes</h3>
        </Reveal>
        <Reveal className="mt-10" stagger={70}>
          <ContactChannels channels={channels} />
        </Reveal>
      </section>

      <section className="bg-mist py-16">
        <Reveal className={`${pageContainer} flex flex-col items-center gap-6 text-center`}>
          <SectionHeading intro="Descarga e imprime la hoja, complétala y entrégala en la clínica o envíala firmada por WhatsApp o correo.">
            Hoja de reclamación
          </SectionHeading>
          <ButtonLink href={ROUTES.complaintForm} size="lg" target="_blank">
            <Icon name="printer" />
            Descargar o imprimir la hoja
          </ButtonLink>
          <dl className="m-0 grid gap-x-8 gap-y-1 text-sm text-subink sm:grid-cols-3">
            <div>
              <dt className="font-semibold text-ink">Proveedor</dt>
              <dd className="m-0">{SITE.legal.name}</dd>
            </div>
            <div>
              <dt className="font-semibold text-ink">RUC</dt>
              <dd className="m-0">{SITE.legal.ruc}</dd>
            </div>
            <div>
              <dt className="font-semibold text-ink">Domicilio</dt>
              <dd className="m-0">{SITE.legal.address}</dd>
            </div>
          </dl>
        </Reveal>
      </section>

      <section className={`${pageContainer} py-16`}>
        <Reveal className="mx-auto flex max-w-[820px] flex-col gap-4 text-[16px] leading-relaxed text-muted">
          <p className="m-0">
            En {SITE.name} estamos comprometidos con brindar una atención segura, oportuna y de calidad. Si tienes alguna
            disconformidad relacionada con los servicios de salud recibidos, puedes presentar un reclamo a través de nuestro
            Libro de Reclamaciones en Salud.
          </p>
          <p className="m-0">
            De acuerdo con el Decreto Supremo N.º 002-2019-SA, las Instituciones Prestadoras de Servicios de Salud (IPRESS)
            deben contar con mecanismos para recibir, registrar y atender los reclamos de sus usuarios.
          </p>
          <p className="m-0">
            Ponemos a tu disposición este canal para escuchar tus inquietudes, atender tus solicitudes y continuar mejorando
            nuestros servicios. La presentación y atención de los reclamos es gratuita.
          </p>
        </Reveal>
      </section>
    </>
  );
}
