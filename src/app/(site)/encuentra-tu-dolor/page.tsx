import type { Metadata } from "next";
import { PainFinder, type Recommendation } from "@/components/pain-finder/PainFinder";
import { getPainZone, matchZoneFromText, PAIN_ZONES } from "@/data/pains";
import { getDoctorBySlug } from "@/data/doctors";
import { getUpcomingSlots } from "@/services/availability";
import type { PainZoneId } from "@/types";

/**
 * =============================================================================
 * PÁGINA 02 · ENCUENTRA TU DOLOR   (ruta: /encuentra-tu-dolor)
 * =============================================================================
 * Cuestionario de 3 preguntas → especialista recomendado.
 *
 * Parámetros de URL (entradas desde otras páginas):
 *   ?zona=espalda          → empieza en el paso 2 con la zona elegida
 *                            (chips del hero y grilla "Busca por molestia")
 *   ?q=me duele la espalda → intenta reconocer la zona por palabras clave
 *                            (buscador del hero)
 *
 * El servidor prepara, para cada zona, el médico recomendado y sus próximos
 * 3 horarios; el componente cliente solo elige cuál mostrar.
 * Es dinámica porque depende de los parámetros de la URL.
 */
export const metadata: Metadata = {
  title: "Encuentra tu especialista",
  description: "Responde 3 preguntas sobre tu molestia y te decimos qué especialista te conviene y cuándo atiende.",
};

export default async function PainFinderPage({
  searchParams,
}: {
  // En Next.js 15 searchParams llega como Promise
  searchParams: Promise<{ zona?: string; q?: string }>;
}) {
  const { zona, q } = await searchParams;
  const initialZone: PainZoneId | null = getPainZone(zona)?.id ?? (q ? matchZoneFromText(q)?.id : undefined) ?? null;

  // Recomendación por zona: médico + próximos horarios.
  const entries = await Promise.all(
    PAIN_ZONES.map(async (zone) => {
      const doctor = getDoctorBySlug(zone.doctorSlug)!;
      const slots = await getUpcomingSlots(doctor.slug, 3);
      return [zone.id, { doctor, slots }] as const;
    }),
  );
  const recommendations = Object.fromEntries(entries) as Record<PainZoneId, Recommendation>;

  return <PainFinder initialZone={initialZone} initialQuery={q ?? ""} recommendations={recommendations} />;
}
