"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { LogoLockup } from "@/components/brand/Logo";
import { Magnetic } from "@/components/motion/Magnetic";
import { ButtonLink } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { ROUTES, isCurrentSection } from "@/config/routes";
import { SITE } from "@/config/site";
import { cn } from "@/utils/cn";
import { SocialLinks } from "./SocialLinks";

/**
 * <Header> — Barra superior (redes + teléfonos) y navegación principal fija.
 * Menú: Inicio · Staff de Profesionales · Servicios (desplegable) · Blog · Contacto.
 * En móvil, la navegación se abre en un panel con el botón ☰.
 */

export interface NavService {
  slug: string;
  name: string;
}

export function Header({ services }: { services: NavService[] }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  useEffect(() => setOpen(false), [pathname]);

  const nav = [
    { href: ROUTES.home, label: "Inicio" },
    { href: ROUTES.staff(), label: "Staff de Profesionales" },
    { href: ROUTES.services, label: "Servicios", children: services },
    { href: ROUTES.blog, label: "Blog" },
    { href: ROUTES.contact(), label: "Contacto" },
  ];

  return (
    <>
      <TopBar />
      <header className="sticky top-0 z-40 border-b border-line bg-white/95 backdrop-blur">
        <div className="mx-auto flex h-[76px] max-w-page items-center justify-between gap-6 px-4 sm:px-8">
          <Link href={ROUTES.home} aria-label={`${SITE.name}, inicio`} className="no-underline">
            <LogoLockup size={50} textSize={16} />
          </Link>

          <nav aria-label="Principal" className="hidden items-center gap-1 lg:flex">
            {nav.map((item) =>
              item.children ? (
                <ServicesMenu key={item.href} label={item.label} href={item.href} services={item.children} active={isCurrentSection(pathname, item.href)} />
              ) : (
                <NavLink key={item.href} href={item.href} active={isCurrentSection(pathname, item.href)}>
                  {item.label}
                </NavLink>
              ),
            )}
          </nav>

          <div className="flex items-center gap-2">
            <Magnetic className="hidden sm:block">
              <ButtonLink href={ROUTES.booking()} size="sm" trackAs={{ event: "cta_click", props: { location: "header" } }}>
                <Icon name="calendar" />
                Agendar cita
              </ButtonLink>
            </Magnetic>
            <button
              type="button"
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-line text-ink lg:hidden"
              aria-expanded={open}
              aria-controls="mobile-nav"
              aria-label={open ? "Cerrar menú" : "Abrir menú"}
              onClick={() => setOpen((v) => !v)}
            >
              <Icon name={open ? "close" : "menu"} size={20} />
            </button>
          </div>
        </div>

        {open && <MobileNav items={nav} pathname={pathname} />}
      </header>
    </>
  );
}

function TopBar() {
  return (
    <div className="hidden bg-teal-deep text-[13px] text-night-ice md:block">
      <div className="mx-auto flex h-10 max-w-page items-center justify-between gap-6 px-4 sm:px-8">
        <span className="inline-flex items-center gap-2">
          <Icon name="mapPin" size={14} />
          {SITE.address}
        </span>
        <div className="flex items-center gap-5">
          {SITE.phones.map((phone) => (
            <a key={phone} href={`tel:${phone.replace(/\s/g, "")}`} className="inline-flex items-center gap-1.5 !text-night-ice no-underline hover:underline">
              <Icon name="phone" size={13} />
              {phone}
            </a>
          ))}
          <SocialLinks size={15} className="-mr-2" />
        </div>
      </div>
    </div>
  );
}

const linkBase =
  "whitespace-nowrap rounded-full px-2.5 py-2 text-[13px] font-semibold uppercase tracking-[.3px] no-underline transition-colors font-display xl:px-4 xl:text-[14px] xl:tracking-[.4px]";

function NavLink({ href, active, children }: { href: string; active: boolean; children: React.ReactNode }) {
  return (
    <Link href={href} aria-current={active ? "page" : undefined} className={cn(linkBase, active ? "bg-mist !text-teal" : "!text-ink hover:bg-mist")}>
      {children}
    </Link>
  );
}

/** "Servicios" con desplegable (se abre al pasar el mouse o con el teclado). */
function ServicesMenu({ label, href, services, active }: { label: string; href: string; services: NavService[]; active: boolean }) {
  return (
    <div className="group relative">
      <Link href={href} aria-current={active ? "page" : undefined} aria-haspopup="true" className={cn(linkBase, "inline-flex items-center gap-1", active ? "bg-mist !text-teal" : "!text-ink hover:bg-mist")}>
        {label}
        <Icon name="chevronDown" size={14} className="transition-transform group-hover:rotate-180 group-focus-within:rotate-180" />
      </Link>
      <div className="invisible absolute left-1/2 top-full z-50 -translate-x-1/2 pt-3 opacity-0 transition-all duration-200 group-focus-within:visible group-focus-within:opacity-100 group-hover:visible group-hover:opacity-100">
        <ul className="m-0 w-64 list-none rounded-2xl border border-line bg-white p-2 shadow-float">
          {services.map((s) => (
            <li key={s.slug}>
              <Link href={ROUTES.service(s.slug)} className="block rounded-xl px-4 py-2.5 text-[15px] font-medium !text-ink no-underline hover:bg-mist hover:!text-teal">
                {s.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function MobileNav({ items, pathname }: { items: { href: string; label: string; children?: NavService[] }[]; pathname: string }) {
  return (
    <nav id="mobile-nav" aria-label="Principal" className="border-t border-line bg-white px-4 pb-6 pt-2 lg:hidden">
      <ul className="m-0 flex list-none flex-col p-0">
        {items.map((item) => (
          <li key={item.href} className="border-b border-line-soft">
            <Link href={item.href} aria-current={isCurrentSection(pathname, item.href) ? "page" : undefined} className="block py-3.5 font-display text-[15px] font-semibold uppercase tracking-[.4px] !text-ink no-underline">
              {item.label}
            </Link>
            {item.children && (
              <ul className="m-0 grid list-none grid-cols-2 gap-1 p-0 pb-3">
                {item.children.map((s) => (
                  <li key={s.slug}>
                    <Link href={ROUTES.service(s.slug)} className="block rounded-lg bg-mist px-3 py-2.5 text-sm !text-ink no-underline">
                      {s.name}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
      <ButtonLink href={ROUTES.booking()} className="mt-5 w-full">
        <Icon name="calendar" />
        Agendar cita
      </ButtonLink>
    </nav>
  );
}
