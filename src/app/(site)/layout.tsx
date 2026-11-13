import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

/**
 * Layout de las páginas de contenido: Inicio, Encuentra tu dolor,
 * Especialistas y Perfil. El nombre "(site)" entre paréntesis es un
 * "route group" de Next.js: organiza archivos SIN aparecer en la URL.
 */
export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen overflow-x-hidden bg-ground">
      <Header />
      <main>{children}</main>
      <Footer />
    </div>
  );
}
