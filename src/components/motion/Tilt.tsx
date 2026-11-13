"use client";

import anime from "animejs";
import { useEffect, useRef, type ReactNode } from "react";
import { motionAllowed, showInstantly } from "@/lib/motion";

/**
 * <Tilt> — Inclinación 3D siguiendo el cursor (anime.js)
 * =============================================================================
 * Usado en las tarjetas del directorio de especialistas. El contenedor padre
 * debe tener `perspective` (ej. clase `[perspective:1400px]`) para que la
 * rotación se vea en 3D.
 *
 * También hace la entrada de la tarjeta (sube + rota en X) cuando cambia
 * `enterKey` — así, al cambiar un filtro, las tarjetas vuelven a entrar.
 */
export function Tilt({
  children,
  className,
  max = 8,
  enterKey,
  index = 0,
}: {
  children: ReactNode;
  className?: string;
  /** Grados máximos de inclinación. */
  max?: number;
  /** Cambia este valor para repetir la animación de entrada. */
  enterKey?: string;
  /** Posición en la grilla (para escalonar la entrada). */
  index?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);

  // Entrada
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!motionAllowed()) {
      showInstantly(el); // globals.css la ocultó con [data-tilt]
      return;
    }
    anime({
      targets: el,
      opacity: [0, 1],
      translateY: [50, 0],
      rotateX: [10, 0],
      duration: 1000,
      delay: 80 + index * 70,
      easing: "easeOutExpo",
    });
    return () => anime.remove(el);
  }, [enterKey, index]);

  // Inclinación con el cursor
  useEffect(() => {
    const el = ref.current;
    if (!el || !motionAllowed() || window.matchMedia("(hover: none)").matches) return;
    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      anime.remove(el);
      anime({ targets: el, rotateY: x * max, rotateX: -y * max, translateY: -6, duration: 500, easing: "easeOutQuad" });
    };
    const onLeave = () => {
      anime.remove(el);
      anime({ targets: el, rotateY: 0, rotateX: 0, translateY: 0, duration: 1000, easing: "easeOutElastic(1, .5)" });
    };
    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerleave", onLeave);
    return () => {
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
    };
  }, [max]);

  return (
    <div ref={ref} data-tilt="" className={className} style={{ transformStyle: "preserve-3d", willChange: "transform" }}>
      {children}
    </div>
  );
}
