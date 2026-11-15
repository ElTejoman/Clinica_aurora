import Image from "next/image";
import Link from "next/link";
import type { Service } from "@/models";
import { Icon, PathIcon } from "@/components/ui/Icon";
import { ROUTES } from "@/config/routes";

type ServiceCardData = Pick<Service, "slug" | "cardTitle" | "tagline" | "icon" | "card" | "highlights">;

/**
 * Tarjeta de servicio: foto con velo teal y el nombre encima (se lee de lejos),
 * debajo la frase y tres condiciones que atiende. Al pasar el cursor el velo
 * se aclara y la foto recupera color y se acerca.
 */
export function ServiceCard({ service }: { service: ServiceCardData }) {
  return (
    <Link
      data-reveal-item=""
      href={ROUTES.service(service.slug)}
      className="group flex flex-col overflow-hidden rounded-[24px] border border-line-soft bg-white !text-ink no-underline shadow-[0_1px_0_rgba(16,41,43,.04)] transition-[transform,box-shadow,border-color] duration-[450ms] ease-out hover:-translate-y-1.5 hover:border-sage-soft hover:shadow-lift"
    >
      <span className="relative block aspect-[4/3] overflow-hidden bg-teal-deep">
        <Image
          src={service.card.src}
          alt={service.card.alt}
          fill
          sizes="(max-width: 700px) 100vw, (max-width: 1100px) 50vw, 400px"
          className="object-cover saturate-[.8] transition-[transform,filter] duration-700 ease-out group-hover:scale-[1.04] group-hover:saturate-100 motion-reduce:transition-none motion-reduce:group-hover:scale-100"
        />
        <span
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-t from-teal-deep/90 via-teal-deep/35 to-teal-deep/10 transition-opacity duration-500 group-hover:opacity-70"
        />
        <span className="absolute inset-x-5 bottom-5 flex items-center gap-3 text-white">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white/95 text-teal">
            <PathIcon d={service.icon} size={22} strokeWidth={1.8} />
          </span>
          <span className="font-display text-[22px] font-semibold leading-tight [text-shadow:0_1px_12px_rgba(14,67,74,.45)]">
            {service.cardTitle}
          </span>
        </span>
      </span>
      <span className="flex flex-1 flex-col gap-4 p-6">
        <span className="text-[15px] font-semibold text-teal">{service.tagline}</span>
        <ul className="m-0 flex list-none flex-col gap-2 p-0">
          {service.highlights.map((item) => (
            <li key={item} className="flex items-start gap-2 text-[15px] leading-snug text-ink/80">
              <Icon name="check" className="mt-0.5 shrink-0 text-leaf" />
              {item}
            </li>
          ))}
        </ul>
        <span className="mt-auto inline-flex items-center gap-1.5 pt-1 text-sm font-semibold text-teal opacity-80 transition-opacity group-hover:opacity-100">
          Conocer más
          <Icon name="arrowRight" className="transition-transform duration-300 group-hover:translate-x-1" />
        </span>
      </span>
    </Link>
  );
}
