import type { Metadata } from "next";
import { Suspense } from "react";
import { BookingFlow } from "@/components/booking/BookingFlow";
import { BookingFlowFromUrl } from "@/components/booking/BookingFlowFromUrl";
import { catalogService, doctorService } from "@/services/container";

/**
 * PÁGINA · RESERVAR CITA   (ruta: /reservar/)
 *   /reservar/?servicio=acupuntura&medico=ricardo-meza&dia=2026-11-12&hora=10:30
 * Todos los parámetros son opcionales y se leen en el navegador.
 * Termina abriendo WhatsApp con la solicitud; el sitio no guarda citas.
 */
export const metadata: Metadata = {
  title: "Agendar cita",
  robots: { index: false, follow: false },
};

export default function BookingPage() {
  const doctors = doctorService.getAll();
  const services = catalogService.getServices().map(({ slug, name, tagline, icon }) => ({ slug, name, tagline, icon }));

  return (
    <Suspense fallback={<BookingFlow doctors={doctors} services={services} />}>
      <BookingFlowFromUrl doctors={doctors} services={services} />
    </Suspense>
  );
}
