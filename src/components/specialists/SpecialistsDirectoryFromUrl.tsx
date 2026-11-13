"use client";

import { useSearchParams } from "next/navigation";
import { SpecialistsDirectory, type SpecialistsDirectoryProps } from "./SpecialistsDirectory";

/**
 * Lee `?molestia=…&q=…` en el navegador y abre el directorio ya filtrado.
 * En un sitio estático la URL no existe en el build: la página envuelve este
 * componente en <Suspense> con el directorio sin filtros como respaldo (que
 * es lo que queda en el HTML para buscadores).
 */
export function SpecialistsDirectoryFromUrl({ doctors, zones }: Omit<SpecialistsDirectoryProps, "initialFilter" | "initialQuery">) {
  const params = useSearchParams();
  const zone = zones.find((z) => z.id === params.get("molestia"));

  return <SpecialistsDirectory doctors={doctors} zones={zones} initialFilter={zone?.id ?? "todos"} initialQuery={params.get("q") ?? ""} />;
}
