import Image from "next/image";
import Link from "next/link";
import type { Service } from "@/models";
import { Intro } from "@/components/motion/Intro";
import { Magnetic } from "@/components/motion/Magnetic";
import { SplitLines } from "@/components/motion/SplitLines";
import { ButtonLink } from "@/components/ui/Button";
import { Icon, WhatsAppIcon } from "@/components/ui/Icon";
import { ROUTES } from "@/config/routes";
import { serviceWhatsAppUrl } from "@/services/booking.service";
import { isBookable } from "@/services/catalog.service";
import { TESTS_ANCHOR } from "./ServiceSections";

/**
 * Cabecera de un servicio.
 *   - Con banner (texto ya diseñado en la imagen): banner a todo lo ancho y,
 *     debajo, título + presentación + CTAs.
 *   - Con foto: diseño en dos columnas (texto + foto).
 * Acción secundaria: "Elegir día y hora" si el servicio tiene agenda; si no
 * (laboratorio), "Ver tarifario" baja a la lista de análisis.
 */
export function ServiceHero({ service }: { service: Service }) {
  return service.hero.banner ? <BannerHero service={service} /> : <PhotoHero service={service} />;
}

function Breadcrumb({ service }: { service: Service }) {
  return (
    <nav aria-label="Ruta" className="flex flex-wrap gap-2 text-[13px] text-muted">
      <Link href={ROUTES.home} className="no-underline">
        Inicio
      </Link>
      <span aria-hidden="true">/</span>
      <Link href={ROUTES.services} className="no-underline">
        Servicios
      </Link>
      <span aria-hidden="true">/</span>
      <span className="font-medium text-ink" aria-current="page">
        {service.name}
      </span>
    </nav>
  );
}

function ServiceActions({ service }: { service: Service }) {
  return (
    <div data-fade="" className="flex flex-wrap gap-3">
      <Magnetic>
        <a
          href={serviceWhatsAppUrl(service)}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex h-[54px] items-center gap-2.5 rounded-full bg-[#25D366] px-[26px] font-display text-base font-semibold !text-white no-underline transition hover:brightness-95"
        >
          <WhatsAppIcon size={20} />
          Agenda aquí
        </a>
      </Magnetic>
      <SecondaryAction service={service} />
    </div>
  );
}

function SecondaryAction({ service }: { service: Service }) {
  if (isBookable(service)) {
    return (
      <ButtonLink href={ROUTES.booking({ servicio: service.slug })} variant="ghost" size="lg" trackAs={{ event: "cta_click", props: { location: "service_hero", service: service.slug } }}>
        <Icon name="calendar" />
        Elegir día y hora
      </ButtonLink>
    );
  }
  if (!service.sections.some((s) => s.layout === "tests")) return null;
  return (
    <ButtonLink href={`#${TESTS_ANCHOR}`} variant="ghost" size="lg" arrow>
      Ver tarifario
    </ButtonLink>
  );
}

const BANNER_SIZE = { width: 1600, height: 800 };

function BannerHero({ service }: { service: Service }) {
  const { width, height } = service.hero.size ?? BANNER_SIZE;
  return (
    <section>
      <div className="mx-auto max-w-[1440px] px-2 pt-2 sm:px-3 sm:pt-3">
        <picture>
          {service.hero.srcMobile && <source media="(max-width: 700px)" srcSet={service.hero.srcMobile} />}
          <img
            src={service.hero.src}
            alt={service.hero.alt}
            width={width}
            height={height}
            fetchPriority="high"
            style={{ aspectRatio: `${width} / ${height}` }}
            className="w-full rounded-[20px] object-cover sm:rounded-[28px]"
          />
        </picture>
      </div>
      <Intro>
        <div className="mx-auto flex max-w-[900px] flex-col items-center gap-5 px-4 pb-6 pt-12 text-center">
          <Breadcrumb service={service} />
          <h1 className="m-0 font-display text-[clamp(32px,4.4vw,52px)] font-semibold leading-[1.1] text-ink">
            <SplitLines lines={[service.name]} />
          </h1>
          <p data-fade="" className="m-0 text-lg leading-relaxed text-muted">
            {service.intro}
          </p>
          <ServiceActions service={service} />
        </div>
      </Intro>
    </section>
  );
}

function PhotoHero({ service }: { service: Service }) {
  return (
    <section className="bg-mist">
      <Intro>
        <div className="mx-auto grid max-w-page items-center gap-10 px-4 py-14 sm:px-8 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)]">
          <div className="flex flex-col gap-5">
            <Breadcrumb service={service} />
            <span data-fade="" className="eyebrow">
              {service.tagline}
            </span>
            <h1 className="m-0 font-display text-[clamp(34px,4.6vw,56px)] font-semibold leading-[1.08] text-ink">
              <SplitLines lines={[service.name]} />
            </h1>
            <p data-fade="" className="m-0 max-w-[620px] text-lg leading-relaxed text-muted">
              {service.intro}
            </p>
            <ServiceActions service={service} />
          </div>
          <div data-fade="" className="relative aspect-[4/5] max-h-[560px] w-full overflow-hidden rounded-[28px] shadow-float lg:aspect-[4/5]">
            <Image src={service.hero.src} alt={service.hero.alt} fill priority sizes="(max-width: 1024px) 100vw, 480px" className="object-cover" />
          </div>
        </div>
      </Intro>
    </section>
  );
}
