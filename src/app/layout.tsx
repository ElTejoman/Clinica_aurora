import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { SITE } from "@/config/site";
import { MOTION_BOOT_SCRIPT } from "@/lib/motion";
import "./globals.css";

/**
 * LAYOUT RAÍZ: fuentes, metadatos por defecto y el script que prepara las
 * animaciones antes del primer pintado. Las cabeceras y pies están en los
 * layouts de grupo: (site) con header + footer y (checkout) con cabecera mínima.
 *
 * Las fuentes (Poppins, Lato, Cinzel · licencia OFL, subconjunto latino) están
 * en ./fonts: el build no depende de Google Fonts y se sirven desde tu dominio.
 */
const poppins = localFont({
  src: [
    { path: "./fonts/poppins-400.woff2", weight: "400" },
    { path: "./fonts/poppins-500.woff2", weight: "500" },
    { path: "./fonts/poppins-600.woff2", weight: "600" },
    { path: "./fonts/poppins-700.woff2", weight: "700" },
  ],
  variable: "--font-poppins",
  display: "swap",
});
const lato = localFont({
  src: [
    { path: "./fonts/lato-400.woff2", weight: "400" },
    { path: "./fonts/lato-700.woff2", weight: "700" },
  ],
  variable: "--font-lato",
  display: "swap",
});
const cinzel = localFont({ src: "./fonts/cinzel-variable.woff2", weight: "400 900", variable: "--font-cinzel", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: `${SITE.name} · ${SITE.tagline}`,
    template: `%s · ${SITE.name}`,
  },
  description: SITE.description,
  openGraph: {
    type: "website",
    locale: "es_PE",
    siteName: SITE.name,
    images: [{ url: "/og.jpg", width: 1200, height: 630, alt: SITE.name }],
  },
  icons: { icon: "/brand/aurora-tree.png" },
};

export const viewport: Viewport = {
  themeColor: "#FFFFFF",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es-PE" className={`${poppins.variable} ${lato.variable} ${cinzel.variable}`} suppressHydrationWarning>
      <head>
        {/* Debe ir antes de pintar: activa los estados iniciales de animación (ver lib/motion.ts). */}
        <script dangerouslySetInnerHTML={{ __html: MOTION_BOOT_SCRIPT }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
