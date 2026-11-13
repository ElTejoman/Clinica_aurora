import { z } from "zod";

/**
 * Solicitud de cita que el paciente envía por WhatsApp.
 * El esquema se usa en el formulario para habilitar el botón y mostrar errores.
 * El celular no se pide: la clínica lo recibe al llegar el mensaje de WhatsApp.
 */
export const bookingRequestSchema = z.object({
  doctorSlug: z.string().min(1, "Elige un especialista"),
  reason: z.string().trim().min(1, "Elige un motivo").max(120),
  details: z.string().trim().max(500, "Máximo 500 caracteres").optional(),
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

/** Lo que el visitante ya eligió en pasos anteriores del embudo (llega por URL). */
export interface BookingPreselection {
  doctorSlug?: string;
  date?: string;
  time?: string;
  reason?: string;
}
