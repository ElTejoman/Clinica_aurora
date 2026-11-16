import Link from "next/link";
import type { ReactNode } from "react";
import { LogoMark } from "@/components/brand/Logo";
import { ComplaintsBadge } from "@/components/complaints/ComplaintsBadge";
import { Icon, WhatsAppIcon } from "@/components/ui/Icon";
import { ROUTES } from "@/config/routes";
import { SITE } from "@/config/site";
import { formatPeruPhone, whatsappUrl } from "@/utils/whatsapp";
import { HoursSummary } from "./HoursSummary";
import { SocialLinks } from "./SocialLinks";

type ServiceLink = { slug: string; name: string };

const LINK = "inline-flex min-h-7 items-center gap-2 py-0.5 !text-night-muted no-underline hover:!text-white";
const HEADING = "m-0 mb-1 font-display text-base font-semibold text-night-ice";

const PHONES = [
  { label: "Consultas", number: SITE.whatsapp.general },
  { label: "Citas", number: SITE.whatsapp.booking },
] as const;

const CLINIC_LINKS = [
  { href: ROUTES.staff(), label: "Staff de profesionales" },
  { href: ROUTES.blog, label: "Blog educativo" },
  { href: ROUTES.contact(), label: "Contacto y sede" },
] as const;

const MAPS_URL = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(SITE.address)}`;

/**
 * <Footer> — Marca y Libro de Reclamaciones (obligatorio para IPRESS en Perú),
 * contacto, horario resumido y enlaces. id="contacto-pie" permite enlazarlo.
 * El anillo de foco se aclara: el teal del sitio no se ve sobre este fondo.
 */
export function Footer({ services }: { services: ServiceLink[] }) {
  return (
    <footer id="contacto-pie" className="bg-teal-deep text-sm text-night-muted [&_:focus-visible]:outline-night-ice">
      <div className="mx-auto grid max-w-page gap-x-10 gap-y-10 px-4 pb-10 pt-14 sm:grid-cols-2 sm:px-8 lg:grid-cols-[1.1fr_1fr_0.9fr_1.2fr]">
        <FooterBrand />
        <FooterContact />
        <FooterHours />
        <FooterNav services={services} />
      </div>
      <FooterBottom />
    </footer>
  );
}

function FooterBrand() {
  return (
    <div className="flex flex-col items-start gap-5">
      <div className="flex items-center gap-4 lg:flex-col lg:items-start">
        <LogoMark size={88} tone="dark" />
        <p className="m-0 max-w-[250px] leading-relaxed">
          {SITE.tagline}. Atención en {new Intl.ListFormat("es").format(SITE.languages)}.
        </p>
      </div>
      <div className="flex flex-wrap items-center gap-x-6 gap-y-5 lg:flex-col lg:items-start">
        <SocialLinks className="-ml-2 text-night-ice" />
        <ComplaintsBadge />
      </div>
    </div>
  );
}

function FooterContact() {
  return (
    <div className="flex flex-col gap-1.5">
      <h2 className={HEADING}>Contáctanos</h2>
      {PHONES.map(({ label, number }) => (
        <a key={number} href={`tel:+${number}`} className={LINK}>
          <Icon name="phone" size={15} className="flex-none" />
          <span>
            {formatPeruPhone(number)} <span className="text-xs text-night-soft">· {label}</span>
          </span>
        </a>
      ))}
      <a href={`mailto:${SITE.email}`} className={`${LINK} break-all`}>
        <Icon name="mail" size={15} className="flex-none" />
        {SITE.email}
      </a>
      <a href={MAPS_URL} target="_blank" rel="noopener noreferrer" className={`${LINK} items-start`}>
        <Icon name="mapPin" size={15} className="mt-0.5 flex-none" />
        <span>
          {SITE.address}
          <span className="sr-only"> (cómo llegar, abre Google Maps)</span>
        </span>
      </a>
      <a
        href={whatsappUrl(SITE.whatsapp.general, `Hola, quisiera información sobre ${SITE.name}.`)}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-3 inline-flex h-11 items-center gap-2 self-start rounded-full bg-[#25D366] px-5 font-display font-semibold !text-white no-underline hover:brightness-95"
      >
        <WhatsAppIcon size={18} />
        Escríbenos al WhatsApp
      </a>
    </div>
  );
}

function FooterHours() {
  return (
    <div className="flex flex-col gap-3">
      <h2 className={HEADING}>Horario de atención</h2>
      <HoursSummary />
      <p className="m-0 max-w-[240px] text-[13px] leading-relaxed text-night-soft">
        Cada profesional atiende en días y horas distintos.
      </p>
      <Link href={ROUTES.staff()} className={`${LINK} self-start font-semibold !text-night-ice hover:!text-white`}>
        Ver horarios del staff
        <Icon name="arrowRight" size={15} className="flex-none" />
      </Link>
    </div>
  );
}

function FooterNav({ services }: { services: ServiceLink[] }) {
  return (
    <nav aria-label="Pie de página" className="flex flex-col gap-8">
      <LinkGroup title="Servicios">
        {services.map((s) => (
          <li key={s.slug}>
            <Link href={ROUTES.service(s.slug)} className={LINK}>{s.name}</Link>
          </li>
        ))}
      </LinkGroup>
      <LinkGroup title="La clínica">
        {CLINIC_LINKS.map((l) => (
          <li key={l.href}>
            <Link href={l.href} className={LINK}>{l.label}</Link>
          </li>
        ))}
      </LinkGroup>
    </nav>
  );
}

function LinkGroup({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div>
      <h2 className={HEADING}>{title}</h2>
      <ul className="m-0 mt-2 grid list-none grid-cols-2 gap-x-6 p-0 lg:grid-cols-1">{children}</ul>
    </div>
  );
}

function FooterBottom() {
  return (
    <div className="border-t border-white/10">
      <div className="mx-auto flex max-w-page flex-col gap-2 px-4 py-5 pr-24 text-[13px] sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-6 sm:px-8 sm:pr-24">
        <span>© {new Date().getFullYear()} {SITE.name}</span>
        <span className="inline-flex items-start gap-2">
          <Icon name="alert" size={15} className="mt-0.5 flex-none text-night-ice" />
          En caso de emergencia, acude al servicio de urgencias más cercano.
        </span>
      </div>
    </div>
  );
}
