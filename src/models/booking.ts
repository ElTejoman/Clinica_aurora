import { z } from "zod";

/**
 * Solicitud de cita que el paciente envía por WhatsApp.
 * El celular no se pide: la clínica lo recibe al llegar el mensaje.
 */
export const bookingRequestSchema = z.object({
  serviceSlug: z.string().min(1, "Elige un servicio"),
  details: z.string().trim().max(500, "Máximo 500 caracteres").optional(),
  doctorSlug: z.string().min(1, "Elige un profesional"),
  mode: z.enum(["presencial", "video"]),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Elige un día"),
  time: z.string().regex(/^\d{2}:\d{2}$/, "Elige una hora"),
  patient: z.object({
    fullName: z.string().trim().min(3, "Escribe tu nombre y apellido").max(80),
    /** DNI (8 dígitos) o carné de extranjería (hasta 12). Opcional. */
    documentId: z
      .string()
      .trim()
      .regex(/^[A-Za-z0-9]{8,12}$/, "Documento no válido")
      .optional()
      .or(z.literal("")),
  }),
  consent: z.literal(true, { errorMap: () => ({ message: "Debes aceptar la política de privacidad" }) }),
});

export type BookingRequestInput = z.input<typeof bookingRequestSchema>;
export type BookingRequest = z.output<typeof bookingRequestSchema>;

/** Lo que el visitante ya eligió en otra página (llega por URL). */
export interface BookingPreselection {
  serviceSlug?: string;
  doctorSlug?: string;
  date?: string;
  time?: string;
  /** Texto libre que precarga "Cuéntanos un poco más" (p. ej. una condición del perfil). */
  details?: string;
}
