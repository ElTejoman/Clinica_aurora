import type { Metadata } from "next";
import { Suspense } from "react";
import { PainFinder } from "@/components/pain-finder/PainFinder";
import { PainFinderFromUrl } from "@/components/pain-finder/PainFinderFromUrl";
import { painFinderService } from "@/services/container";

/**
 * PÁGINA 02 · ENCUENTRA TU DOLOR   (ruta: /encuentra-tu-dolor/)
 * Cuestionario de 3 preguntas → especialista recomendado.
 *
 * Entradas desde otras páginas (se leen en el navegador, <PainFinderFromUrl>):
 *   ?zona=espalda           → empieza en el paso 2 con la zona elegida
 *   ?q=me duele la espalda  → reconoce la zona por palabras clave
 */
export const metadata: Metadata = {
  title: "Encuentra tu especialista",
  description: "Responde 3 preguntas sobre tu molestia y te decimos qué especialista te conviene y cuándo atiende.",
};

export default function PainFinderPage() {
  const zones = painFinderService.getZones();
  const recommendations = painFinderService.getRecommendations();

  return (
    <Suspense fallback={<PainFinder zones={zones} recommendations={recommendations} />}>
      <PainFinderFromUrl zones={zones} recommendations={recommendations} />
    </Suspense>
  );
}
