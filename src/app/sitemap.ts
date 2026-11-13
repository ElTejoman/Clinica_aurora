import type { MetadataRoute } from "next";
import { ROUTES } from "@/config/routes";
import { SITE } from "@/config/site";
import { doctorService } from "@/services/container";

/**
 * /sitemap.xml generado en el build: incluye cada perfil de médico.
 * Envíalo a Google Search Console cuando publiques el sitio.
 * (/reservar/ se excluye a propósito: no debe indexarse.)
 */
export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  const page = (path: string, priority: number) => ({ url: `${SITE.url}${path}`, lastModified, priority });
  return [
    page(ROUTES.home, 1),
    page(ROUTES.painFinder(), 0.9),
    page(ROUTES.specialists(), 0.9),
    ...doctorService.getAll().map((d) => page(ROUTES.doctor(d.slug), 0.8)),
  ];
}
