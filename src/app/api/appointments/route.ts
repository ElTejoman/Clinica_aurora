import { NextResponse } from "next/server";
import { appointmentSchema } from "@/lib/validation";
import { getDoctorBySlug } from "@/data/doctors";
import { createAppointment, SlotUnavailableError } from "@/services/appointments";

/**
 * POST /api/appointments
 * -----------------------------------------------------------------------------
 * Endpoint que llama el paso "Confirmar cita" de /reservar.
 *
 * Respuestas:
 *   201 { ok: true, appointmentId }
 *   400 { ok: false, errors }        → datos inválidos (zod)
 *   404 { ok: false, error }         → médico inexistente
 *   409 { ok: false, error }         → horario ya ocupado
 *   500 { ok: false, error }         → error inesperado
 *
 * 🔐 Para producción considera añadir: límite de peticiones por IP
 *    (rate limiting) y un captcha invisible (Cloudflare Turnstile).
 */
export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "JSON inválido" }, { status: 400 });
  }

  const parsed = appointmentSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, errors: parsed.error.flatten() }, { status: 400 });
  }

  const doctor = getDoctorBySlug(parsed.data.doctorSlug);
  if (!doctor) {
    return NextResponse.json({ ok: false, error: "Especialista no encontrado" }, { status: 404 });
  }
  if (!doctor.modes.includes(parsed.data.mode)) {
    return NextResponse.json({ ok: false, error: "Modalidad no disponible para este especialista" }, { status: 400 });
  }

  try {
    const { appointmentId } = await createAppointment(parsed.data);
    return NextResponse.json({ ok: true, appointmentId }, { status: 201 });
  } catch (error) {
    if (error instanceof SlotUnavailableError) {
      return NextResponse.json({ ok: false, error: error.message }, { status: 409 });
    }
    console.error("[api/appointments]", error);
    return NextResponse.json({ ok: false, error: "No pudimos registrar la cita. Inténtalo de nuevo." }, { status: 500 });
  }
}
