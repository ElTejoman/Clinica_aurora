import type { Service } from "@/models";
import { Reveal } from "@/components/motion/Reveal";
import { ServiceCard } from "@/components/services/ServiceCard";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { pageContainer } from "@/components/ui/styles";

/** Tarjetas de servicios, hasta 3 por fila; la última fila queda centrada (7 → 3 + 3 + 1). */
export function ServicesGrid({ services, heading = "Nuestros servicios" }: { services: Service[]; heading?: string }) {
  return (
    <section className={`${pageContainer} py-20`}>
      <Reveal>
        <SectionHeading eyebrow="Tratamientos" intro="Terapias integrativas y medicina convencional, con protocolos seguros y personalizados.">
          {heading}
        </SectionHeading>
      </Reveal>
      <Reveal className="mt-12 flex flex-wrap justify-center gap-5" stagger={80}>
        {services.map((s) => (
          <div key={s.slug} className="flex w-full sm:w-[calc((100%_-_1.25rem)_/_2)] lg:w-[calc((100%_-_2.5rem)_/_3)] [&>article]:w-full">
            <ServiceCard service={s} />
          </div>
        ))}
      </Reveal>
    </section>
  );
}
