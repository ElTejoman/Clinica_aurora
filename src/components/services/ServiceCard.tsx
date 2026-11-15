import Image from "next/image";
import Link from "next/link";
import type { Service } from "@/models";
import { ButtonLink } from "@/components/ui/Button";
import { Icon, PathIcon } from "@/components/ui/Icon";
import { ROUTES } from "@/config/routes";

type ServiceCardData = Pick<Service, "slug" | "cardTitle" | "tagline" | "icon" | "card" | "highlights">;

/**
 * Tarjeta de servicio: foto con velo teal y el nombre encima (se lee de lejos),
 * debajo la frase y tres condiciones que atiende. Al pasar el cursor el velo
 * se aclara y la foto recupera color y se acerca.
 *
 * Dos acciones: "Conocer más" se estira sobre toda la tarjeta (clic en
 * cualquier parte → página del servicio) y "Agendar" queda por encima y abre
 * la reserva con el servicio ya elegido.
 */
export function ServiceCard({ service }: { service: ServiceCardData }) {
  return (
    <article
      data-reveal-item=""
      data-service-card={service.slug}
      className="group relative flex flex-col overflow-hidden rounded-[24px] border border-line-soft bg-white text-ink shadow-[0_1px_0_rgba(16,41,43,.04)] transition-[transform,box-shadow,border-color] duration-[450ms] ease-out hover:-translate-y-1.5 hover:border-sage-soft hover:shadow-lift has-[.card-link:focus-visible]:ring-2 has-[.card-link:focus-visible]:ring-teal has-[.card-link:focus-visible]:ring-offset-2"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-teal-deep">
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
        <div className="absolute inset-x-5 bottom-5 flex items-center gap-3 text-white">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white/95 text-teal">
            <PathIcon d={service.icon} size={22} strokeWidth={1.8} />
          </span>
          <h3 className="m-0 font-display text-[22px] font-semibold leading-tight [text-shadow:0_1px_12px_rgba(14,67,74,.45)]">
            {service.cardTitle}
          </h3>
        </div>
      </div>
      <div className="flex flex-1 flex-col gap-4 p-6">
        <p className="m-0 text-[15px] font-semibold text-teal">{service.tagline}</p>
        <ul className="m-0 flex list-none flex-col gap-2 p-0">
          {service.highlights.map((item) => (
            <li key={item} className="flex items-start gap-2 text-[15px] leading-snug text-ink/80">
              <Icon name="check" className="mt-0.5 shrink-0 text-leaf" />
              {item}
            </li>
          ))}
        </ul>
        <div className="mt-auto flex items-center justify-between gap-3 pt-1">
          <Link
            href={ROUTES.service(service.slug)}
            className="card-link inline-flex items-center gap-1.5 text-sm font-semibold text-teal no-underline opacity-80 transition-opacity after:absolute after:inset-0 after:content-[''] focus-visible:outline-none group-hover:opacity-100"
          >
            Conocer más<span className="sr-only"> sobre {service.cardTitle}</span>
            <Icon name="arrowRight" className="transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
          <ButtonLink
            href={ROUTES.booking({ servicio: service.slug })}
            size="sm"
            className="relative z-10 h-11 px-4"
            trackAs={{ event: "cta_click", props: { location: "service_card", service: service.slug } }}
          >
            <Icon name="calendar" />
            Agendar<span className="sr-only"> {service.cardTitle}</span>
          </ButtonLink>
        </div>
      </div>
    </article>
  );
}
