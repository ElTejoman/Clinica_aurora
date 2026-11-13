import type { Metadata, Viewport } from "next";
import { Cinzel, Instrument_Serif, Inter } from "next/font/google";
import { MOTION_BOOT_SCRIPT } from "@/lib/motion";
import { SITE } from "@/lib/site";
import "./globals.css";

/**
 * =============================================================================
 * LAYOUT RAÍZ
 * =============================================================================
 * Envuelve TODAS las páginas. Aquí van:
 *   - Las fuentes (next/font las descarga en el build y las sirve desde tu
 *     dominio: sin parpadeo y sin pedir nada a Google en cada visita).
 *   - Metadatos por defecto (SEO / redes sociales).
 *   - El script que prepara las animaciones antes del primer pintado.
 *
 * Las cabeceras y pies están en los layouts de grupo:
 *   src/app/(site)/layout.tsx      → páginas de contenido (header + footer)
 *   src/app/(checkout)/layout.tsx  → reserva (cabecera mínima)
 *
 * 📈 Analítica: carga aquí gtag / Meta Pixel cuando tengas los IDs
 *    (ver src/lib/analytics.ts). Usa `next/script` con strategy="afterInteractive".
 */

/** Texto: Inter. */
const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
/** Titulares: Instrument Serif (normal + cursiva). */
const instrument = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-instrument",
  display: "swap",
});
/** Marca (logo y nombre en mayúsculas): Cinzel, similar a la del logo original. */
const cinzel = Cinzel({ subsets: ["latin"], weight: ["500", "600"], variable: "--font-cinzel", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: "Clínica Aurora · Especialistas en Lima",
    template: "%s · Clínica Aurora",
  },
  description:
    "Cuéntanos qué te duele y te presentamos al especialista que sabe tratarlo. Reserva tu cita en Lima, presencial o por video.",
  openGraph: {
    type: "website",
    locale: "es_PE",
    siteName: SITE.name,
    // TODO: crea /public/og.jpg (1200×630) con el logo y una frase.
    // images: ["/og.jpg"],
  },
  icons: { icon: "/brand/aurora-tree.png" },
};

export const viewport: Viewport = {
  themeColor: "#F5F6F2",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es-PE" className={`${inter.variable} ${instrument.variable} ${cinzel.variable}`} suppressHydrationWarning>
      <head>
        {/* Debe ir antes de pintar: activa los estados iniciales de animación (ver lib/motion.ts).
            suppressHydrationWarning en <html> evita el aviso por la clase que añade. */}
        <script dangerouslySetInnerHTML={{ __html: MOTION_BOOT_SCRIPT }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
