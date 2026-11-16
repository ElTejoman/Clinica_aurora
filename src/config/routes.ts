/**
 * Rutas del sitio. Úsalas siempre en lugar de escribir URLs a mano.
 *
 * Terminan en "/" porque el sitio se exporta como carpetas con index.html
 * (`trailingSlash: true`): así el hosting las sirve sin reglas de reescritura.
 */

type QueryParams = Record<string, string | undefined>;

function withQuery(path: string, params?: QueryParams): string {
  const entries = Object.entries(params ?? {}).filter((e): e is [string, string] => Boolean(e[1]));
  const qs = new URLSearchParams(entries).toString();
  return qs ? `${path}?${qs}` : path;
}

export const ROUTES = {
  home: "/",
  services: "/servicios/",
  service: (slug: string) => `/servicios/${slug}/`,
  staff: (params?: { servicio?: string; q?: string }) => withQuery("/staff-de-profesionales/", params),
  doctor: (slug: string) => `/staff-de-profesionales/${slug}/`,
  blog: "/blog-educativo/",
  article: (slug: string) => `/blog-educativo/${slug}/`,
  contact: (section?: "agendar" | "escribenos" | "sede") => (section ? `/contacto/#${section}` : "/contacto/"),
  complaints: "/libro-de-reclamaciones/",
  complaintForm: "/libro-de-reclamaciones/hoja/",
  booking: (params?: { servicio?: string; medico?: string; dia?: string; hora?: string; motivo?: string }) =>
    withQuery("/reservar/", params),
} as const;

/** ¿La ruta actual corresponde a `href`? Ignora la barra final y la query. */
export function isCurrentSection(pathname: string, href: string): boolean {
  const strip = (p: string) => p.split(/[?#]/)[0]!.replace(/\/+$/, "");
  const target = strip(href);
  return target === "" ? strip(pathname) === "" : strip(pathname).startsWith(target);
}
