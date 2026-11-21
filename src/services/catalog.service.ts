import type { Doctor, RatingSummary, Review, Service } from "@/models";
import type { ReviewRepository } from "@/repositories/review.repository";
import type { ServiceRepository } from "@/repositories/service.repository";

/**
 * Catálogo de la clínica: servicios y reseñas, y cómo se relacionan con el staff.
 */
/** ¿Se reserva con profesional, día y hora? (los servicios "whatsapp" no tienen agenda). */
export function isBookable(service: Pick<Service, "booking">): boolean {
  return service.booking !== "whatsapp";
}

export interface CatalogService {
  getServices(): Service[];
  /** Servicios con agenda: los que aparecen en /reservar, la agenda de contacto y el filtro del staff. */
  getBookableServices(): Service[];
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
    getBookableServices: () => services.findAll().filter(isBookable),
    getService: (slug) => services.findBySlug(slug),
    getServicesFor: (doctor) => services.findAll().filter((s) => doctor.serviceSlugs.includes(s.slug)),
    getReviews: () => reviews.findAll(),
    getReviewsFor: (serviceSlug) => reviews.findAll().filter((r) => r.serviceSlugs.includes(serviceSlug)),
    getRating: () => reviews.rating(),
  };
}
