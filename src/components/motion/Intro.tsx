"use client";

import anime from "animejs";
import { useEffect, useRef, type ReactNode } from "react";
import { motionAllowed } from "@/lib/motion";

/**
 * <Intro> — Animación de entrada de la parte alta de cada página (anime.js)
 * =============================================================================
 * Al montar la página:
 *   - Las líneas de <SplitLines> suben desde abajo, una tras otra.
 *   - Los elementos con `data-fade` aparecen en cascada.
 *   - Los trazos con `data-draw` se dibujan.
 *
 * Es solo un contenedor (`display: contents`), así que no altera el layout.
 * Los estados iniciales ocultos los pone globals.css (ver src/lib/motion.ts).
 */
export function Intro({ children, delay = 0 }: { children: ReactNode; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const lines = root.querySelectorAll<HTMLElement>(".split-line > span");
    const fades = root.querySelectorAll<HTMLElement>("[data-fade]");
    const draws = root.querySelectorAll<SVGElement>("[data-draw]");

    if (!motionAllowed()) {
      // Sin animación: dejamos todo en su estado final.
      lines.forEach((l) => (l.style.transform = "none"));
      fades.forEach((f) => (f.style.opacity = "1"));
      return;
    }

    anime({
      targets: lines,
      translateY: ["110%", "0%"],
      duration: 1200,
      delay: anime.stagger(120, { start: 150 + delay }),
      easing: "easeOutExpo",
    });
    anime({
      targets: fades,
      opacity: [0, 1],
      translateY: [24, 0],
      duration: 1000,
      delay: anime.stagger(100, { start: 400 + delay }),
      easing: "easeOutCubic",
    });
    if (draws.length) {
      anime({
        targets: draws,
        strokeDashoffset: [anime.setDashoffset, 0],
        duration: 2400,
        delay: anime.stagger(200, { start: 400 + delay }),
        easing: "easeInOutSine",
      });
    }
    return () => anime.remove([...lines, ...fades, ...draws]);
  }, [delay]);

  return (
    <div ref={ref} data-intro="" style={{ display: "contents" }}>
      {children}
    </div>
  );
}
