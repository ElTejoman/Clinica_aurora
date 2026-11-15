"use client";

import { useSearchParams } from "next/navigation";
import { useMemo } from "react";
import { parseBookingPreselection } from "@/services/booking.service";
import { BookingFlow, type BookingFlowProps } from "./BookingFlow";

/**
 * Lee `?servicio=…&medico=…&dia=…&hora=…&motivo=…` en el navegador y abre la
 * reserva con todo preseleccionado. La página lo envuelve en <Suspense>.
 */
export function BookingFlowFromUrl({ doctors, services }: Omit<BookingFlowProps, "preselection">) {
  const params = useSearchParams();
  const query = params.toString();
  const preselection = useMemo(() => parseBookingPreselection((key) => new URLSearchParams(query).get(key)), [query]);
  return <BookingFlow doctors={doctors} services={services} preselection={preselection} />;
}
