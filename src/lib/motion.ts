import { env } from "@/config/env";

/**
 * =============================================================================
 * UTILIDADES DE MOVIMIENTO
 * =============================================================================
 * Reglas que siguen TODAS las animaciones del sitio (anime.js y three.js):
 *
 *   1. Respetan "reducir movimiento" del sistema operativo.
 *   2. Se pueden apagar en todo el sitio con NEXT_PUBLIC_ENABLE_MOTION=false
 *      (ver src/config/env.ts).
 *   3. Solo corren en el navegador (dentro de useEffect) y SIEMPRE devuelven
 *      una función de limpieza para no dejar loops ni listeners vivos.
 *
 * Estados iniciales ocultos:
 *   Para evitar un "parpadeo" (el contenido se ve, desaparece y vuelve a
 *   aparecer), un script en <head> (ver `MOTION_BOOT_SCRIPT`) añade la clase
 *   `js-motion` a <html> ANTES de pintar. globals.css oculta con esa clase:
 *     [data-reveal]  → bloques que aparecen al hacer scroll  (<Reveal />)
 *     [data-fade]    → elementos de la intro de cada página (<Intro />)
 *     .split-line    → líneas de titulares que suben         (<SplitLines />)
 *   y los componentes de animación los llevan a su estado final.
 */

export const MOTION_ENABLED = env.motionEnabled;

/** ¿Podemos animar ahora mismo? Llamar solo en el navegador. */
export function motionAllowed(): boolean {
  if (!MOTION_ENABLED || typeof window === "undefined") return false;
  return !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/**
 * Script en línea que se inserta en <head> (layout.tsx). Es diminuto y
 * síncrono a propósito: debe correr antes del primer pintado.
 */
export const MOTION_BOOT_SCRIPT = `(function(){try{if(${MOTION_ENABLED}&&!window.matchMedia('(prefers-reduced-motion: reduce)').matches){document.documentElement.classList.add('js-motion')}}catch(e){}})();`;

/** Muestra un elemento sin animación (fallback cuando no se puede animar). */
export function showInstantly(el: HTMLElement | null): void {
  if (!el) return;
  el.style.opacity = "1";
  el.style.transform = "none";
}
