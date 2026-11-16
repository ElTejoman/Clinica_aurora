import { WhatsAppIcon } from "@/components/ui/Icon";
import { SITE } from "@/config/site";
import { whatsappUrl } from "@/utils/whatsapp";

/**
 * Botón flotante de WhatsApp (abajo a la derecha, en todas las páginas de contenido).
 * Siempre al número GENERAL de la clínica (912 724 465), nunca al de citas;
 * un test E2E lo verifica en cada página (tests/e2e/pages.spec.ts).
 */
export function WhatsAppFloat() {
  return (
    <a
      href={whatsappUrl(SITE.whatsapp.general, `Hola, quisiera información sobre ${SITE.name}.`)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Escribir a ${SITE.name} por WhatsApp`}
      className="fixed bottom-5 right-5 z-50 inline-flex h-[60px] w-[60px] items-center justify-center rounded-full bg-[#25D366] !text-white shadow-[0_12px_30px_-10px_rgba(0,0,0,.45)] transition-transform hover:scale-105"
    >
      <WhatsAppIcon size={32} />
    </a>
  );
}
