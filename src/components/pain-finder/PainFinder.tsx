"use client";

import anime from "animejs";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { Doctor, PainZoneId } from "@/types";
import type { UpcomingSlot } from "@/services/availability";
import { MorphParticles } from "@/components/three/MorphParticles";
import { DoctorPortrait } from "@/components/ui/DoctorPortrait";
import { Button, ButtonLink } from "@/components/ui/Button";
import { Icon, PathIcon } from "@/components/ui/Icon";
import { chipClass, optionClass } from "@/components/ui/styles";
import { PAIN_DURATIONS, PAIN_KINDS, PAIN_ZONES, getPainZone } from "@/data/pains";
import { formatModes } from "@/data/doctors";
import { ROUTES } from "@/lib/site";
import { track } from "@/lib/analytics";
import { motionAllowed } from "@/lib/motion";
import { cn } from "@/lib/cn";

/**
 * <PainFinder> — Cuestionario "Encuentra tu especialista"
 * =============================================================================
 * Es el centro del embudo: convierte "me duele algo" en "reservo con X".
 *
 *   Paso 1  ¿Dónde?        → zona (cambia la forma 3D)
 *   Paso 2  ¿Cómo?         → tipo de molestia
 *   Paso 3  ¿Desde cuándo? → duración
 *   Paso 4  Resultado      → médico recomendado + horarios + CTA de reserva
 *
 * Elegir una opción avanza solo (menos clics = más conversión).
 * El estado vive en este componente; la recomendación viene del servidor
 * (props `recommendations`), así que no hay llamadas de red aquí.
 *
 * Animaciones:
 *   - three.js: <MorphParticles> cambia de forma con cada zona/resultado.
 *   - anime.js: cada panel entra con títulos y opciones en cascada.
 *
 * 💡 Ideas para mejorar la recomendación: usar también `kind` y `since`
 *    (ej. "Más de un año" + "Rigidez" → Reumatología). La lógica estaría en
 *    `recommendFor()` más abajo.
 */

export interface Recommendation {
  doctor: Doctor;
  slots: UpcomingSlot[];
}

type Step = 1 | 2 | 3 | 4;
const STEP_LABELS = ["Zona", "Tipo de molestia", "Tiempo", "Tu especialista"];

/** Elige la recomendación. Hoy depende solo de la zona. */
function recommendFor(zone: PainZoneId, recs: Record<PainZoneId, Recommendation>): Recommendation {
  return recs[zone];
}

