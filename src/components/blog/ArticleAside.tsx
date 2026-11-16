import Image from "next/image";
import Link from "next/link";
import type { Doctor, Service } from "@/models";
import { ButtonLink } from "@/components/ui/Button";
import { Icon, PathIcon, WhatsAppIcon } from "@/components/ui/Icon";
import { ROUTES } from "@/config/routes";
import { serviceWhatsAppUrl } from "@/services/booking.service";

type AsideService = Pick<Service, "slug" | "name" | "tagline" | "icon">;
type AsideDoctor = Pick<Doctor, "slug" | "name" | "specialty" | "photo">;

/**
 * Panel lateral del artículo (fijo al hacer scroll en escritorio; al final en
 * móvil): el tratamiento del que trata, quién lo realiza y cómo agendarlo.
 */
export function ArticleAside({ service, doctors }: { service: AsideService; doctors: AsideDoctor[] }) {
  return (
    <aside aria-label="Agenda este tratamiento" className="lg:sticky lg:top-[100px]">
      <div className="flex flex-col gap-6 rounded-[24px] border border-line-soft bg-white p-6 shadow-soft">
        <div className="flex flex-col gap-3">
          <span className="eyebrow">Tratamiento relacionado</span>
          <Link href={ROUTES.service(service.slug)} className="group flex items-center gap-3 no-underline">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-teal text-white">
              <PathIcon d={service.icon} size={24} strokeWidth={1.8} />
            </span>
            <span className="flex flex-col">
              <span className="font-display text-[20px] font-semibold leading-tight text-ink group-hover:text-teal">{service.name}</span>
              <span className="text-sm text-muted">{service.tagline}</span>
            </span>
          </Link>
        </div>

        {doctors.length > 0 && (
          <div className="flex flex-col gap-3 border-t border-line-soft pt-5">
            <span className="text-[13px] font-semibold uppercase tracking-[.6px] text-subink">Te atiende</span>
            <ul className="m-0 flex list-none flex-col gap-2 p-0">
              {doctors.map((d) => (
                <li key={d.slug}>
                  <Link href={ROUTES.doctor(d.slug)} className="-mx-2 flex items-center gap-3 rounded-xl px-2 py-1.5 no-underline hover:bg-mist">
                    <span className="relative h-11 w-11 shrink-0 overflow-hidden rounded-full bg-mist">
                      {d.photo && <Image src={d.photo} alt="" fill sizes="88px" className="origin-[50%_10%] scale-[1.6] object-cover object-top" />}
                    </span>
                    <span className="flex flex-col">
                      <span className="text-[15px] font-semibold text-ink">{d.name}</span>
                      <span className="text-[13px] text-muted">{d.specialty}</span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="flex flex-col gap-2.5 border-t border-line-soft pt-5">
          <ButtonLink href={ROUTES.booking({ servicio: service.slug })} className="w-full" trackAs={{ event: "cta_click", props: { location: "blog_article", service: service.slug } }}>
            <Icon name="calendar" />
            Agendar {service.name.toLowerCase()}
          </ButtonLink>
          <a
            href={serviceWhatsAppUrl(service)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-[50px] w-full items-center justify-center gap-2.5 rounded-full bg-[#25D366] font-display text-[15px] font-semibold !text-white no-underline transition hover:brightness-95"
          >
            <WhatsAppIcon size={19} />
            Agenda por WhatsApp
          </a>
          <Link href={ROUTES.service(service.slug)} className="mt-1 inline-flex items-center justify-center gap-1.5 text-sm font-semibold text-teal no-underline hover:underline">
            Conocer el tratamiento
            <Icon name="arrowRight" size={14} />
          </Link>
        </div>
      </div>
    </aside>
  );
}
