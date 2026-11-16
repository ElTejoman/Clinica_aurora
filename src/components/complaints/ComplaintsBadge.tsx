import Link from "next/link";
import { ROUTES } from "@/config/routes";
import { OpenBook } from "./OpenBook";

/**
 * Distintivo "Libro de Reclamaciones" con el libro abierto, como el que
 * muestran las IPRESS en su web. Va en el pie de todas las páginas y lleva a
 * /libro-de-reclamaciones/.
 */
export function ComplaintsBadge() {
  return (
    <Link
      href={ROUTES.complaints}
      className="group inline-flex items-center gap-3 rounded-2xl bg-white py-2 pl-2.5 pr-4 !text-teal-deep no-underline shadow-[0_10px_24px_-14px_rgba(0,0,0,.6)] transition-transform duration-300 hover:-translate-y-0.5"
    >
      <OpenBook className="h-auto w-[52px] transition-transform duration-300 group-hover:scale-105" />
      <span className="flex flex-col font-display text-[13px] font-semibold uppercase leading-tight tracking-[.6px]">
        <span>Libro de</span>
        <span>Reclamaciones</span>
      </span>
    </Link>
  );
}
