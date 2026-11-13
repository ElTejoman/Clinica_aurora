"use client";

import Link from "next/link";
import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { cn } from "@/utils/cn";
import { Icon } from "./Icon";
import { track, type FunnelEvent } from "@/lib/analytics";

/**
 * Botones y enlaces-botón
 * =============================================================================
 * Regla de embudo: UNA acción principal por bloque (variant="primary") y,
 * como mucho, una secundaria (variant="ghost"). No pongas tres botones que
 * compitan.
 *
 * Variantes:
 *   primary  teal sólido, texto blanco             → "Reservar…"
 *   ghost    borde gris, fondo transparente        → "Ver perfil"
 *   light    claro sobre fondo oscuro (night)      → CTA en secciones oscuras
 *   outline  borde claro sobre fondo oscuro        → secundaria en oscuro
 *
 * Tamaños (altura ≥ 44px = objetivo táctil accesible):
 *   sm 46px · md 50px · lg 54px
 *
 * Forma: "pill" (redondo) o "soft" (radio 14px, dentro de tarjetas).
 *
 * <ButtonLink> navega (next/link); <Button> ejecuta una acción (onClick/submit).
 *
 * 📈 Medición: pasa `trackAs={{ event: "cta_click", props: { location: "hero" } }}`
 *    y el clic se envía a analítica (src/lib/analytics.ts). Es un objeto simple,
 *    así que funciona incluso desde componentes de servidor.
 *    (Por eso este archivo es "use client".)
 */

type Variant = "primary" | "ghost" | "light" | "outline";
type Size = "sm" | "md" | "lg";
type Shape = "pill" | "soft";

const base =
  "inline-flex items-center justify-center gap-2.5 whitespace-nowrap font-semibold no-underline transition-[background,box-shadow,border-color,opacity] duration-300 disabled:cursor-not-allowed disabled:opacity-40";

const variants: Record<Variant, string> = {
  primary: "bg-teal !text-white hover:bg-teal-dark hover:shadow-cta",
  ghost: "border border-line-strong bg-transparent font-medium !text-ink hover:border-teal hover:bg-tint",
  light: "bg-night-ice !text-night hover:bg-white",
  outline: "border border-night-ice/35 font-medium !text-night-ice hover:bg-night-ice/10",
};

const sizes: Record<Size, string> = {
  sm: "h-[46px] px-[22px] text-sm",
  md: "h-[50px] px-[22px] text-[15px]",
  lg: "h-[54px] px-[26px] text-base",
};

const shapes: Record<Shape, string> = { pill: "rounded-full", soft: "rounded-[14px]" };

interface StyleProps {
  variant?: Variant;
  size?: Size;
  shape?: Shape;
  /** Añade la flecha → al final. */
  arrow?: boolean;
  /** Evento de analítica a enviar al hacer clic. */
  trackAs?: { event: FunnelEvent; props?: Record<string, string> };
  children: ReactNode;
}

export function buttonClasses({ variant = "primary", size = "md", shape = "pill" }: Partial<StyleProps> = {}) {
  return cn(base, variants[variant], sizes[size], shapes[shape]);
}

export function ButtonLink({
  variant,
  size,
  shape,
  arrow,
  trackAs,
  children,
  className,
  onClick,
  ...rest
}: StyleProps & Omit<ComponentPropsWithoutRef<typeof Link>, "children">) {
  return (
    <Link
      className={cn(buttonClasses({ variant, size, shape }), className)}
      onClick={(e) => {
        if (trackAs) track(trackAs.event, trackAs.props);
        onClick?.(e);
      }}
      {...rest}
    >
      {children}
      {arrow && <Icon name="arrowRight" />}
    </Link>
  );
}

export function Button({
  variant,
  size,
  shape,
  arrow,
  trackAs,
  children,
  className,
  type = "button",
  onClick,
  ...rest
}: StyleProps & ComponentPropsWithoutRef<"button">) {
  return (
    <button
      type={type}
      className={cn(buttonClasses({ variant, size, shape }), className)}
      onClick={(e) => {
        if (trackAs) track(trackAs.event, trackAs.props);
        onClick?.(e);
      }}
      {...rest}
    >
      {children}
      {arrow && <Icon name="arrowRight" />}
    </button>
  );
}
