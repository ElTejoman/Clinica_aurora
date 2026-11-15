"use client";

import { useEffect, useRef, useState } from "react";
import type { ShapeKey } from "@/lib/three/shapes";
import { motionAllowed } from "@/lib/motion";
import { MorphParticles } from "./MorphParticles";

/**
 * <MorphCycle> — Las partículas 3D van cambiando de forma solas mientras la
 * sección está en pantalla (empieza y vuelve siempre a los anillos del logo).
 * Con "reducir movimiento" se queda quieta en los anillos.
 */
const SEQUENCE: ShapeKey[] = ["rings", "brain", "helix", "knot", "joints", "wave", "spine"];
const STEP_MS = 3800;

export function MorphCycle({ className }: { className?: string }) {
  const [step, setStep] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const visible = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || !motionAllowed()) return;
    const io = new IntersectionObserver(([entry]) => (visible.current = Boolean(entry?.isIntersecting)), { threshold: 0.3 });
    io.observe(el);
    const timer = setInterval(() => {
      if (visible.current && !document.hidden) setStep((s) => (s + 1) % SEQUENCE.length);
    }, STEP_MS);
    return () => {
      io.disconnect();
      clearInterval(timer);
    };
  }, []);

  return (
    <div ref={ref} className={className}>
      <MorphParticles shape={SEQUENCE[step]!} className="h-full w-full" />
    </div>
  );
}
