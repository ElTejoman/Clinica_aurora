import type { PainZoneId } from "@/models";

/**
 * Rutas del sitio. Úsalas siempre en lugar de escribir URLs a mano.
 *
 * Terminan en "/" porque el sitio se exporta como carpetas con index.html
 * (`trailingSlash: true`): así el hosting las sirve sin reglas de reescritura.
 * Los parámetros viajan entre pasos del embudo para no volver a preguntar.
 */

type QueryParams = Record<string, string | undefined>;

function withQuery(path: string, params?: QueryParams): string {
  const entries = Object.entries(params ?? {}).filter((e): e is [string, string] => Boolean(e[1]));
  const qs = new URLSearchParams(entries).toString();
  return qs ? `${path}?${qs}` : path;
}

export const ROUTES = {
  home: "/",
  howItWorks: "/#como",
  painFinder: (params?: { zona?: PainZoneId; q?: string }) => withQuery("/encuentra-tu-dolor/", params),
  specialists: (params?: { molestia?: PainZoneId; q?: string }) => withQuery("/especialistas/", params),
  doctor: (slug: string) => `/especialistas/${slug}/`,
  booking: (params?: { medico?: string; motivo?: string; dia?: string; hora?: string }) => withQuery("/reservar/", params),
} as const;

/** ¿La ruta actual corresponde a `href`? Ignora la barra final y la query. */
export function isCurrentSection(pathname: string, href: string): boolean {
  const strip = (p: string) => p.split(/[?#]/)[0]!.replace(/\/+$/, "");
  const target = strip(href);
  return target !== "" && strip(pathname).startsWith(target);
}
