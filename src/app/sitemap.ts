import type { MetadataRoute } from "next";
import { getDoctors } from "@/data/doctors";
import { SITE } from "@/lib/site";

/**
 * /sitemap.xml generado automáticamente: incluye cada perfil de médico.
 * Envíalo a Google Search Console cuando publiques el sitio.
 * (La página /reservar se excluye a propósito: no debe indexarse.)
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    { url: `${SITE.url}/`, lastModified: now, priority: 1 },
    { url: `${SITE.url}/encuentra-tu-dolor`, lastModified: now, priority: 0.9 },
    { url: `${SITE.url}/especialistas`, lastModified: now, priority: 0.9 },
    ...getDoctors().map((d) => ({ url: `${SITE.url}/especialistas/${d.slug}`, lastModified: now, priority: 0.8 })),
  ];
}
