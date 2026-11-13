import Link from "next/link";
import type { Doctor } from "@/models";
import { AuroraWave } from "@/components/three/AuroraWave";
import { Intro } from "@/components/motion/Intro";
import { SplitLines } from "@/components/motion/SplitLines";
import { FeaturedDoctorCard } from "@/components/doctors/FeaturedDoctorCard";
import { HeroSearch } from "./HeroSearch";
import { QUICK_PAINS } from "@/data/pains";
import { ROUTES } from "@/config/routes";

/**
 * <Hero> — Primera pantalla del inicio
 * =============================================================================
 * Objetivo: que en 5 segundos el visitante entienda "aquí me dicen a qué
 * médico ir" y dé el primer paso. Tres caminos de entrada, todos al embudo:
 *   1. Escribir lo que siente (HeroSearch).
 *   2. Tocar una molestia frecuente (chips → cuestionario con la zona elegida).
 *   3. Reservar directo con el médico destacado (tarjeta de la derecha).
 *
 * Fondo: <AuroraWave variant="hero"> (three.js) anclado abajo.
 * Entrada: <Intro> anima las líneas del titular y los elementos `data-fade`.
 */
export function Hero({ doctor }: { doctor: Doctor }) {
  return (
    <section className="relative min-h-[760px]">
      <AuroraWave variant="hero" className="absolute inset-x-0 bottom-0 h-[520px] w-full" />

      <Intro>
        <div className="relative mx-auto grid max-w-page grid-cols-[repeat(auto-fit,minmax(min(460px,100%),1fr))] items-center gap-14 px-4 sm:px-8 pb-24 pt-14">
          <div className="flex flex-col gap-7">
            <div
              data-fade=""
              className="inline-flex items-center gap-2.5 self-start rounded-full bg-tint px-3.5 py-2 text-[13px] font-semibold tracking-[.4px] text-teal-deep"
            >
              <span className="h-2 w-2 rounded-full bg-leaf" aria-hidden="true" />
              Especialistas en Lima · Presencial y virtual
            </div>

            <h1 className="m-0 font-serif text-[clamp(48px,6vw,88px)] font-normal leading-[.98] tracking-[-1.5px]">
              <SplitLines
                lines={[
                  "Cuéntanos qué te duele.",
                  "Te presentamos a",
                  <em key="accent" className="italic text-teal">
                    quien sabe tratarlo.
                  </em>,
                ]}
              />
            </h1>

            <p data-fade="" className="m-0 max-w-[520px] text-lg leading-relaxed text-muted">
              Elige tu molestia y en menos de un minuto sabrás qué especialista te conviene, cuándo atiende y cómo
              reservar con él.
            </p>

            <div data-fade="">
              <HeroSearch />
            </div>

            <div data-fade="" className="flex flex-col gap-3">
              <span className="text-[13px] font-medium text-muted">Lo más consultado</span>
              <div className="flex flex-wrap gap-2">
                {QUICK_PAINS.map((p) => (
                  <Link
                    key={p.label}
                    href={ROUTES.painFinder({ zona: p.zone })}
                    className="inline-flex h-11 items-center rounded-full border border-line-field bg-white/60 px-4 text-sm !text-ink no-underline transition-colors hover:border-teal hover:bg-white"
                  >
                    {p.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          <div data-fade="" className="flex justify-center">
            <FeaturedDoctorCard doctor={doctor} />
          </div>
        </div>
      </Intro>
    </section>
  );
}
