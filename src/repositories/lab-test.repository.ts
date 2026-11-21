import type { LabTest } from "@/models";

/** Acceso al tarifario de laboratorio. */
export interface LabTestRepository {
  findAll(): LabTest[];
}

/** Implementación sobre un array en memoria (hoy: src/data/lab-tests.ts). */
export function createInMemoryLabTestRepository(tests: readonly LabTest[]): LabTestRepository {
  return { findAll: () => [...tests] };
}
