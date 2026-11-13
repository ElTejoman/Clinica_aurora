import type { ReactNode } from "react";
import { cn } from "@/utils/cn";

/**
 * Encabezado de sección: etiqueta pequeña ("NUESTROS MÉDICOS") + título serif.
 * Para resaltar una parte del título en cursiva teal, usa <Accent>.
 *
 *   <SectionHeading eyebrow="Nuestros médicos">
 *     Primero, las personas. <Accent>quien te va a atender.</Accent>
 *   </SectionHeading>
 */
export function SectionHeading({
  eyebrow,
  children,
  className,
  as: Tag = "h2",
}: {
  eyebrow?: string;
  children: ReactNode;
  className?: string;
  as?: "h1" | "h2";
}) {
  return (
    <div className={cn("flex max-w-[720px] flex-col gap-3.5", className)}>
      {eyebrow && <span className="eyebrow">{eyebrow}</span>}
      <Tag className="m-0 font-serif text-[clamp(38px,4.4vw,60px)] font-normal leading-[1.04] tracking-[-1px]">
        {children}
      </Tag>
    </div>
  );
}

/** Fragmento del título en cursiva y color de marca. */
export function Accent({ children, tone = "teal" }: { children: ReactNode; tone?: "teal" | "mint" }) {
  return <em className={cn("italic", tone === "teal" ? "text-teal" : "text-leaf-mint")}>{children}</em>;
}

/** Punto verde que late ("Disponible hoy"). */
export function LiveDot() {
  return <span className="h-2 w-2 animate-pulse-dot rounded-full bg-leaf" aria-hidden="true" />;
}
