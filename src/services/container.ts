import "server-only";
import { isWhatsAppConfigured, OPENING_HOURS } from "@/config/site";
import { ARTICLES } from "@/data/articles";
import { DOCTORS } from "@/data/doctors";
import { RATING, REVIEWS } from "@/data/reviews";
import { POPULAR_LAB_TESTS } from "@/data/lab-popular";
import { LAB_TESTS } from "@/data/lab-tests";
import { DOCTOR_SCHEDULES } from "@/data/schedules";
import { SERVICES } from "@/data/services";
import { createInMemoryArticleRepository } from "@/repositories/article.repository";
import { createInMemoryDoctorRepository } from "@/repositories/doctor.repository";
import { createInMemoryLabTestRepository } from "@/repositories/lab-test.repository";
import { createInMemoryReviewRepository } from "@/repositories/review.repository";
import { createInMemoryScheduleRepository } from "@/repositories/schedule.repository";
import { createInMemoryServiceRepository } from "@/repositories/service.repository";
import { createBlogService } from "./blog.service";
import { createCatalogService } from "./catalog.service";
import { createDoctorService } from "./doctor.service";
import { createLabService } from "./lab.service";

/**
 * Punto de composición (DIP): aquí, y solo aquí, se decide qué implementación
 * concreta usa cada servicio. Lo importan las páginas (componentes de servidor,
 * que en este sitio estático se ejecutan durante `npm run build`).
 *
 * `server-only` impide importarlo desde un componente cliente por error.
 * Para pasar a un CMS: crea otra implementación del repositorio y cámbiala
 * abajo. La disponibilidad (depende de la hora actual) se compone en el
 * navegador: src/hooks/useAvailability.ts.
 */
if (!isWhatsAppConfigured) {
  console.warn("⚠️  SITE.whatsapp no está configurado (src/config/site.ts): las solicitudes de cita no llegarán a la clínica.");
}

export const doctorService = createDoctorService(createInMemoryDoctorRepository(DOCTORS));
export const catalogService = createCatalogService(
  createInMemoryServiceRepository(SERVICES),
  createInMemoryReviewRepository(REVIEWS, RATING),
);
export const blogService = createBlogService(createInMemoryArticleRepository(ARTICLES));
export const labService = createLabService(createInMemoryLabTestRepository(LAB_TESTS), POPULAR_LAB_TESTS);
/** Horario semanal de cada profesional (bloque "Horario de atención" del perfil). */
export const scheduleRepository = createInMemoryScheduleRepository(DOCTOR_SCHEDULES, OPENING_HOURS);
