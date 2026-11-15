import type { Doctor } from "@/models";
import type { DoctorRepository } from "@/repositories/doctor.repository";
import { normalizeText } from "@/utils/text";

export interface DoctorService {
  getAll(): Doctor[];
  getBySlug(slug: string): Doctor | undefined;
  /** Profesionales que atienden un servicio. */
  getByService(serviceSlug: string): Doctor[];
  /** Profesionales sugeridos en "También te puede ayudar". */
  getRelated(doctor: Doctor): Doctor[];
}

export function createDoctorService(repository: DoctorRepository): DoctorService {
  return {
    getAll: () => repository.findAll(),
    getBySlug: (slug) => repository.findBySlug(slug),
    getByService: (serviceSlug) => repository.findAll().filter((d) => d.serviceSlugs.includes(serviceSlug)),
    getRelated: (doctor) =>
      doctor.related
        .filter((slug) => slug !== doctor.slug)
        .map((slug) => repository.findBySlug(slug))
        .filter((d): d is Doctor => Boolean(d)),
  };
}

export interface DoctorFilter {
  /** Slug de servicio o "todos". */
  service: string;
  query: string;
}

/** Búsqueda del staff: por servicio y por texto (nombre, especialidad o tratamiento, sin tildes). */
export function filterDoctors(doctors: readonly Doctor[], { service, query }: DoctorFilter): Doctor[] {
  const q = normalizeText(query.trim());
  return doctors.filter((d) => {
    const serviceMatches = service === "todos" || d.serviceSlugs.includes(service);
    const text = normalizeText([d.name, d.specialty, ...d.treats, ...d.specialties.map((s) => s.title)].join(" "));
    return serviceMatches && (!q || text.includes(q));
  });
}
