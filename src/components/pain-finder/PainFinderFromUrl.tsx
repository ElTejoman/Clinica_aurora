"use client";

import { useSearchParams } from "next/navigation";
import { resolveInitialZone } from "@/services/pain-finder.service";
import { PainFinder, type PainFinderProps } from "./PainFinder";

/**
 * Lee `?zona=…` o `?q=…` en el navegador y abre el cuestionario en el paso
 * que corresponde. La página lo envuelve en <Suspense> con el cuestionario
 * desde el paso 1 como respaldo (lo que queda en el HTML estático).
 */
export function PainFinderFromUrl({ zones, recommendations }: Pick<PainFinderProps, "zones" | "recommendations">) {
  const params = useSearchParams();
  const query = params.get("q")?.trim().slice(0, 120) ?? "";
  const initialZone = resolveInitialZone(zones, { zona: params.get("zona"), q: query });

  return <PainFinder zones={zones} recommendations={recommendations} initialZone={initialZone} initialQuery={query} />;
}
