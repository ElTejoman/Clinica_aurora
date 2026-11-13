import "server-only";
import { isWhatsAppConfigured } from "@/config/site";
import { DOCTORS, HOME_HIGHLIGHTS } from "@/data/doctors";
import { PAIN_ZONES } from "@/data/pains";
import { createInMemoryDoctorRepository } from "@/repositories/doctor.repository";
import { createInMemoryPainZoneRepository } from "@/repositories/pain-zone.repository";
import { createDoctorService } from "./doctor.service";
import { createPainFinderService } from "./pain-finder.service";

/**
 * Punto de composición (DIP): aquí, y solo aquí, se decide qué implementación
 * concreta usa cada servicio. Lo importan las páginas (componentes de servidor,
 * que en este sitio estático se ejecutan durante `npm run build`).
 *
 * `server-only` impide importarlo desde un componente cliente por error,
 * así los datos completos no se cuelan en el JavaScript del navegador.
 *
 * Para pasar a un CMS: crea otra implementación de `DoctorRepository` y
 * cámbiala abajo. La disponibilidad (que depende de la hora actual) se
 * compone en el navegador: src/hooks/useAvailability.ts.
 */
if (!isWhatsAppConfigured) {
  console.warn("⚠️  SITE.whatsapp no está configurado (src/config/site.ts): las solicitudes de cita no llegarán a la clínica.");
}

const doctorRepository = createInMemoryDoctorRepository(DOCTORS);
const painZoneRepository = createInMemoryPainZoneRepository(PAIN_ZONES);

export const doctorService = createDoctorService(doctorRepository, HOME_HIGHLIGHTS);
export const painFinderService = createPainFinderService(painZoneRepository, doctorRepository);
