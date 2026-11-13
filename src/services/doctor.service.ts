import type { Doctor, PainZoneId } from "@/models";
import type { DoctorRepository } from "@/repositories/doctor.repository";
import { normalizeText } from "@/utils/text";

export interface HomeHighlights {
  heroDoctor: string;
  spotlightDoctor: string;
  featuredCount: number;
}

export interface DoctorService {
  getAll(): Doctor[];
  getBySlug(slug: string): Doctor | undefined;
  /** Médicos de la sección "Nuestros médicos" del inicio. */
  getFeatured(): Doctor[];
  /** Médico de la tarjeta "Disponible hoy" del hero. */
  getHeroDoctor(): Doctor;
  /** Médico del bloque de video del inicio. */
  getSpotlightDoctor(): Doctor;
  /** Médicos sugeridos en "También te puede ayudar". */
  getRelated(doctor: Doctor): Doctor[];
}

export function createDoctorService(repository: DoctorRepository, highlights: HomeHighlights): DoctorService {
  const first = (): Doctor => {
    const [doctor] = repository.findAll();
    if (!doctor) throw new Error("No hay médicos cargados en src/data/doctors.ts");
    return doctor;
  };

  return {
    getAll: () => repository.findAll(),
    getBySlug: (slug) => repository.findBySlug(slug),
    getFeatured: () => repository.findAll().slice(0, highlights.featuredCount),
    getHeroDoctor: () => repository.findBySlug(highlights.heroDoctor) ?? first(),
    getSpotlightDoctor: () => repository.findBySlug(highlights.spotlightDoctor) ?? first(),
    getRelated: (doctor) =>
      doctor.related
        .filter((slug) => slug !== doctor.slug)
        .map((slug) => repository.findBySlug(slug))
        .filter((d): d is Doctor => Boolean(d)),
  };
}

export interface DoctorFilter {
  zone: PainZoneId | "todos";
  query: string;
}

/** Búsqueda del directorio: por zona y por texto (nombre, especialidad o síntoma, sin tildes). */
export function filterDoctors(doctors: readonly Doctor[], { zone, query }: DoctorFilter): Doctor[] {
  const q = normalizeText(query.trim());
  return doctors.filter((d) => {
    const zoneMatches = zone === "todos" || d.zone === zone;
    const text = normalizeText([d.name, d.specialty, ...d.treats, ...d.conditions].join(" "));
    return zoneMatches && (!q || text.includes(q));
  });
}
