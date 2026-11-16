import type { CSSProperties } from "react";
import type { ServiceItem, ServiceSection } from "@/models";
import { Reveal } from "@/components/motion/Reveal";
import { ButtonLink } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { pageContainer } from "@/components/ui/styles";
import { ROUTES } from "@/config/routes";
import { SITE } from "@/config/site";
import { cn } from "@/utils/cn";
import { formatSoles } from "@/utils/format";
import { balancedColumns } from "@/utils/layout";

/**
 * Bloques de contenido de un servicio. Dos presentaciones según `layout`:
 *   "cards" → índice editorial: título a la izquierda y las condiciones
 *             numeradas (01, 02…) en dos columnas con separadores.
 *   "lists" → tarjetas con viñetas (protocolos, sueros) en una grilla
 *             equilibrada: nunca deja una fila casi vacía y centra la última.
 *   "plans" → tarjetas de precio (duración, monto, ahorro, qué incluye y
 *             "Reservar este plan") + métodos de pago. En escritorio ancho,
 *             todos en una fila para compararlos.
 * Las secciones alternan fondo blanco / menta.
 */
export function ServiceSections({ sections, serviceSlug }: { sections: ServiceSection[]; serviceSlug: string }) {
  return (
    <>
      {sections.map((section, i) => (
        <section key={section.title} data-service-section={section.layout} className={cn("py-16 lg:py-20", i % 2 === 1 && "bg-mist")}>
          {section.layout === "cards" && <IndexedSection section={section} />}
          {section.layout === "lists" && <CardGridSection section={section} />}
          {section.layout === "plans" && <PlansSection section={section} serviceSlug={serviceSlug} />}
        </section>
      ))}
    </>
  );
}

function IndexedSection({ section }: { section: ServiceSection }) {
  return (
    <div className={cn(pageContainer, "grid gap-8 lg:grid-cols-[minmax(0,4fr)_minmax(0,8fr)] lg:gap-16")}>
      <Reveal className="flex flex-col gap-4 self-start lg:pt-6">
        <SectionHeading align="left" intro={section.intro}>
          {section.title}
        </SectionHeading>
      </Reveal>
      <Reveal as="ol" className="m-0 grid list-none gap-x-10 p-0 sm:grid-cols-2" stagger={60}>
        {section.items.map((item, i) => (
          <IndexedItem key={item.title} item={item} index={i} />
        ))}
      </Reveal>
    </div>
  );
}

function IndexedItem({ item, index }: { item: ServiceItem; index: number }) {
  return (
    <li data-reveal-item="" className="flex gap-4 border-t border-line py-6">
      <span aria-hidden="true" className="w-7 shrink-0 pt-0.5 font-display text-sm font-semibold tabular-nums text-sage">
        {String(index + 1).padStart(2, "0")}
      </span>
      <div className="flex flex-col gap-2">
        <h3 className="m-0 font-display text-lg font-semibold leading-snug text-ink">{item.title}</h3>
        {item.description && <p className="m-0 text-[15px] leading-relaxed text-muted">{item.description}</p>}
      </div>
    </li>
  );
}

function CardGridSection({ section }: { section: ServiceSection }) {
  const columns = { "--cols": balancedColumns(section.items.length) } as CSSProperties;
  return (
    <div className={pageContainer}>
      <Reveal>
        <SectionHeading intro={section.intro}>{section.title}</SectionHeading>
      </Reveal>
      <Reveal as="ul" style={columns} className="m-0 mt-10 flex list-none flex-wrap justify-center gap-4 p-0" stagger={60}>
        {section.items.map((item) => (
          <li
            key={item.title}
            data-reveal-item=""
            className="flex w-full sm:w-[calc((100%_-_1rem)_/_2)] lg:w-[calc((100%_-_(var(--cols)_-_1)_*_1rem)_/_var(--cols))]"
          >
            <BulletCard item={item} />
          </li>
        ))}
      </Reveal>
    </div>
  );
}

const MAX_PLANS_PER_ROW = 5;

function PlansSection({ section, serviceSlug }: { section: ServiceSection; serviceSlug: string }) {
  const columns = { "--cols": Math.min(section.items.length, MAX_PLANS_PER_ROW) } as CSSProperties;
  return (
    <div className={pageContainer}>
      <Reveal>
        <SectionHeading intro={section.intro}>{section.title}</SectionHeading>
      </Reveal>
      <Reveal as="ul" style={columns} className="m-0 mt-10 flex list-none flex-wrap justify-center gap-4 p-0" stagger={60}>
        {section.items.map((item) => (
          <li
            key={item.title}
            data-reveal-item=""
            data-plan=""
            className="flex w-full sm:w-[calc((100%_-_1rem)_/_2)] lg:w-[calc((100%_-_2rem)_/_3)] xl:w-[calc((100%_-_(var(--cols)_-_1)_*_1rem)_/_var(--cols))]"
          >
            <PlanCard item={item} serviceSlug={serviceSlug} />
          </li>
        ))}
      </Reveal>
      <PaymentMethods />
    </div>
  );
}

