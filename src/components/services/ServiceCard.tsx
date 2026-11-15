import Link from "next/link";
import type { Service } from "@/models";
import { Icon, PathIcon } from "@/components/ui/Icon";
import { ROUTES } from "@/config/routes";

/** Tarjeta de servicio: icono + título + frase (grilla "Nuestros servicios"). */
export function ServiceCard({ service }: { service: Pick<Service, "slug" | "cardTitle" | "tagline" | "icon"> }) {
  return (
    <Link
      data-reveal-item=""
      href={ROUTES.service(service.slug)}
      className="group flex flex-col items-center gap-4 rounded-[24px] border border-line-soft bg-white px-6 py-9 text-center !text-ink no-underline shadow-[0_1px_0_rgba(16,41,43,.04)] transition-[transform,box-shadow,border-color] duration-[450ms] ease-out hover:-translate-y-1.5 hover:border-sage-soft hover:shadow-lift"
    >
      <span className="flex h-[72px] w-[72px] items-center justify-center rounded-full bg-sage-soft text-teal transition-colors duration-300 group-hover:bg-teal group-hover:text-white">
        <PathIcon d={service.icon} size={32} strokeWidth={1.7} />
      </span>
      <span className="flex flex-col gap-1">
        <span className="font-display text-xl font-semibold">{service.cardTitle}</span>
        <span className="text-[15px] text-muted">{service.tagline}</span>
      </span>
      <span className="mt-1 inline-flex items-center gap-1.5 text-sm font-semibold text-teal opacity-80 transition-opacity group-hover:opacity-100">
        Conocer más
        <Icon name="arrowRight" className="transition-transform duration-300 group-hover:translate-x-1" />
      </span>
    </Link>
  );
}
