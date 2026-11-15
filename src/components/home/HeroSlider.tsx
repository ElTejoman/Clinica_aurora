"use client";

import anime from "animejs";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import type { Banner } from "@/data/clinic";
import { Icon } from "@/components/ui/Icon";
import { motionAllowed } from "@/lib/motion";
import { cn } from "@/utils/cn";

/**
 * <HeroSlider> — Carrusel de banners del inicio
 * =============================================================================
 * - Cambia solo cada 6 s (se pausa al pasar el mouse, con el foco o si la
 *   persona pidió reducir movimiento).
 * - Fundido + leve zoom con anime.js.
 * - En móvil carga la versión de 800 px (<picture>), y solo el primer banner
 *   se carga de inmediato.
 * - Accesible: botones con etiqueta, puntos navegables y región "carrusel".
 */
const INTERVAL_MS = 6000;

export function HeroSlider({ banners }: { banners: Banner[] }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const slidesRef = useRef<HTMLDivElement>(null);
  const count = banners.length;

  const go = useCallback((next: number) => setIndex(((next % count) + count) % count), [count]);

  useEffect(() => {
    if (paused || count < 2 || !motionAllowed()) return;
    const t = setTimeout(() => go(index + 1), INTERVAL_MS);
    return () => clearTimeout(t);
  }, [index, paused, count, go]);

  useEffect(() => {
    const slide = slidesRef.current?.children[index] as HTMLElement | undefined;
    const img = slide?.querySelector("img");
    if (!slide || !img || !motionAllowed()) return;
    anime({ targets: slide, opacity: [0, 1], duration: 900, easing: "easeOutQuad" });
    anime({ targets: img, scale: [1.06, 1], duration: INTERVAL_MS + 900, easing: "easeOutSine" });
    return () => anime.remove([slide, img]);
  }, [index]);

  return (
    <section
      aria-roledescription="carrusel"
      aria-label="Servicios destacados"
      className="relative mx-auto max-w-[1440px] px-2 pt-2 sm:px-3 sm:pt-3"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
    >
      <div ref={slidesRef} className="relative aspect-[2/1] overflow-hidden rounded-[20px] bg-mist sm:rounded-[28px]">
        {banners.map((banner, i) => (
          <Link
            key={banner.src}
            href={banner.href}
            aria-hidden={i !== index}
            tabIndex={i === index ? 0 : -1}
            className={cn("absolute inset-0 block transition-[visibility] duration-0", i === index ? "visible z-10" : "invisible z-0")}
          >
            <picture>
              <source media="(max-width: 700px)" srcSet={banner.srcMobile} />
              <img
                src={banner.src}
                alt={banner.alt}
                width={1600}
                height={800}
                loading={i === 0 ? "eager" : "lazy"}
                fetchPriority={i === 0 ? "high" : "auto"}
                className="h-full w-full object-cover"
              />
            </picture>
          </Link>
        ))}
      </div>

      {count > 1 && (
        <>
          <ArrowButton direction="prev" onClick={() => go(index - 1)} />
          <ArrowButton direction="next" onClick={() => go(index + 1)} />
          <div className="mt-3 flex justify-center gap-2">
            {banners.map((banner, i) => (
              <button
                key={banner.src}
                type="button"
                aria-label={`Ver banner ${i + 1} de ${count}`}
                aria-current={i === index}
                onClick={() => go(i)}
                className="flex h-6 w-6 items-center justify-center"
              >
                <span className={cn("block h-2 rounded-full transition-all duration-300", i === index ? "w-6 bg-teal" : "w-2 bg-line-strong")} />
              </button>
            ))}
          </div>
        </>
      )}
    </section>
  );
}

function ArrowButton({ direction, onClick }: { direction: "prev" | "next"; onClick: () => void }) {
  const prev = direction === "prev";
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={prev ? "Banner anterior" : "Banner siguiente"}
      className={cn(
        "absolute top-[calc(50%-16px)] z-20 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/85 text-ink shadow-soft backdrop-blur transition hover:bg-white sm:inline-flex",
        prev ? "left-6" : "right-6",
      )}
    >
      <Icon name={prev ? "chevronLeft" : "chevronRight"} size={20} />
    </button>
  );
}
