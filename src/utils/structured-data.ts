import type { Article, Doctor } from "@/models";
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

/** Ficha schema.org/BlogPosting de un artículo del blog. */
export function articleJsonLd(article: Article): Record<string, unknown> {
  const clinic = { "@type": "MedicalClinic", name: SITE.name, url: SITE.url };
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: article.title,
    description: article.excerpt,
    image: `${SITE.url}${article.cover.src}`,
    url: `${SITE.url}${ROUTES.article(article.slug)}`,
    author: clinic,
    publisher: clinic,
  };
}
