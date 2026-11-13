import type { MetadataRoute } from "next";
import { ROUTES } from "@/config/routes";
import { SITE } from "@/config/site";

/** /robots.txt: permite indexar todo menos la reserva. */
export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: [ROUTES.booking()] },
    sitemap: `${SITE.url}/sitemap.xml`,
  };
}
