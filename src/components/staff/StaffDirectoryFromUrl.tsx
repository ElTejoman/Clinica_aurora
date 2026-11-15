"use client";

import { useSearchParams } from "next/navigation";
import { StaffDirectory, type StaffDirectoryProps } from "./StaffDirectory";

/**
 * Lee `?servicio=…&q=…` en el navegador. La página lo envuelve en <Suspense>
 * con el directorio sin filtros como respaldo (lo que queda en el HTML estático).
 */
export function StaffDirectoryFromUrl({ doctors, services }: Pick<StaffDirectoryProps, "doctors" | "services">) {
  const params = useSearchParams();
  const service = services.find((s) => s.slug === params.get("servicio"))?.slug ?? "todos";
  return <StaffDirectory doctors={doctors} services={services} initialService={service} initialQuery={params.get("q") ?? ""} />;
}
