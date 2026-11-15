import type { Service } from "@/models";
import { Reveal } from "@/components/motion/Reveal";
import { ServiceCard } from "@/components/services/ServiceCard";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { pageContainer } from "@/components/ui/styles";


export function ServicesGrid({ services, heading = "Nuestros servicios" }: { services: Service[]; heading?: string }) {
  return (
    <section className={`${pageContainer} py-20`}>
      <Reveal>
        <SectionHeading eyebrow="Tratamientos" intro="Terapias integrativas y medicina convencional, con protocolos seguros y personalizados.">
          {heading}
        </SectionHeading>
      </Reveal>
      <Reveal className="mt-12 grid grid-cols-[repeat(auto-fit,minmax(min(300px,100%),1fr))] gap-5" stagger={80}>
        {services.map((s) => (
          <ServiceCard key={s.slug} service={s} />
        ))}
      </Reveal>
    </section>
  );
}
