import type { Doctor, PainZone, PainZoneId } from "@/models";
import type { DoctorRepository } from "@/repositories/doctor.repository";
import type { PainZoneRepository } from "@/repositories/pain-zone.repository";
import { normalizeText } from "@/utils/text";

/**
 * Lógica del cuestionario "Encuentra tu dolor": reconocer la zona a partir de
 * lo que escribe el visitante y elegir al especialista recomendado.
 */

/**
 * "me duele la espalda al despertar" → zona "espalda".
 * Coincidencia por palabras clave: simple y predecible. Si un día quieres algo
 * más inteligente (un clasificador), este es el único punto a cambiar.
 */
export function matchZoneFromText(zones: readonly PainZone[], text: string): PainZone | undefined {
  const q = normalizeText(text);
  if (!q.trim()) return undefined;
  return zones.find((z) => z.keywords.some((k) => q.includes(normalizeText(k))));
}

/** Zona inicial a partir de la URL: `?zona=espalda` o `?q=me duele la espalda`. */
export function resolveInitialZone(
  zones: readonly PainZone[],
  params: { zona?: string | null; q?: string | null },
): PainZoneId | null {
  const byId = zones.find((z) => z.id === params.zona);
  return byId?.id ?? (params.q ? matchZoneFromText(zones, params.q)?.id : undefined) ?? null;
}

export type Recommendations = Partial<Record<PainZoneId, Doctor>>;

export interface PainFinderService {
  getZones(): PainZone[];
  /** Médico recomendado por zona. Hoy depende solo de la zona (`PainZone.doctorSlug`). */
  getRecommendations(): Recommendations;
}

export function createPainFinderService(zones: PainZoneRepository, doctors: DoctorRepository): PainFinderService {
  return {
    getZones: () => zones.findAll(),
    getRecommendations: () => {
      const recommendations: Recommendations = {};
      for (const zone of zones.findAll()) {
        const doctor = doctors.findBySlug(zone.doctorSlug);
        if (doctor) recommendations[zone.id] = doctor;
      }
      return recommendations;
    },
  };
}
