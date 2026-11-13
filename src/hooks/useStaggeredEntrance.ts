"use client";

import anime from "animejs";
import { useEffect, type RefObject } from "react";
import { motionAllowed } from "@/lib/motion";

/**
 * Hace entrar en cascada (anime.js) los elementos `selector` dentro de
 * `containerRef` cada vez que cambia `trigger` (p. ej. al cambiar de día).
 * Se usa en las rejillas de horarios del perfil y de la reserva.
 */
export function useStaggeredEntrance(containerRef: RefObject<HTMLElement | null>, selector: string, trigger: unknown): void {
  useEffect(() => {
    const container = containerRef.current;
    if (!container || !motionAllowed()) return;
    const targets = container.querySelectorAll(selector);
    anime({
      targets,
      opacity: [0, 1],
      translateY: [12, 0],
      scale: [0.94, 1],
      duration: 600,
      delay: anime.stagger(40),
      easing: "easeOutBack",
    });
    return () => anime.remove(targets);
  }, [containerRef, selector, trigger]);
}
