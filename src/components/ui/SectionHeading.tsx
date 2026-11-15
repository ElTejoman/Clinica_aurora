import type { ReactNode } from "react";
import { cn } from "@/utils/cn";

/**
 * Encabezado de sección: etiqueta pequeña opcional + título (Poppins).
 * Centrado por defecto, como en el sitio de referencia.
 * Para resaltar una parte del título en color de marca, usa <Accent>.
 */
export function SectionHeading({
  eyebrow,
  children,
  intro,
  className,
  align = "center",
  as: Tag = "h2",
}: {
  eyebrow?: string;
  children: ReactNode;
  intro?: ReactNode;
  className?: string;
  align?: "center" | "left";
  as?: "h1" | "h2";
}) {
  const centered = align === "center";
  return (
    <div className={cn("flex flex-col gap-3", centered ? "mx-auto max-w-[760px] items-center text-center" : "max-w-[760px]", className)}>
      {eyebrow && <span className="eyebrow">{eyebrow}</span>}
      <Tag className="m-0 font-display text-[clamp(28px,3.4vw,42px)] font-semibold leading-[1.15] tracking-[-0.5px] text-ink">
        {children}
      </Tag>
      {intro && <p className="m-0 max-w-[640px] text-[17px] leading-relaxed text-muted">{intro}</p>}
    </div>
  );
}

/** Punto verde que late ("Disponible hoy"). */
export function LiveDot() {
  return <span className="h-2 w-2 animate-pulse-dot rounded-full bg-leaf" aria-hidden="true" />;
}
