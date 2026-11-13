import type { Doctor } from "@/models";
import { ROUTES } from "@/config/routes";
import { SITE } from "@/config/site";

/** Ficha schema.org/Physician de un médico (resultados enriquecidos en Google). */
export function physicianJsonLd(doctor: Doctor): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "Physician",
    name: doctor.name,
    medicalSpecialty: doctor.specialty,
    description: doctor.bio,
    url: `${SITE.url}${ROUTES.doctor(doctor.slug)}`,
    worksFor: { "@type": "MedicalClinic", name: SITE.name, address: SITE.address },
  };
}
