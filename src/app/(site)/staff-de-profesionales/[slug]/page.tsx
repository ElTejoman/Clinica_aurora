import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BookingWidget } from "@/components/profile/BookingWidget";
import { ProfileHero } from "@/components/profile/ProfileHero";
import { ExperienceSection, RelatedDoctorsSection, SpecialtiesSection } from "@/components/profile/ProfileSections";
import { ScheduleCard } from "@/components/profile/ScheduleCard";
import { JsonLd } from "@/components/seo/JsonLd";
import { ROUTES } from "@/config/routes";
import { catalogService, doctorService, scheduleRepository } from "@/services/container";
import { physicianJsonLd } from "@/utils/structured-data";

/**
 * PÁGINA · PERFIL DEL PROFESIONAL   (ruta: /staff-de-profesionales/[slug]/)
 * Un HTML por profesional, generado en el build. `dynamicParams = false`:
 * un slug que no existe da 404 (requisito del export estático).
 */
export const dynamicParams = false;

type Params = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return doctorService.getAll().map((d) => ({ slug: d.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const doctor = doctorService.getBySlug((await params).slug);
  if (!doctor) return {};
  return {
    title: `${doctor.name} · ${doctor.specialty}`,
    description: doctor.bio.slice(0, 158),
    alternates: { canonical: ROUTES.doctor(doctor.slug) },
  };
}

export default async function DoctorPage({ params }: Params) {
  const doctor = doctorService.getBySlug((await params).slug);
  if (!doctor) notFound();
  const services = catalogService.getServicesFor(doctor);

  return (
    <>
      <JsonLd data={physicianJsonLd(doctor)} />
      <ProfileHero doctor={doctor} services={services} />

      <div className="mx-auto flex max-w-page flex-wrap items-start gap-12 px-4 pb-20 pt-14 sm:px-8">
        <div className="flex min-w-0 flex-[999_1_600px] flex-col gap-16">
          <ScheduleCard doctor={doctor} schedule={scheduleRepository.getForDoctor(doctor.slug)} />
          <SpecialtiesSection specialties={doctor.specialties} />
          <ExperienceSection experience={doctor.experience} />
        </div>
        <aside aria-label={`Reservar con ${doctor.name}`} className="top-28 min-w-0 flex-[1_1_340px] lg:sticky">
          <BookingWidget doctor={doctor} serviceSlug={services[0]?.slug} />
        </aside>
      </div>

      <RelatedDoctorsSection doctors={doctorService.getRelated(doctor)} />
    </>
  );
}
