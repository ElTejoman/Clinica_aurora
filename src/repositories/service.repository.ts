import type { Service } from "@/models";

/** Acceso a los servicios de la clínica. */
export interface ServiceRepository {
  findAll(): Service[];
  findBySlug(slug: string): Service | undefined;
}

/** Implementación sobre un array en memoria (hoy: src/data/services.ts). */
export function createInMemoryServiceRepository(services: readonly Service[]): ServiceRepository {
  const bySlug = new Map(services.map((s) => [s.slug, s]));
  return {
    findAll: () => [...services],
    findBySlug: (slug) => bySlug.get(slug),
  };
}
