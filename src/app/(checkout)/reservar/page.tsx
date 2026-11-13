import type { Metadata } from "next";
import { Suspense } from "react";
import { BookingFlow } from "@/components/booking/BookingFlow";
import { BookingFlowFromUrl } from "@/components/booking/BookingFlowFromUrl";
import { doctorService } from "@/services/container";

/**
 * PÁGINA 05 · RESERVAR CITA   (ruta: /reservar/)
 * Último paso del embudo. Recibe por URL lo que el visitante ya eligió:
 *
 *   /reservar/?medico=valeria-quispe&dia=2026-11-12&hora=10:30&motivo=Lumbalgia
 *
 * Todos los parámetros son opcionales y se leen en el navegador.
 * Termina abriendo WhatsApp con la solicitud; el sitio no guarda citas.
 * `robots: noindex`: la página de reserva no debe aparecer en Google.
 */
export const metadata: Metadata = {
  title: "Reservar cita",
  robots: { index: false, follow: false },
};

export default function BookingPage() {
  const doctors = doctorService.getAll();

  return (
    <Suspense fallback={<BookingFlow doctors={doctors} />}>
      <BookingFlowFromUrl doctors={doctors} />
    </Suspense>
  );
}
