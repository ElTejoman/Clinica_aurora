import type { ServiceItem, ServiceSection } from "@/models";
import { Reveal } from "@/components/motion/Reveal";
import { Icon } from "@/components/ui/Icon";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { pageContainer } from "@/components/ui/styles";
import { cn } from "@/utils/cn";

/** Bloques de contenido de un servicio ("Problemas de salud que atendemos", protocolos, planes…). */
export function ServiceSections({ sections }: { sections: ServiceSection[] }) {
  return (
    <>
      {sections.map((section, i) => (
        <section key={section.title} className={cn("py-16", i % 2 === 1 && "bg-mist")}>
          <div className={pageContainer}>
            <Reveal>
              <SectionHeading intro={section.intro}>{section.title}</SectionHeading>
            </Reveal>
            <Reveal className="mt-10 grid grid-cols-[repeat(auto-fit,minmax(min(280px,100%),1fr))] gap-4" stagger={60}>
              {section.items.map((item) => (section.layout === "cards" ? <ConditionCard key={item.title} item={item} /> : <ListCard key={item.title} item={item} />))}
            </Reveal>
          </div>
        </section>
      ))}
    </>
  );
}

function ConditionCard({ item }: { item: ServiceItem }) {
  return (
    <article data-reveal-item="" className="flex flex-col gap-3 rounded-[22px] border border-line-soft bg-white p-6">
      <span className="flex h-10 w-10 items-center justify-center rounded-full bg-sage-soft text-teal">
        <Icon name="leaf" size={18} strokeWidth={1.8} />
      </span>
      <h3 className="m-0 font-display text-lg font-semibold text-ink">{item.title}</h3>
      {item.description && <p className="m-0 text-[15px] leading-relaxed text-muted">{item.description}</p>}
    </article>
  );
}

function ListCard({ item }: { item: ServiceItem }) {
  return (
    <article data-reveal-item="" className="flex flex-col gap-4 rounded-[22px] border border-line-soft bg-white p-6">
      <h3 className="m-0 font-display text-lg font-semibold text-teal">{item.title}</h3>
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
