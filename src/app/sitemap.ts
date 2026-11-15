import type { MetadataRoute } from "next";
import { ROUTES } from "@/config/routes";
import { SITE } from "@/config/site";
import { catalogService, doctorService } from "@/services/container";

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
    page(ROUTES.services, 0.9),
    ...catalogService.getServices().map((s) => page(ROUTES.service(s.slug), 0.9)),
    page(ROUTES.staff(), 0.8),
    ...doctorService.getAll().map((d) => page(ROUTES.doctor(d.slug), 0.8)),
    page(ROUTES.contact(), 0.7),
    page(ROUTES.complaints, 0.3),
  ];
}
