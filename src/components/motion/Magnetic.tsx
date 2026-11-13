"use client";

import anime from "animejs";
import { useEffect, useRef, type ReactNode } from "react";
import { motionAllowed } from "@/lib/motion";

/**
 * <Magnetic> — Botón "magnético" que sigue un poco al cursor (anime.js)
 * =============================================================================
 * Al mover el puntero sobre el contenido, se desplaza hacia él; al salir,
 * vuelve con un rebote elástico. Úsalo en los CTA principales para darles
 * protagonismo:
 *
 *   <Magnetic><ButtonLink href="/reservar">Reservar cita</ButtonLink></Magnetic>
 *
 * `strength` controla cuánto se mueve (0.25 = 25 % de la distancia al centro).
 */
export function Magnetic({
  children,
  strength = 0.25,
  className,
}: {
  children: ReactNode;
  strength?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || !motionAllowed()) return;
    // En pantallas táctiles no tiene sentido.
    if (window.matchMedia("(hover: none)").matches) return;

    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      anime.remove(el);
      anime({
        targets: el,
        translateX: (e.clientX - (r.left + r.width / 2)) * strength,
        translateY: (e.clientY - (r.top + r.height / 2)) * strength * 1.2,
        duration: 400,
        easing: "easeOutQuad",
      });
    };
    const onLeave = () => {
      anime.remove(el);
      anime({ targets: el, translateX: 0, translateY: 0, duration: 900, easing: "easeOutElastic(1, .45)" });
    };
    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerleave", onLeave);
    return () => {
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
      anime.remove(el);
    };
  }, [strength]);

  return (
    <span ref={ref} className={className ?? "inline-flex"}>
      {children}
    </span>
  );
}
