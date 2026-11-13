import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BookingWidget } from "@/components/profile/BookingWidget";
import { ProfileHero } from "@/components/profile/ProfileHero";
import {
  ConditionsSection,
  EducationSection,
  FirstVisitSection,
  RelatedDoctorsSection,
  ReviewsSection,
} from "@/components/profile/ProfileSections";
import { JsonLd } from "@/components/seo/JsonLd";
import { ROUTES } from "@/config/routes";
import { doctorService } from "@/services/container";
import { physicianJsonLd } from "@/utils/structured-data";

/**
 * PÁGINA 04 · PERFIL DEL MÉDICO   (ruta: /especialistas/[slug]/)
 * Es la página que más convierte: aquí el visitante decide CON QUIÉN.
 *
 * Se genera un HTML por médico en el build (`generateStaticParams`).
 * `dynamicParams = false`: un slug que no existe da 404 (requisito del export estático).
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
    description: doctor.bio,
    alternates: { canonical: ROUTES.doctor(doctor.slug) },
  };
}

export default async function DoctorPage({ params }: Params) {
  const doctor = doctorService.getBySlug((await params).slug);
  if (!doctor) notFound();

  return (
    <>
      <JsonLd data={physicianJsonLd(doctor)} />
      <ProfileHero doctor={doctor} />

      <div className="mx-auto flex max-w-page flex-wrap items-start gap-12 px-4 sm:px-8 pb-20 pt-10">
        <div className="flex min-w-0 flex-[999_1_600px] flex-col gap-[88px]">
          <ConditionsSection doctor={doctor} />
          <FirstVisitSection />
          <EducationSection education={doctor.education} />
          <ReviewsSection />
        </div>
        <aside aria-label={`Reservar con ${doctor.name}`} className="top-6 min-w-0 flex-[1_1_360px] lg:sticky">
          <BookingWidget doctor={doctor} />
        </aside>
      </div>

      <RelatedDoctorsSection doctors={doctorService.getRelated(doctor)} />
    </>
  );
}
