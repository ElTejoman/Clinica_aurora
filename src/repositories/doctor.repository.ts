import type { Doctor } from "@/models";

/** Acceso a las fichas de los médicos. */
export interface DoctorRepository {
  findAll(): Doctor[];
  findBySlug(slug: string): Doctor | undefined;
}

/** Implementación sobre un array en memoria (hoy: src/data/doctors.ts). */
export function createInMemoryDoctorRepository(doctors: readonly Doctor[]): DoctorRepository {
  const bySlug = new Map(doctors.map((d) => [d.slug, d]));
  return {
    findAll: () => [...doctors],
    findBySlug: (slug) => bySlug.get(slug),
  };
}
