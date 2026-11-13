import type { NextConfig } from "next";

/**
 * Configuración de Next.js.
 *
 * - `reactStrictMode`: monta los componentes dos veces en desarrollo para detectar
 *   efectos sin limpieza. Todas las escenas de three.js y animaciones de anime.js
 *   de este proyecto devuelven su función de limpieza, así que es seguro dejarlo activo.
 * - `images.remotePatterns`: cuando subas las fotos reales de los médicos a un CDN
 *   (Cloudinary, S3, Supabase Storage…), agrega aquí su dominio para usar <Image />.
 */
const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      // { protocol: "https", hostname: "res.cloudinary.com" },
    ],
  },
};

export default nextConfig;
