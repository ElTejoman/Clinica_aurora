import type { MetadataRoute } from "next";
import { SITE } from "@/lib/site";

/** /robots.txt: permite indexar todo menos la reserva y la API. */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/reservar", "/api/"] },
    sitemap: `${SITE.url}/sitemap.xml`,
  };
}
