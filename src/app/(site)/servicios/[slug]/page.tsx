import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { StaffCard } from "@/components/doctors/DoctorCard";
import { Reveal } from "@/components/motion/Reveal";
import { ReviewsSection } from "@/components/reviews/ReviewsSection";
import { ServiceCtaBand } from "@/components/services/ServiceCtaBand";
import { ServiceHero } from "@/components/services/ServiceHero";
import { ServiceSections } from "@/components/services/ServiceSections";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { pageContainer } from "@/components/ui/styles";
import { ROUTES } from "@/config/routes";
import { catalogService, doctorService } from "@/services/container";

/**
 * PÁGINA · SERVICIO   (ruta: /servicios/[slug]/)
 * Un HTML por servicio, generado en el build.
 *   cabecera → problemas que atiende / protocolos → cierre → quién te atiende →
 *   testimonios del servicio → "Agenda aquí"
 */
export const dynamicParams = false;

type Params = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return catalogService.getServices().map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const service = catalogService.getService((await params).slug);
  if (!service) return {};
  return {
    title: `${service.name} en Lima`,
    description: service.intro.slice(0, 158),
    alternates: { canonical: ROUTES.service(service.slug) },
  };
}

export default async function ServicePage({ params }: Params) {
  const service = catalogService.getService((await params).slug);
  if (!service) notFound();
  const doctors = doctorService.getByService(service.slug);

  return (
    <>
      <ServiceHero service={service} />
      <ServiceSections sections={service.sections} />

      {service.closing && (
        <section className={`${pageContainer} py-16`}>
          <Reveal className="mx-auto max-w-[820px] text-center">
            <SectionHeading intro={service.closing.text}>{service.closing.title}</SectionHeading>
          </Reveal>
        </section>
      )}

      {doctors.length > 0 && (
        <section className={`${pageContainer} py-16`}>
          <Reveal>
            <SectionHeading eyebrow="Te atiende">Nuestros profesionales</SectionHeading>
          </Reveal>
          <Reveal className="mx-auto mt-10 grid max-w-[1040px] grid-cols-[repeat(auto-fit,minmax(min(260px,100%),300px))] justify-center gap-5">
            {doctors.map((d) => (
              <StaffCard key={d.slug} doctor={d} serviceSlug={service.slug} />
            ))}
          </Reveal>
        </section>
      )}

      <ReviewsSection
        reviews={catalogService.getReviewsFor(service.slug)}
        rating={catalogService.getRating()}
        title="Lo que dicen nuestros pacientes"
        intro="Reseñas reales de Google de pacientes que se atendieron con nosotros."
      />
      <ServiceCtaBand service={service} />
    </>
  );
}
