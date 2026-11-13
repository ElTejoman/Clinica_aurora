import type { SVGProps } from "react";

/**
 * <Icon> — Iconos de trazo (viewBox 24×24)
 * =============================================================================
 * Juego mínimo de iconos dibujados a mano para no cargar una librería entera.
 * Si prefieres una librería, `lucide-react` usa el mismo estilo de trazo y
 * puedes reemplazar este componente sin tocar los demás.
 *
 * Son decorativos por defecto (`aria-hidden`). Si un botón SOLO tiene icono,
 * ponle `aria-label` al botón, no al icono.
 *
 * Para los iconos de molestias se usa `<PathIcon d="…">` con el path de
 * src/data/pains.ts.
 */

const PATHS = {
  arrowRight: "M5 12h14M13 6l6 6-6 6",
  arrowLeft: "M19 12H5M11 18l-6-6 6-6",
  check: "M20 6L9 17l-5-5",
  search: "M11 4a7 7 0 1 0 0 14 7 7 0 0 0 0-14zM20 20l-3.5-3.5",
  clock: "M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM12 7v5l3 2",
  phone:
    "M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.7a2 2 0 0 1-.5 2.1L8 9.8a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.7.7a2 2 0 0 1 1.7 2z",
  alert: "M12 9v4M12 17h.01M10.3 3.9L1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z",
  lock: "M6 10h12a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2zM8 10V7a4 4 0 0 1 8 0v3",
  calendar: "M5 5h14a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2zM16 3v4M8 3v4M3 11h18",
} as const;

export type IconName = keyof typeof PATHS;

type Props = Omit<SVGProps<SVGSVGElement>, "name"> & { name: IconName; size?: number; strokeWidth?: number };

export function Icon({ name, size = 16, strokeWidth = 2, ...rest }: Props) {
  return <PathIcon d={PATHS[name]} size={size} strokeWidth={strokeWidth} {...rest} />;
}

export function PathIcon({
  d,
  size = 24,
  strokeWidth = 1.6,
  ...rest
}: SVGProps<SVGSVGElement> & { d: string; size?: number; strokeWidth?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...rest}
    >
      <path d={d} />
    </svg>
  );
}

/** Triángulo de "reproducir" relleno (botones de video). */
export function PlayIcon({ size = 30, className }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
      <path d="M7 4.5v15a1 1 0 0 0 1.5.9l12-7.5a1 1 0 0 0 0-1.7l-12-7.5A1 1 0 0 0 7 4.5z" />
    </svg>
  );
}

/** Comillas de testimonio. */
export function QuoteMark() {
  return (
    <svg width="34" height="26" viewBox="0 0 34 26" aria-hidden="true" className="fill-leaf-foam">
      <path d="M0 26V15C0 6 5 1 13 0l1 4c-5 1-7 4-7 9h6v13H0zm20 0V15c0-9 5-14 13-15l1 4c-5 1-7 4-7 9h6v13H20z" />
    </svg>
  );
}
