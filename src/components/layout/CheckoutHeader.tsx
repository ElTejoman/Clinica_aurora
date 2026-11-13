import Link from "next/link";
import { LogoLockup } from "@/components/brand/Logo";
import { Icon } from "@/components/ui/Icon";
import { ROUTES } from "@/config/routes";

/**
 * <CheckoutHeader> — Cabecera mínima del paso de reserva
 * =============================================================================
 * En el último paso del embudo quitamos el menú para que la persona no se
 * vaya a otra página a mitad de la reserva. Solo queda: logo (vuelve al
 * inicio), un mensaje de confianza y "Salir".
 */
export function CheckoutHeader() {
  return (
    <header className="border-b border-line bg-white">
      <div className="mx-auto flex max-w-checkout flex-wrap items-center justify-between gap-4 px-4 sm:px-8 py-4">
        <Link href={ROUTES.home} aria-label="Clínica Aurora, inicio" className="no-underline">
          <LogoLockup size={44} textSize={15} />
        </Link>
        <div className="flex items-center gap-5 text-sm text-muted">
          <span className="inline-flex items-center gap-2">
            <Icon name="lock" className="text-leaf" />
            Datos protegidos
          </span>
          <Link href={ROUTES.home} className="font-medium no-underline">
            Salir
          </Link>
        </div>
      </div>
    </header>
  );
}
