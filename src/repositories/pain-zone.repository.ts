import type { PainZone } from "@/models";

/** Acceso a las zonas de molestia del embudo. */
export interface PainZoneRepository {
  findAll(): PainZone[];
}

export function createInMemoryPainZoneRepository(zones: readonly PainZone[]): PainZoneRepository {
  return {
    findAll: () => [...zones],
  };
}
