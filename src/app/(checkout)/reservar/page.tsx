import type { Metadata } from "next";
import { BookingFlow } from "@/components/booking/BookingFlow";
import { getDoctorBySlug, getDoctors } from "@/data/doctors";
import { getAvailabilityMap } from "@/services/availability";

/**
 * =============================================================================
 * PÁGINA 05 · RESERVAR CITA   (ruta: /reservar)
 * =============================================================================
 * Último paso del embudo. Recibe por URL lo que el visitante ya eligió en
 * pasos anteriores para no volver a preguntárselo:
 *
 *   /reservar?medico=valeria-quispe&dia=2026-11-12&hora=10:30&motivo=Lumbalgia
 *
 * Todos los parámetros son opcionales. El servidor envía la disponibilidad de
 * todos los médicos (7 días) para que cambiar de médico sea instantáneo.
 *
 * `dynamic = "force-dynamic"`: los horarios siempre se calculan al momento.
 * `robots: noindex`: la página de reserva no debe aparecer en Google.
 */
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Reservar cita",
  robots: { index: false, follow: false },
};

export default async function BookingPage({
  searchParams,
}: {
  searchParams: Promise<{ medico?: string; dia?: string; hora?: string; motivo?: string }>;
}) {
  const { medico, dia, hora, motivo } = await searchParams;
  const doctors = getDoctors();
  const availability = await getAvailabilityMap(doctors.map((d) => d.slug), 7);
  const initialDoctor = getDoctorBySlug(medico ?? "") ?? doctors[0]!;

  return (
    <BookingFlow
      doctors={doctors}
      availability={availability}
      initial={{
        doctorSlug: initialDoctor.slug,
        recommended: Boolean(medico && getDoctorBySlug(medico)),
        date: dia,
        time: hora,
        reason: motivo?.slice(0, 120),
      }}
    />
  );
}