export function PainFinder({
  initialZone,
  initialQuery,
  recommendations,
}: {
  initialZone: PainZoneId | null;
  initialQuery: string;
  recommendations: Record<PainZoneId, Recommendation>;
}) {
  const [step, setStep] = useState<Step>(initialZone ? 2 : 1);
  const [zone, setZone] = useState<PainZoneId | null>(initialZone);
  const [kind, setKind] = useState<string | null>(null);
  const [since, setSince] = useState<string | null>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);

  const zoneData = getPainZone(zone);
  const rec = zone ? recommendFor(zone, recommendations) : null;

  // ---- Animación de entrada de cada panel (anime.js) -----------------------
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

  // ---- Medición del embudo ---------------------------------------------------
  useEffect(() => {
    if (step === 4 && zone && rec) track("quiz_complete", { zone, doctor: rec.doctor.slug, kind: kind ?? "", since: since ?? "" });
    else track("quiz_step", { step, zone: zone ?? "" });
  }, [step]); // eslint-disable-line react-hooks/exhaustive-deps

  const pickZone = (id: PainZoneId) => {
    setZone(id);
    setStep(2);
  };
  const back = () => setStep((s) => (s > 1 ? ((s - 1) as Step) : s));
  const restart = () => {
    setZone(null);
    setKind(null);
    setSince(null);
    setStep(1);
  };

  const pct = Math.round((step / 4) * 100);
  const shape = step === 4 ? "result" : (zone ?? "base");
  const canvasLabel = step === 4 && rec ? rec.doctor.specialty : (zoneData?.label ?? "Tu cuerpo");
  const answers = [zoneData?.label, kind, since].filter(Boolean).join(" · ");

  return (
    <div className="mx-auto flex max-w-page flex-wrap items-start gap-12 px-4 sm:px-8 pb-[100px] pt-10">
      {/* ===================== CUESTIONARIO ===================== */}
      <section aria-labelledby="q-title" className="flex min-w-0 flex-[999_1_560px] flex-col gap-8">
        <div className="flex flex-col gap-3.5">
          <span className="eyebrow">Encuentra tu especialista · 1 minuto</span>
          {/* Barra de progreso */}
          <div className="flex flex-col gap-2.5">
            <ol className="m-0 flex list-none justify-between gap-2 p-0 text-[13px] font-medium">
              {STEP_LABELS.map((l, i) => (
                <li key={l} className={i + 1 <= step ? "text-ink" : "text-faint"}>
                  {l}
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
          {/* ---------- PASO 1: ZONA ---------- */}
          {step === 1 && (
            <>
              <h1 id="q-title" data-q-head="" className="m-0 font-serif text-[clamp(40px,4.6vw,64px)] font-normal leading-[1.02] tracking-[-1px]">
                ¿Dónde sientes la molestia?
              </h1>
              <p data-q-head="" className="m-0 text-[17px] leading-relaxed text-muted">
                Elige la zona que más te preocupa. Si son varias, empieza por la principal.
              </p>
              <div className="grid grid-cols-[repeat(auto-fit,minmax(min(240px,100%),1fr))] gap-3">
                {PAIN_ZONES.map((z) => (
                  <button
                    key={z.id}
                    type="button"
                    data-q-opt=""
                    aria-pressed={zone === z.id}
                    onClick={() => pickZone(z.id)}
                    className={cn(optionClass(zone === z.id), "flex min-h-[88px] items-center gap-4 rounded-[18px] p-[18px]")}
                  >
                    <span className="flex h-[52px] w-[52px] flex-none items-center justify-center rounded-[14px] bg-tint text-teal">
                      <PathIcon d={z.icon} />
                    </span>
                    <span className="flex flex-col gap-[3px]">
                      <span className="text-[17px] font-semibold">{z.label}</span>
                      <span className="text-[13px] text-muted">{z.hint}</span>
                    </span>
                  </button>
                ))}
              </div>
            </>
          )}

          {/* ---------- PASO 2: TIPO ---------- */}
          {step === 2 && (
            <>
              <h1 id="q-title" data-q-head="" className="m-0 font-serif text-[clamp(40px,4.6vw,64px)] font-normal leading-[1.02] tracking-[-1px]">
                ¿Cómo la describirías?
              </h1>
              <p data-q-head="" className="m-0 text-[17px] leading-relaxed text-muted">
                Zona: <strong className="text-ink">{zoneData?.label}</strong>. Elige la opción que más se parezca.
              </p>
              <div className="grid grid-cols-[repeat(auto-fit,minmax(min(240px,100%),1fr))] gap-3">
                {PAIN_KINDS.map((k) => (
                  <button
                    key={k}
                    type="button"
                    data-q-opt=""
                    aria-pressed={kind === k}
                    onClick={() => {
                      setKind(k);
                      setStep(3);
                    }}
                    className={cn(optionClass(kind === k), "flex min-h-[68px] items-center rounded-[18px] px-5 text-base font-medium")}
                  >
                    {k}
                  </button>
                ))}
              </div>
              <BackButton onClick={back} />
            </>
          )}

          {/* ---------- PASO 3: DURACIÓN ---------- */}
          {step === 3 && (
            <>
              <h1 id="q-title" data-q-head="" className="m-0 font-serif text-[clamp(40px,4.6vw,64px)] font-normal leading-[1.02] tracking-[-1px]">
                ¿Desde cuándo te pasa?
              </h1>
              <p data-q-head="" className="m-0 text-[17px] leading-relaxed text-muted">
                Nos ayuda a sugerirte la consulta adecuada.
              </p>
              <div className="grid grid-cols-[repeat(auto-fit,minmax(min(200px,100%),1fr))] gap-3">
                {PAIN_DURATIONS.map((s) => (
                  <button
                    key={s}
                    type="button"
                    data-q-opt=""
                    aria-pressed={since === s}
                    onClick={() => {
                      setSince(s);
                      setStep(4);
                    }}
                    className={cn(optionClass(since === s), "flex min-h-24 flex-col justify-center rounded-[18px] px-5")}
                  >
                    <span className="font-serif text-[28px] leading-none">{s}</span>
                  </button>
                ))}
              </div>
              <BackButton onClick={back} />
            </>
          )}

          {/* ---------- PASO 4: RESULTADO ---------- */}
          {step === 4 && rec && zoneData && (
            <>
              <span data-q-head="" className="eyebrow">
                Tu especialista recomendado
              </span>
              <h1 id="q-title" data-q-head="" className="m-0 font-serif text-[clamp(40px,4.6vw,64px)] font-normal leading-[1.02] tracking-[-1px]">
                Para lo que nos cuentas, te conviene ver a <em className="italic text-teal">{rec.doctor.name}</em>.
              </h1>
              <ul data-q-head="" className="m-0 flex list-none flex-wrap gap-2 p-0" aria-label="Tus respuestas">
                {[zoneData.label, kind, since].filter(Boolean).map((a) => (
                  <li key={a} className="inline-flex h-[34px] items-center rounded-full bg-tint px-3.5 text-[13px] font-medium text-teal-deep">
                    {a}
                  </li>
                ))}
              </ul>

              <article data-q-opt="" className="flex flex-wrap gap-6 rounded-[28px] border border-[#DCE6E2] bg-white p-5 shadow-float">
                <DoctorPortrait doctor={rec.doctor} className="h-[230px] w-[200px] flex-none rounded-[20px]" initialsSize={88} rings="none" sizes="200px" />
                <div className="flex min-w-0 flex-[1_1_260px] flex-col gap-3.5">
                  <div className="flex flex-col gap-1">
                    <span className="text-xs font-semibold uppercase tracking-[1px] text-leaf">{rec.doctor.specialty}</span>
                    <span className="font-serif text-[34px] leading-[1.1]">{rec.doctor.name}</span>
                    <span className="text-sm text-muted">
                      CMP {rec.doctor.cmp} · RNE {rec.doctor.rne} · {formatModes(rec.doctor.modes)}
                    </span>
                  </div>
                  {rec.slots.length > 0 && (
                    <div className="flex flex-col gap-2">
                      <span className="text-[13px] text-muted">Próximos horarios</span>
                      <div className="flex flex-wrap gap-2">
                        {rec.slots.map((s) => (
                          <Link
                            key={s.date + s.time}
                            href={ROUTES.booking({ medico: rec.doctor.slug, dia: s.date, hora: s.time, motivo: answers })}
                            className={chipClass()}
                          >
                            {s.label}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                  <div className="mt-1 flex flex-wrap gap-2.5">
                    <ButtonLink
                      href={ROUTES.booking({ medico: rec.doctor.slug, motivo: answers })}
                      shape="soft"
                      trackAs={{ event: "cta_click", props: { location: "quiz_result", doctor: rec.doctor.slug } }}
                    >
                      Reservar con {rec.doctor.shortName}
                    </ButtonLink>
                    <ButtonLink href={ROUTES.doctor(rec.doctor.slug)} variant="ghost" shape="soft">
                      Ver perfil
                    </ButtonLink>
                  </div>
                </div>
              </article>

              {/* Aviso de seguridad: obligatorio en un orientador de síntomas */}
              <div data-q-opt="" role="note" className="flex gap-3.5 rounded-2xl border border-warn-line bg-warn-bg px-5 py-[18px] text-sm leading-relaxed text-warn-ink">
                <Icon name="alert" size={20} strokeWidth={1.8} className="mt-px flex-none" />
                <span>
                  Esta orientación no reemplaza una evaluación médica. Si tienes dolor de pecho intenso, falta de aire o
                  pérdida de fuerza, acude a urgencias.
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-4">
                <Button variant="ghost" size="sm" onClick={restart} className="h-11">
                  Volver a empezar
                </Button>
                <Link href={ROUTES.specialists} className="text-sm font-medium">
                  Ver todos los especialistas
                </Link>
              </div>
            </>
          )}
        </div>
      </section>

      {/* ===================== VISUAL 3D ===================== */}
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

function BackButton({ onClick }: { onClick: () => void }) {
  return (
    <Button variant="ghost" size="sm" onClick={onClick} className="h-11 self-start font-normal">
      <Icon name="arrowLeft" />
      Atrás
    </Button>
  );
}
