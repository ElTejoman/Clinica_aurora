import type { NextConfig } from "next";

/**
 * Configuración de Next.js para un sitio 100 % estático (hosting compartido).
 *
 * - `output: "export"`: `npm run build` genera la carpeta `out/` con HTML, CSS,
 *   JS e imágenes. Eso es lo único que se sube a public_html (no hay Node en el
 *   servidor). Por eso no hay rutas /api ni renderizado por petición.
 * - `trailingSlash: true`: cada página sale como carpeta con index.html
 *   (/especialistas/index.html), que Apache/LiteSpeed sirve sin reglas extra.
 * - `images.unoptimized`: sin servidor no hay optimizador de imágenes; sube
 *   las fotos ya comprimidas (WebP/JPG ~1200 px) a public/doctors/.
 * - `reactStrictMode`: todas las escenas three.js y animaciones anime.js
 *   devuelven su limpieza, así que es seguro dejarlo activo.
 */
const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
  reactStrictMode: true,
  poweredByHeader: false,
};

export default nextConfig;
