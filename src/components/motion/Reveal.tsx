"use client";

import anime from "animejs";
import { useEffect, useRef, type ElementType, type ReactNode, type ComponentPropsWithoutRef } from "react";
import { motionAllowed, showInstantly } from "@/lib/motion";

/**
 * <Reveal> — Aparición al hacer scroll (anime.js + IntersectionObserver)
 * =============================================================================
 * Envuelve una sección. Cuando entra en pantalla:
 *   1. El bloque sube 40px y aparece (opacity 0 → 1).
 *   2. Sus hijos marcados con `data-reveal-item` aparecen en cascada (stagger).
 *   3. Los trazos SVG con `data-draw` se "dibujan" (strokeDashoffset).
 *
 * Uso:
 *   <Reveal as="section" className="…">
 *     <h2>Título</h2>
 *     <div data-reveal-item>Tarjeta 1</div>
 *     <div data-reveal-item>Tarjeta 2</div>
 *   </Reveal>
 *
 * Puede contener componentes de servidor: solo es un contenedor.
 */

type RevealProps<T extends ElementType> = {
  as?: T;
  children: ReactNode;
  /** Retardo entre hijos `data-reveal-item` (ms). */
  stagger?: number;
} & Omit<ComponentPropsWithoutRef<T>, "as" | "children">;

export function Reveal<T extends ElementType = "div">({ as, children, stagger = 100, ...rest }: RevealProps<T>) {
  const Tag = (as ?? "div") as ElementType;
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Sin animación: mostramos tal cual.
    if (!motionAllowed() || !("IntersectionObserver" in window)) {
      showInstantly(el);
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          io.disconnect(); // se anima una sola vez

          anime({ targets: el, opacity: [0, 1], translateY: [40, 0], duration: 1000, easing: "easeOutCubic" });

          const items = el.querySelectorAll("[data-reveal-item]");
          if (items.length) {
            anime({
              targets: items,
              opacity: [0, 1],
              translateY: [50, 0],
              duration: 1100,
              delay: anime.stagger(stagger, { start: 150 }),
              easing: "easeOutExpo",
            });
          }

          const draws = el.querySelectorAll("[data-draw]");
          if (draws.length) {
            anime({
              targets: draws,
              strokeDashoffset: [anime.setDashoffset, 0],
              duration: 2000,
              delay: anime.stagger(250, { start: 200 }),
              easing: "easeInOutSine",
            });
          }
        });
      },
      { threshold: 0.12 },
    );
    io.observe(el);

    return () => {
      io.disconnect();
      anime.remove(el);
    };
  }, [stagger]);

  return (
    <Tag ref={ref} data-reveal="" {...rest}>
      {children}
    </Tag>
  );
}
