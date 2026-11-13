/**
 * Variables de entorno, leídas y validadas en UN solo lugar.
 *
 * Este sitio es estático: todas las variables son públicas (NEXT_PUBLIC_*) y
 * Next.js las incrusta en el HTML/JS durante `npm run build`. Por eso:
 *   - Nunca pongas secretos aquí.
 *   - Cambiar un valor exige volver a compilar (GitHub Actions lo hace en cada push).
 *
 * Next solo reemplaza `process.env.NEXT_PUBLIC_X` escrito literalmente, así que
 * cada variable se lee por su nombre completo.
 */

function readSiteUrl(raw: string | undefined): string {
  const value = raw?.trim() || "http://localhost:3000";
  try {
    return new URL(value).origin;
  } catch {
    throw new Error(`NEXT_PUBLIC_SITE_URL no es una URL válida: "${value}"`);
  }
}

export const env = {
  /** Dominio público, sin barra final. Se usa en SEO, sitemap y datos estructurados. */
  siteUrl: readSiteUrl(process.env.NEXT_PUBLIC_SITE_URL),
  /** `NEXT_PUBLIC_ENABLE_MOTION=false` apaga todas las animaciones del sitio. */
  motionEnabled: process.env.NEXT_PUBLIC_ENABLE_MOTION !== "false",
  isProduction: process.env.NODE_ENV === "production",
} as const;
