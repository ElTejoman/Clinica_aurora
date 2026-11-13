import Link from "next/link";
import { ROUTES } from "@/config/routes";
import { SITE } from "@/config/site";

/**
 * <Footer> — Pie de página con datos de contacto
 * =============================================================================
 * Tiene id="contacto" para que el enlace "Contacto" del menú salte aquí
 * desde cualquier página. Los datos salen de src/config/site.ts.
 * Incluye el aviso de urgencias (importante en sitios de salud).
 */
export function Footer() {
  return (
    <footer id="contacto" className="border-t border-line bg-white">
      <div className="mx-auto grid max-w-page grid-cols-[repeat(auto-fit,minmax(min(220px,100%),1fr))] gap-10 px-4 sm:px-8 pb-10 pt-16">
        <div className="flex flex-col gap-4">
          <span className="font-brand text-lg font-semibold tracking-[3px] text-teal">CLÍNICA AURORA</span>
          <p className="m-0 max-w-[260px] text-sm leading-relaxed text-muted">{SITE.tagline}</p>
        </div>

        <address className="flex flex-col gap-2.5 text-sm not-italic">
          <span className="font-semibold">Visítanos</span>
          <span className="text-muted">
            {SITE.address}, {SITE.city}
          </span>
          <span className="text-muted">{SITE.hours}</span>
        </address>

        <div className="flex flex-col gap-2.5 text-sm">
          <span className="font-semibold">Contacto</span>
          <a href={`tel:${SITE.phone}`} className="no-underline">
            {SITE.phone}
          </a>
          <a href={`mailto:${SITE.email}`} className="no-underline">
            {SITE.email}
          </a>
        </div>

        <nav aria-label="Pie de página" className="flex flex-col gap-2.5 text-sm">
          <span className="font-semibold">Explora</span>
          <Link href={ROUTES.painFinder()} className="no-underline">
            Encuentra tu dolor
          </Link>
          <Link href={ROUTES.specialists()} className="no-underline">
            Especialistas
          </Link>
          <Link href={ROUTES.booking()} className="no-underline">
            Reservar cita
          </Link>
        </nav>
      </div>

      <div className="mx-auto flex max-w-page flex-wrap justify-between gap-3 border-t border-[#E6ECE9] px-4 sm:px-8 pb-8 pt-5 text-[13px] text-muted">
        <span>
          © {new Date().getFullYear()} {SITE.name}
        </span>
        <span>En caso de emergencia, acude al servicio de urgencias más cercano.</span>
      </div>
    </footer>
  );
}
