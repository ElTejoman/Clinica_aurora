import "server-only";
import { randomUUID } from "crypto";
import type { AppointmentData } from "@/lib/validation";
import { getDoctorAvailability } from "@/services/availability";

/**
 * =============================================================================
 * SERVICIO DE CITAS (SOLO SERVIDOR)
 * =============================================================================
 * Recibe una cita YA VALIDADA por zod y la registra.
 *
 * Hoy hace tres cosas:
 *   1. Comprueba que el horario siga libre (evita reservas dobles).
 *   2. Genera un ID de cita.
 *   3. Si existe APPOINTMENTS_WEBHOOK_URL, envía la cita a ese webhook
 *      (ideal para n8n/Make/Zapier: guardar en la agenda + mandar WhatsApp).
 *
 * 🔌 PRÓXIMOS PASOS PARA PRODUCCIÓN
 *   - Guardar en tu base de datos (ej. Supabase):
 *       await supabase.from("appointments").insert({ id, ...data });
 *   - Bloquear el horario en la agenda del médico dentro de una transacción.
 *   - Enviar la confirmación por WhatsApp Business API y correo.
 *   - Registrar consentimiento (Ley N.º 29733 de Protección de Datos Personales).
 */

export class SlotUnavailableError extends Error {
  constructor() {
    super("El horario elegido ya no está disponible");
  }
}

export async function createAppointment(data: AppointmentData): Promise<{ appointmentId: string }> {
  // 1) ¿Sigue libre el horario?
  const days = await getDoctorAvailability(data.doctorSlug, 14);
  const day = days.find((d) => d.date === data.date);
  if (!day || !day.slots.includes(data.time)) throw new SlotUnavailableError();

  // 2) ID de la cita (cámbialo por el que devuelva tu base de datos).
  const appointmentId = `AUR-${randomUUID().slice(0, 8).toUpperCase()}`;

  // 3) Webhook opcional.
  const webhook = process.env.APPOINTMENTS_WEBHOOK_URL;
  if (webhook) {
    const res = await fetch(webhook, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ appointmentId, createdAt: new Date().toISOString(), ...data }),
    });
    if (!res.ok) throw new Error(`Webhook respondió ${res.status}`);
  }

  // TODO(producción): guardar en base de datos aquí.
  return { appointmentId };
}
