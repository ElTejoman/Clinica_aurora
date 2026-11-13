"use client";

import { useNextAvailableLabel } from "@/hooks/useAvailability";

/** "Hoy · 16:00". Mientras se calcula (o en el HTML estático) muestra un marcador. */
export function NextAvailableText({ slug }: { slug: string }) {
  const label = useNextAvailableLabel(slug);
  return <span aria-busy={label === undefined}>{label ?? "…"}</span>;
}
