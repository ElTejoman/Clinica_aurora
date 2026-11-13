"use client";

import { useSearchParams } from "next/navigation";
import type { Doctor } from "@/models";
import { parseBookingPreselection } from "@/services/booking.service";
import { BookingFlow } from "./BookingFlow";

/**
 * Lee `?medico=…&dia=…&hora=…&motivo=…` en el navegador y abre la reserva
 * con todo preseleccionado. La página lo envuelve en <Suspense>.
 */
export function BookingFlowFromUrl({ doctors }: { doctors: Doctor[] }) {
  const params = useSearchParams();
  return <BookingFlow doctors={doctors} preselection={parseBookingPreselection((key) => params.get(key))} />;
}
