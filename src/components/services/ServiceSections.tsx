import type { CSSProperties } from "react";
import type { ServiceItem, ServiceSection } from "@/models";
import { Reveal } from "@/components/motion/Reveal";
import { Icon } from "@/components/ui/Icon";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { pageContainer } from "@/components/ui/styles";
import { cn } from "@/utils/cn";
import { balancedColumns } from "@/utils/layout";

/**
 * Bloques de contenido de un servicio. Dos presentaciones según `layout`:
 *   "cards" → índice editorial: título a la izquierda y las condiciones
 *             numeradas (01, 02…) en dos columnas con separadores.
 *   "lists" → tarjetas con viñetas (protocolos, sueros, planes) en una grilla
 *             equilibrada: nunca deja una fila casi vacía y centra la última.
 * Las secciones alternan fondo blanco / menta.
 */
export function ServiceSections({ sections }: { sections: ServiceSection[] }) {
  return (
    <>
      {sections.map((section, i) => (
        <section key={section.title} data-service-section={section.layout} className={cn("py-16 lg:py-20", i % 2 === 1 && "bg-mist")}>
          {section.layout === "cards" ? <IndexedSection section={section} /> : <CardGridSection section={section} />}
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
