import type { Doctor, RatingSummary, Review, Service } from "@/models";
import type { ReviewRepository } from "@/repositories/review.repository";
import type { ServiceRepository } from "@/repositories/service.repository";

/**
 * Catálogo de la clínica: servicios y reseñas, y cómo se relacionan con el staff.
 */
export interface CatalogService {
  getServices(): Service[];
  getService(slug: string): Service | undefined;
  /** Servicios que ofrece un profesional, en el orden del catálogo. */
  getServicesFor(doctor: Doctor): Service[];
  getReviews(): Review[];
  /** Reseñas que mencionan un servicio. */
  getReviewsFor(serviceSlug: string): Review[];
  getRating(): RatingSummary;
}

export function createCatalogService(services: ServiceRepository, reviews: ReviewRepository): CatalogService {
  return {
    getServices: () => services.findAll(),
    getService: (slug) => services.findBySlug(slug),
    getServicesFor: (doctor) => services.findAll().filter((s) => doctor.serviceSlugs.includes(s.slug)),
    getReviews: () => reviews.findAll(),
    getReviewsFor: (serviceSlug) => reviews.findAll().filter((r) => r.serviceSlugs.includes(serviceSlug)),
    getRating: () => reviews.rating(),
  };
}
