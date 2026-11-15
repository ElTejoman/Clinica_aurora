import { z } from "zod";

/** Formulario "Nos encanta leerte" de /contacto: se envía como mensaje de WhatsApp. */
export const contactMessageSchema = z.object({
  fullName: z.string().trim().min(3, "Escribe tu nombre completo").max(80),
  email: z.string().trim().email("Correo no válido").optional().or(z.literal("")),
  message: z.string().trim().min(10, "Cuéntanos un poco más (mínimo 10 caracteres)").max(800),
});

export type ContactMessage = z.output<typeof contactMessageSchema>;
