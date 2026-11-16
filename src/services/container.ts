import "server-only";
import { isWhatsAppConfigured, OPENING_HOURS } from "@/config/site";
import { DOCTORS } from "@/data/doctors";
import { RATING, REVIEWS } from "@/data/reviews";
import { DOCTOR_SCHEDULES } from "@/data/schedules";
import { SERVICES } from "@/data/services";
import { createInMemoryDoctorRepository } from "@/repositories/doctor.repository";
import { createInMemoryReviewRepository } from "@/repositories/review.repository";
import { createInMemoryScheduleRepository } from "@/repositories/schedule.repository";
import { createInMemoryServiceRepository } from "@/repositories/service.repository";
import { createCatalogService } from "./catalog.service";
import { createDoctorService } from "./doctor.service";

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
/** Horario semanal de cada profesional (bloque "Horario de atención" del perfil). */
export const scheduleRepository = createInMemoryScheduleRepository(DOCTOR_SCHEDULES, OPENING_HOURS);
