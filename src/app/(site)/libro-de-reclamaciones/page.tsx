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
 * Libro abierto → canales de atención (WhatsApp citas y consultas, correo)
 * → hoja de reclamación (pasos + vista previa; se llena en línea en /hoja/)
 * → texto legal (DS 002-2019-SA). Los datos del proveedor salen de SITE.legal.
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

      <ComplaintSheetSection />

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

const SHEET_STEPS = [
  { title: "Complétala en línea", text: "Escribe tus datos, el detalle y tu pedido directamente en la hoja." },
  { title: "Guárdala como PDF o imprímela", text: "Con un clic la descargas ya llena, lista para firmar." },
  { title: "Envíanosla", text: "Por WhatsApp o correo, o entrégala en la clínica. Te respondemos en un máximo de 15 días hábiles." },
];

/** "Hoja de reclamación": pasos + vista previa de la hoja + datos del proveedor. */
function ComplaintSheetSection() {
  return (
    <section id="hoja" className="scroll-mt-28 bg-mist py-16">
      <div className={`${pageContainer} grid items-center gap-12 lg:grid-cols-[minmax(0,6fr)_minmax(0,5fr)]`}>
        <Reveal className="flex flex-col gap-7">
          <SectionHeading align="left" eyebrow="¿Tienes algún reclamo?" intro="Llena la hoja de reclamación en línea, sin descargar programas ni usar enlaces externos.">
            Hoja de reclamación
          </SectionHeading>
          <ol className="m-0 flex list-none flex-col gap-4 p-0">
            {SHEET_STEPS.map((step, i) => (
              <li key={step.title} className="flex gap-4">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-teal font-display text-sm font-semibold text-white">{i + 1}</span>
                <span className="flex flex-col gap-0.5 pt-1">
                  <span className="font-display text-[16px] font-semibold text-ink">{step.title}</span>
                  <span className="text-[15px] leading-relaxed text-muted">{step.text}</span>
                </span>
              </li>
            ))}
          </ol>
          <ButtonLink href={ROUTES.complaintForm} size="lg" className="self-start" trackAs={{ event: "cta_click", props: { location: "complaints_sheet" } }}>
            <Icon name="book" />
            Llenar hoja de reclamación
          </ButtonLink>
        </Reveal>
        <Reveal>
          <SheetPreview />
        </Reveal>
      </div>
    </section>
  );
}

/** Miniatura decorativa de la hoja con los datos reales del proveedor. */
function SheetPreview() {
  return (
    <div className="relative mx-auto max-w-[420px] rotate-[1.5deg] rounded-[18px] bg-white p-6 shadow-float transition-transform duration-500 hover:rotate-0">
      <div className="flex items-center gap-3 border-b-2 border-teal pb-3">
        <OpenBook className="h-auto w-12" />
        <div className="flex flex-col">
          <span className="font-display text-[13px] font-semibold tracking-[.4px] text-ink">LIBRO DE RECLAMACIONES</span>
          <span className="text-[12px] text-muted">Hoja de reclamación virtual</span>
        </div>
      </div>
      <dl className="m-0 mt-4 flex flex-col gap-1.5 rounded-xl bg-mist px-3.5 py-3 text-[12.5px] text-subink">
        {[
          ["Proveedor", SITE.legal.name],
          ["RUC", SITE.legal.ruc],
          ["Domicilio", SITE.legal.address],
        ].map(([term, value]) => (
          <div key={term} className="flex gap-2">
            <dt className="w-[74px] shrink-0 font-semibold text-ink">{term}</dt>
            <dd className="m-0">{value}</dd>
          </div>
        ))}
      </dl>
      <div aria-hidden="true" className="mt-5 flex flex-col gap-4">
        {["1. Consumidor reclamante", "2. Bien contratado", "3. Detalle y pedido"].map((block) => (
          <div key={block} className="flex flex-col gap-2.5">
            <span className="rounded bg-teal/90 px-2 py-1 text-[10.5px] font-semibold uppercase tracking-[.4px] text-white">{block}</span>
            <span className="h-px bg-ink/20" />
            <span className="h-px w-4/5 bg-ink/20" />
          </div>
        ))}
      </div>
    </div>
  );
}
