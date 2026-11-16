import Link from "next/link";
import { LogoMark } from "@/components/brand/Logo";
import { Icon, WhatsAppIcon } from "@/components/ui/Icon";
import { ROUTES } from "@/config/routes";
import { SITE } from "@/config/site";
import { whatsappUrl } from "@/utils/whatsapp";
import { OpeningHours } from "./OpeningHours";
import { SocialLinks } from "./SocialLinks";

/**
 * <Footer> — Contacto completo, horario por día, WhatsApp, redes y
 * Libro de Reclamaciones (obligatorio para IPRESS en Perú).
 * id="contacto-pie" permite enlazarlo desde cualquier página.
 */
export function Footer({ services }: { services: { slug: string; name: string }[] }) {
  return (
    <footer id="contacto-pie" className="bg-teal-deep text-night-muted">
      <div className="mx-auto grid max-w-page grid-cols-[repeat(auto-fit,minmax(min(230px,100%),1fr))] gap-10 px-4 pb-12 pt-16 sm:px-8">
        <div className="flex flex-col items-start gap-5">
          <LogoMark size={110} tone="dark" />
          <p className="m-0 max-w-[260px] text-sm leading-relaxed">{SITE.description}</p>
          <SocialLinks className="-ml-2 text-night-ice" />
        </div>

        <div className="flex flex-col gap-3 text-sm">
          <h2 className="m-0 font-display text-base font-semibold text-night-ice">Contáctanos</h2>
          {SITE.phones.map((phone) => (
            <a key={phone} href={`tel:${phone.replace(/\s/g, "")}`} className="inline-flex items-center gap-2 !text-night-muted no-underline hover:!text-white">
              <Icon name="phone" size={15} />
              {phone}
            </a>
          ))}
          <a href={`mailto:${SITE.email}`} className="inline-flex items-center gap-2 break-all !text-night-muted no-underline hover:!text-white">
            <Icon name="mail" size={15} />
            {SITE.email}
          </a>
          <span className="inline-flex items-start gap-2">
            <Icon name="mapPin" size={15} className="mt-0.5 flex-none" />
            {SITE.address}
          </span>
          <a
            href={whatsappUrl(SITE.whatsapp.general, `Hola, quisiera información sobre ${SITE.name}.`)}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 inline-flex h-11 items-center gap-2 self-start rounded-full bg-[#25D366] px-5 font-display text-sm font-semibold !text-white no-underline hover:brightness-95"
          >
            <WhatsAppIcon size={18} />
            Escríbenos al WhatsApp
          </a>
        </div>

        <div className="flex flex-col gap-3 text-sm">
          <h2 className="m-0 font-display text-base font-semibold text-night-ice">Horario de atención</h2>
          <OpeningHours className="text-night-muted [&_dt]:text-night-ice" />
        </div>

        <nav aria-label="Pie de página" className="flex flex-col gap-2.5 text-sm">
          <h2 className="m-0 mb-1 font-display text-base font-semibold text-night-ice">Servicios</h2>
          {services.map((s) => (
            <Link key={s.slug} href={ROUTES.service(s.slug)} className="!text-night-muted no-underline hover:!text-white">
              {s.name}
            </Link>
          ))}
          <Link href={ROUTES.staff()} className="mt-2 !text-night-muted no-underline hover:!text-white">
            Staff de profesionales
          </Link>
          <Link href={ROUTES.blog} className="!text-night-muted no-underline hover:!text-white">
            Blog educativo
          </Link>
        </nav>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-page flex-wrap items-center justify-between gap-4 px-4 py-5 text-[13px] sm:px-8">
          <span>
            © {new Date().getFullYear()} {SITE.name}. En caso de emergencia, acude al servicio de urgencias más cercano.
          </span>
          <Link
            href={ROUTES.complaints}
            className="inline-flex items-center gap-2 rounded-full border border-white/25 px-4 py-2 font-semibold !text-night-ice no-underline hover:bg-white/10"
          >
            <Icon name="book" size={18} />
            Libro de Reclamaciones
          </Link>
        </div>
      </div>
    </footer>
  );
}
