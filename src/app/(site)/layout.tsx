import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { WhatsAppFloat } from "@/components/layout/WhatsAppFloat";
import { catalogService } from "@/services/container";

/**
 * Layout de las páginas de contenido: barra superior, navegación, pie y
 * botón flotante de WhatsApp. "(site)" es un route group: no aparece en la URL.
 */
export default function SiteLayout({ children }: { children: React.ReactNode }) {
  const services = catalogService.getServices().map(({ slug, name }) => ({ slug, name }));
  return (
    <div className="min-h-screen overflow-x-clip bg-ground">
      <Header services={services} />
      <main>{children}</main>
      <Footer services={services} />
      <WhatsAppFloat />
    </div>
  );
}