function PlanCard({ item, serviceSlug }: { item: ServiceItem; serviceSlug: string }) {
  const plan = item.plan;
  if (!plan) return null;
  const motivo = `Plan: ${item.title} (${formatSoles(plan.price)})`;
  return (
    <article className="flex w-full flex-col rounded-[22px] border border-line-soft bg-white p-6 transition-[border-color,box-shadow,transform] duration-300 hover:-translate-y-1 hover:border-sage-soft hover:shadow-soft">
      <span className="inline-flex items-center gap-1.5 text-[12px] font-semibold uppercase tracking-[.8px] text-faint">
        <Icon name="clock" size={13} />
        {plan.duration}
      </span>
      <h3 className="m-0 mt-2 font-display text-lg font-semibold leading-snug text-ink">{item.title}</h3>
      <div className="mt-4 flex flex-col items-start gap-2 border-b border-dashed border-line-strong pb-5">
        <span className="font-display text-[32px] font-bold leading-none text-teal">{formatSoles(plan.price)}</span>
        {/* Desde tablet la fila del ahorro existe siempre: así la línea punteada queda alineada entre tarjetas vecinas. */}
        <span className={cn("h-[26px] items-center", plan.savings ? "flex" : "hidden sm:flex")}>
          {plan.savings ? (
            <span className="rounded-full bg-leaf-soft/25 px-2.5 py-1 text-[12px] font-bold text-leaf-ink">Ahorras {formatSoles(plan.savings)}</span>
          ) : null}
        </span>
      </div>
      <ul className="m-0 mb-6 mt-5 flex list-none flex-col gap-2.5 p-0">
        {item.bullets?.map((b) => (
          <li key={b} className="flex gap-2.5 text-[14.5px] leading-snug text-subink">
            <Icon name="check" size={16} strokeWidth={2.4} className="mt-0.5 flex-none text-leaf" />
            {b}
          </li>
        ))}
      </ul>
      <ButtonLink
        href={ROUTES.booking({ servicio: serviceSlug, motivo })}
        variant="ghost"
        size="sm"
        className="mt-auto w-full"
        trackAs={{ event: "cta_click", props: { location: "service_plan", service: serviceSlug, plan: item.title } }}
      >
        Reservar este plan<span className="sr-only">: {item.title}</span>
      </ButtonLink>
    </article>
  );
}

function PaymentMethods() {
  const { bank, account, cci } = SITE.payment;
  return (
    <div className="mx-auto mt-8 flex max-w-[760px] flex-col items-center gap-3 rounded-[20px] border border-line-soft bg-mist px-6 py-5 text-center sm:flex-row sm:justify-center sm:gap-6 sm:text-left">
      <span className="font-display text-[15px] font-semibold text-ink">Métodos de pago</span>
      <dl className="m-0 flex flex-col gap-1 text-[14.5px] text-subink sm:flex-row sm:gap-6">
        <div>
          <dt className="inline font-semibold">Cuenta {bank}: </dt>
          <dd className="m-0 inline select-all tabular-nums">{account}</dd>
        </div>
        <div>
          <dt className="inline font-semibold">CCI: </dt>
          <dd className="m-0 inline select-all tabular-nums">{cci}</dd>
        </div>
      </dl>
    </div>
  );
}

function BulletCard({ item }: { item: ServiceItem }) {
  return (
    <article className="flex w-full flex-col gap-4 rounded-[22px] border border-line-soft bg-white p-6 transition-[border-color,box-shadow] duration-300 hover:border-sage-soft hover:shadow-soft">
      <h3 className="m-0 border-b border-line-soft pb-4 font-display text-lg font-semibold leading-snug text-teal">{item.title}</h3>
      <ul className="m-0 flex list-none flex-col gap-2.5 p-0">
        {item.bullets?.map((b) => (
          <li key={b} className="flex gap-2.5 text-[15px] leading-snug text-subink">
            <Icon name="check" size={16} strokeWidth={2.4} className="mt-0.5 flex-none text-leaf" />
            {b}
          </li>
        ))}
      </ul>
    </article>
  );
}
