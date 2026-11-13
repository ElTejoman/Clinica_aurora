"use client";

import anime from "animejs";
import { useEffect, useRef } from "react";
import type { PainZone, PainZoneId } from "@/models";
import { MorphParticles } from "@/components/three/MorphParticles";
import { PAIN_DURATIONS, PAIN_KINDS } from "@/data/pains";
import { motionAllowed } from "@/lib/motion";
import type { Recommendations } from "@/services/pain-finder.service";
import { ChoiceStep, ZoneStep } from "./QuizSteps";
import { QuizResult } from "./QuizResult";
import { usePainFinder } from "./usePainFinder";

/**
 * <PainFinder> — Cuestionario "Encuentra tu especialista"
 * =============================================================================
 * Es el centro del embudo: convierte "me duele algo" en "reservo con X".
 *
 *   Paso 1  ¿Dónde?        → zona (cambia la forma 3D)       <ZoneStep>
 *   Paso 2  ¿Cómo?         → tipo de molestia                <ChoiceStep>
 *   Paso 3  ¿Desde cuándo? → duración                        <ChoiceStep>
 *   Paso 4  Resultado      → médico + horarios + reserva     <QuizResult>
 *
 * El estado vive en `usePainFinder`; la recomendación por zona llega del
 * servidor (`recommendations`), así que aquí no hay llamadas de red.
 *
 * Animaciones: <MorphParticles> (three.js) cambia de forma con cada zona;
 * anime.js hace entrar cada panel en cascada.
 */

const STEP_LABELS = ["Zona", "Tipo de molestia", "Tiempo", "Tu especialista"];

export interface PainFinderProps {
  zones: PainZone[];
  recommendations: Recommendations;
  initialZone?: PainZoneId | null;
  /** Texto que el visitante escribió en el buscador del inicio. */
  initialQuery?: string;
}

export function PainFinder({ zones, recommendations, initialZone = null, initialQuery = "" }: PainFinderProps) {
  const quiz = usePainFinder(initialZone, (zone) => recommendations[zone]?.slug);
  const { step, zone, kind, since } = quiz;
  const panelRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);

  const zoneData = zones.find((z) => z.id === zone);
  const doctor = zone ? recommendations[zone] : undefined;

  useEffect(() => {
    const panel = panelRef.current;
    if (!panel || !motionAllowed()) return;
    const heads = panel.querySelectorAll("[data-q-head]");
    const opts = panel.querySelectorAll("[data-q-opt]");
    anime({ targets: heads, opacity: [0, 1], translateY: [28, 0], duration: 900, delay: anime.stagger(80), easing: "easeOutExpo" });
    anime({
      targets: opts,
      opacity: [0, 1],
      translateY: [24, 0],
      scale: [0.97, 1],
      duration: 900,
      delay: anime.stagger(55, { start: 160 }),
      easing: "easeOutExpo",
    });
    if (labelRef.current) anime({ targets: labelRef.current, opacity: [0, 1], translateY: [16, 0], duration: 700, easing: "easeOutCubic" });
    return () => anime.remove([...heads, ...opts]);
  }, [step]);

  const pct = Math.round((step / 4) * 100);
  const shape = step === 4 ? "result" : (zone ?? "base");
  const canvasLabel = step === 4 && doctor ? doctor.specialty : (zoneData?.label ?? "Tu cuerpo");
  const answers = [zoneData?.label, kind, since].filter((a): a is string => Boolean(a));

  return (
    <div className="mx-auto flex max-w-page flex-wrap items-start gap-12 px-4 sm:px-8 pb-[100px] pt-10">
      <section aria-labelledby="q-title" className="flex min-w-0 flex-[999_1_560px] flex-col gap-8">
        <div className="flex flex-col gap-3.5">
          <span className="eyebrow">Encuentra tu especialista · 1 minuto</span>
          <div className="flex flex-col gap-2.5">
            <ol className="m-0 flex list-none justify-between gap-2 p-0 text-[13px] font-medium">
              {STEP_LABELS.map((label, i) => (
                <li key={label} className={i + 1 <= step ? "text-ink" : "text-faint"}>
                  {label}
                </li>
              ))}
            </ol>
            <div
              role="progressbar"
              aria-label="Progreso del cuestionario"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={pct}
              className="h-1 overflow-hidden rounded bg-line"
            >
              <div className="h-full rounded bg-teal transition-[width] duration-700 ease-out" style={{ width: `${pct}%` }} />
            </div>
          </div>
        </div>

        {initialQuery && step === 1 && (
          <p className="m-0 rounded-2xl bg-tint px-4 py-3 text-sm text-teal-deep">
            Buscaste “{initialQuery}”. Elige la zona que más se parezca y seguimos.
          </p>
        )}

        <div ref={panelRef} key={step} className="flex flex-col gap-6">
          {step === 1 && <ZoneStep zones={zones} selected={zone} onSelect={quiz.pickZone} />}
          {step === 2 && (
            <ChoiceStep
              title="¿Cómo la describirías?"
              intro={
                <>
                  Zona: <strong className="text-ink">{zoneData?.label}</strong>. Elige la opción que más se parezca.
                </>
              }
              options={PAIN_KINDS}
              selected={kind}
              onSelect={quiz.pickKind}
              onBack={quiz.back}
              variant="text"
            />
          )}
          {step === 3 && (
            <ChoiceStep
              title="¿Desde cuándo te pasa?"
              intro="Nos ayuda a sugerirte la consulta adecuada."
              options={PAIN_DURATIONS}
              selected={since}
              onSelect={quiz.pickSince}
              onBack={quiz.back}
              variant="display"
            />
          )}
          {step === 4 && doctor && <QuizResult doctor={doctor} answers={answers} onRestart={quiz.restart} />}
        </div>
      </section>

      <aside aria-label="Visualización" className="relative h-[640px] min-w-0 flex-[1_1_420px] overflow-hidden rounded-[32px] bg-[#EAF0ED]">
        <MorphParticles shape={shape} className="absolute inset-0 h-full w-full" />
        <div className="pointer-events-none absolute inset-x-7 bottom-[26px] flex items-end justify-between gap-4">
          <div className="flex flex-col gap-1">
            <span className="text-xs font-semibold tracking-[1.4px] text-subink">ZONA</span>
            <span ref={labelRef} key={canvasLabel} className="font-serif text-[40px] leading-none text-ink" aria-live="polite">
              {canvasLabel}
            </span>
          </div>
          <span className="text-[13px] text-subink">Paso {Math.min(step, 3)} de 3</span>
        </div>
      </aside>
    </div>
  );
}
