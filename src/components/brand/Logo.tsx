"use client";

import anime from "animejs";
import Image from "next/image";
import { useEffect, useId, useRef } from "react";
import { SITE } from "@/config/site";
import { motionAllowed } from "@/lib/motion";
import { cn } from "@/utils/cn";

/**
 * <LogoMark> — Sello circular de Clínica La Aurora
 * =============================================================================
 * Recrea el logo original con el nombre nuevo:
 *   - Anillo exterior e interior (SVG, verde).
 *   - "CLÍNICA" arriba y "LA AURORA" abajo siguiendo el arco (textPath, Cinzel).
 *   - El árbol original al centro (/public/brand/aurora-tree.png, recortado
 *     del logo que enviaste, con fondo transparente).
 *
 * Cuando tengas el logo final en vectores (SVG), reemplaza este componente por
 * <Image src="/brand/logo.svg" … /> manteniendo las props.
 *
 * Props:
 *   size     tamaño en px
 *   tone     "light" (sobre fondo claro) | "dark" (sobre fondo oscuro)
 *   animate  dibuja los anillos con anime.js al montar o al entrar en pantalla
 *   breathe  el árbol "respira" (CTA final)
 *
 * Geometría (viewBox 334×334, centro 167,167) medida sobre el logo original:
 *   anillo exterior r=164 · anillo interior r=108
 *   texto superior sobre arco r=127 · texto inferior sobre arco r=148
 *   el árbol ocupa el 62.8 % del ancho, centrado.
 */
export function LogoMark({
  size = 56,
  tone = "light",
  animate = false,
  breathe = false,
  className,
}: {
  size?: number;
  tone?: "light" | "dark";
  animate?: boolean;
  breathe?: boolean;
  className?: string;
}) {
  // IDs únicos: el logo aparece varias veces por página y los <path> del
  // textPath no pueden repetir id.
  const uid = useId().replace(/:/g, "");
  const svgRef = useRef<SVGSVGElement>(null);

  const ring = tone === "light" ? "#4C7942" : "#7FB08A";
  const text = tone === "light" ? "#17616B" : "#EAF2EF";
  const strokeW = size < 80 ? 5 : 2.5;
  const fontSize = size < 80 ? 34 : 30;

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg || !animate || !motionAllowed()) return;
    const rings = svg.querySelectorAll("circle");
    // Se dibuja al entrar en pantalla (sirve tanto en el header como en el CTA final).
    const io = new IntersectionObserver((entries) => {
      if (!entries[0]?.isIntersecting) return;
      io.disconnect();
      anime({
        targets: rings,
        strokeDashoffset: [anime.setDashoffset, 0],
        duration: 1800,
        delay: anime.stagger(250),
        easing: "easeInOutSine",
      });
    });
    io.observe(svg);
    return () => {
      io.disconnect();
      anime.remove(rings);
    };
  }, [animate]);

  return (
    <div className={cn("relative flex-none", className)} style={{ width: size, height: size }}>
      <svg
        ref={svgRef}
        viewBox="0 0 334 334"
        width={size}
        height={size}
        aria-hidden="true"
        className="absolute inset-0 overflow-visible"
      >
        <defs>
          <path id={`top-${uid}`} d="M 40 167 A 127 127 0 0 1 294 167" />
          <path id={`bot-${uid}`} d="M 19 167 A 148 148 0 0 0 315 167" />
        </defs>
        <circle cx="167" cy="167" r="164" fill="none" stroke={ring} strokeWidth={strokeW} />
        <circle cx="167" cy="167" r="108" fill="none" stroke={ring} strokeWidth={strokeW} />
        <text fill={text} fontSize={fontSize} fontWeight={600} letterSpacing={size < 80 ? 7 : 8} className="font-brand">
          <textPath href={`#top-${uid}`} startOffset="50%" textAnchor="middle">
            CLÍNICA
          </textPath>
        </text>
        <text fill={text} fontSize={fontSize} fontWeight={600} letterSpacing={size < 80 ? 7 : 8} className="font-brand">
          <textPath href={`#bot-${uid}`} startOffset="50%" textAnchor="middle">
            LA AURORA
          </textPath>
        </text>
      </svg>
      <div
        className={cn(
          "absolute left-[18.6%] top-[18.6%] h-[62.8%] w-[62.8%] overflow-hidden rounded-full",
          tone === "dark" && "bg-ground",
        )}
      >
        <Image
          src="/brand/aurora-tree.png"
          alt=""
          fill
          sizes={`${Math.round(size * 0.63)}px`}
          className={cn("object-contain", breathe && "animate-breathe")}
        />
      </div>
    </div>
  );
}

/** "CLÍNICA LA AURORA": si no cabe en una línea, corta solo tras "CLÍNICA" (nunca "CLÍNICA LA / AURORA"). */
function BrandName() {
  const [first, ...rest] = SITE.name.toLocaleUpperCase("es").split(" ");
  return (
    <>
      <span className="whitespace-nowrap">{first}</span> <span className="whitespace-nowrap">{rest.join(" ")}</span>
    </>
  );
}

/** Sello + nombre en texto, enlazable (header). */
export function LogoLockup({ size = 56, textSize = 17 }: { size?: number; textSize?: number }) {
  return (
    <span className="flex items-center gap-3.5">
      <LogoMark size={size} animate />
      <span className="font-brand font-semibold tracking-[3px] text-teal" style={{ fontSize: textSize }}>
        <BrandName />
      </span>
    </span>
  );
}
