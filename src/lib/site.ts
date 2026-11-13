/**
 * =============================================================================
 * CONFIGURACIÓN DEL SITIO
 * =============================================================================
 * Todos los datos de contacto y textos "de empresa" en un solo lugar.
 * ➜ Reemplaza los valores entre corchetes antes de publicar. Una búsqueda de
 *   "[" en el proyecto te mostrará cualquier dato pendiente.
 */
export const SITE = {
  name: "Clínica Aurora",
  /** Lema corto del pie de página. */
  tagline: "Especialistas que te escuchan primero.",
  /** URL pública; se lee de la variable de entorno para no hardcodearla. */
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  city: "Lima",

  phone: "[TELÉFONO]",
  /** Número de WhatsApp en formato internacional sin "+" (ej. 51987654321). */
  whatsapp: "[NÚMERO]",
  email: "[CORREO]",
  address: "[DIRECCIÓN]",
  hours: "[HORARIO DE ATENCIÓN]",
  insurers: "[ASEGURADORAS]",

  /** Política de cambios que se muestra junto al botón de reserva. */
  reschedulePolicy: "Cancela o reprograma gratis hasta 12 h antes",
} as const;

/** Enlace de WhatsApp con mensaje prellenado (opcional). */
export function whatsappLink(message?: string): string {
  const base = `https://wa.me/${SITE.whatsapp}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}

/**
 * Rutas del sitio. Úsalas en lugar de escribir URLs a mano: si un día cambias
 * "/especialistas" por "/medicos", lo cambias solo aquí.
 */
export const ROUTES = {
  home: "/",
  painFinder: "/encuentra-tu-dolor",
  specialists: "/especialistas",
  doctor: (slug: string) => `/especialistas/${slug}`,
  /**
   * Página de reserva. Acepta parámetros para llegar con todo preseleccionado
   * desde cualquier CTA (perfil, cuestionario, tarjeta…).
   */
  booking: (params?: { medico?: string; motivo?: string; dia?: string; hora?: string }) => {
    const qs = new URLSearchParams(
      Object.entries(params ?? {}).filter((e): e is [string, string] => Boolean(e[1])),
    ).toString();
    return qs ? `/reservar?${qs}` : "/reservar";
  },
} as const;
