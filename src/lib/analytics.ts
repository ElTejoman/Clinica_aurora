import { env } from "@/config/env";

/**
 * =============================================================================
 * ANALÍTICA DEL EMBUDO
 * =============================================================================
 * Un embudo de ventas solo se puede mejorar si se mide. Cada paso importante
 * llama a `track()` con un nombre de evento de esta lista:
 *
 *   cta_click            → clic en un CTA (con `location` y `doctor` si aplica)
 *   search_pain          → búsqueda en el hero
 *   quiz_step            → avance en "Encuentra tu dolor"
 *   quiz_complete        → resultado mostrado (zona + médico recomendado)
 *   directory_filter     → filtro/búsqueda en Especialistas
 *   booking_step         → avance en la reserva
 *   booking_confirmed    → cita creada (conversión principal)
 *
 * 🔌 CÓMO CONECTARLO
 *   - Google Analytics 4: carga gtag en layout.tsx con NEXT_PUBLIC_GA_ID y
 *     descomenta la línea de `gtag` abajo.
 *   - Meta Pixel: igual con `fbq`.
 *   - Cualquier otra herramienta (PostHog, Mixpanel): añade su llamada aquí.
 * En desarrollo, los eventos se imprimen en la consola.
 */

export type FunnelEvent =
  | "cta_click"
  | "search_pain"
  | "quiz_step"
  | "quiz_complete"
  | "directory_filter"
  | "booking_step"
  | "booking_confirmed";

type Props = Record<string, string | number | boolean | undefined>;

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    fbq?: (...args: unknown[]) => void;
  }
}

export function track(event: FunnelEvent, props: Props = {}): void {
  if (typeof window === "undefined") return;

  if (!env.isProduction) {
    console.info("[embudo]", event, props);
  }

  // Google Analytics 4
  window.gtag?.("event", event, props);

  // Meta Pixel: la conversión de cita se envía como evento estándar "Schedule".
  if (event === "booking_confirmed") window.fbq?.("track", "Schedule", props);
  else window.fbq?.("trackCustom", event, props);
}
