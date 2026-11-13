import { z } from "zod";

/**
 * =============================================================================
 * VALIDACIÓN DE LA RESERVA (zod)
 * =============================================================================
 * El MISMO esquema se usa en el navegador (para habilitar el botón y mostrar
 * errores) y en el servidor (POST /api/appointments). Nunca confíes solo en
 * la validación del navegador: el servidor siempre vuelve a validar.
 */

/** Celular peruano: 9 dígitos que empiezan en 9 (se ignoran espacios y +51). */
export const peruMobile = z
  .string()
  .transform((v) => v.replace(/[\s-]/g, "").replace(/^\+?51/, ""))
  .refine((v) => /^9\d{8}$/.test(v), "Ingresa un celular de 9 dígitos que empiece en 9");

export const appointmentSchema = z.object({
  doctorSlug: z.string().min(1, "Elige un especialista"),
  reason: z.string().min(1, "Elige un motivo"),
  details: z.string().max(1000).optional(),
  mode: z.enum(["presencial", "video"]),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Elige un día"),
  time: z.string().regex(/^\d{2}:\d{2}$/, "Elige una hora"),
  patient: z.object({
    fullName: z.string().trim().min(3, "Escribe tu nombre y apellido"),
    // DNI (8 dígitos) o carné de extranjería (hasta 12). Opcional.
    documentId: z
      .string()
      .trim()
      .regex(/^[A-Za-z0-9]{8,12}$/, "Documento no válido")
      .optional()
      .or(z.literal("")),
    phone: peruMobile,
    email: z.string().trim().email("Correo no válido").optional().or(z.literal("")),
  }),
  consent: z.literal(true, { errorMap: () => ({ message: "Debes aceptar la política de privacidad" }) }),
});

export type AppointmentInput = z.input<typeof appointmentSchema>;
export type AppointmentData = z.output<typeof appointmentSchema>;
