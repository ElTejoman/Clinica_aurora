"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogoLockup } from "@/components/brand/Logo";
import { ButtonLink } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { Magnetic } from "@/components/motion/Magnetic";
import { ROUTES, SITE } from "@/lib/site";
import { track } from "@/lib/analytics";
import { cn } from "@/lib/cn";

/**
 * <Header> — Cabecera de las páginas de contenido
 * =============================================================================
 * - Logo (anillos que se dibujan al cargar).
 * - Navegación con el enlace activo subrayado (según la URL actual).
 * - Teléfono + CTA principal "Reservar cita" (magnético).
 *
 * En móvil, la navegación se reacomoda en varias líneas (flex-wrap), como en
 * el diseño. Si prefieres un menú hamburguesa, este es el único archivo a
 * tocar.
 *
 * La página de reserva NO usa este header (ver CheckoutHeader): en el último
 * paso del embudo quitamos distracciones.
 */

const NAV = [
  { href: ROUTES.painFinder, label: "Encuentra tu dolor" },
  { href: ROUTES.specialists, label: "Especialistas" },
  { href: "/#como", label: "Cómo funciona" },
  { href: "#contacto", label: "Contacto" },
];

export function Header() {
  const pathname = usePathname();

  return (
    <header className="mx-auto flex max-w-page flex-wrap items-center justify-between gap-6 px-4 sm:px-8 py-[22px]">
      <Link href={ROUTES.home} aria-label="Clínica Aurora, inicio" className="no-underline">
        <LogoLockup />
      </Link>

      <nav aria-label="Principal" className="flex flex-wrap items-center gap-8 text-[15px] font-medium">
        {NAV.map((item) => {
          const active = !item.href.includes("#") && pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active ? "page" : undefined}
              className={cn(
                "no-underline transition-colors hover:text-teal",
                active ? "border-b-2 border-teal pb-1 text-teal" : "text-ink",
              )}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="flex flex-wrap items-center gap-3">
        <a
          href={`tel:${SITE.phone}`}
          className="hidden h-[46px] items-center gap-2 rounded-full border border-line-strong px-[18px] text-sm font-medium text-ink no-underline transition-colors hover:border-teal hover:bg-tint lg:inline-flex"
        >
          <Icon name="phone" strokeWidth={1.8} />
          {SITE.phone}
        </a>
        <Magnetic>
          <ButtonLink
            href={ROUTES.booking()}
            size="sm"
            arrow
            onClick={() => track("cta_click", { location: "header" })}
          >
            Reservar cita
          </ButtonLink>
        </Magnetic>
      </div>
    </header>
  );
}
