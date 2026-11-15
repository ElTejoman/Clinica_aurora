"use client";

import anime from "animejs";
import { useEffect, useRef } from "react";
import { Button, ButtonLink, buttonClasses } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { ROUTES } from "@/config/routes";
import { motionAllowed } from "@/lib/motion";

/**
 * <Confirmation> — Pantalla final: la solicitud sale por WhatsApp
 * =============================================================================
 * Celebración con una línea de tiempo de anime.js:
 *   1. El círculo crece con rebote.
 *   2. El check se dibuja (strokeDashoffset).
 *   3. 16 partículas estallan en direcciones aleatorias y se desvanecen.
 *   4. Los textos aparecen en cascada.
 *
 * La cita queda confirmada cuando la clínica responde el chat de WhatsApp.
 * Si el navegador no abrió WhatsApp, el botón principal lo vuelve a abrir.
 */

const SPARK_COLORS = ["#17616B", "#4C7942", "#86B98F", "#9FC1B6"];

export function Confirmation({
  firstName,
  doctorShortName,
  when,
  whatsAppUrl,
  onAddToCalendar,
}: {
  firstName: string;
  doctorShortName: string;
  /** "hoy a las 09:30" / "el jue 12 a las 10:15" */
  when: string;
  whatsAppUrl: string;
  onAddToCalendar: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const texts = root.querySelectorAll("[data-c-text]");
    if (!motionAllowed()) {
      root.querySelectorAll<HTMLElement>(".spark").forEach((s) => (s.style.display = "none"));
      return;
    }
    const tl = anime.timeline({ easing: "easeOutExpo" });
    tl.add({ targets: root.querySelector(".ok-circle"), scale: [0, 1], duration: 700, easing: "easeOutBack" })
      .add({ targets: root.querySelector(".ok-check"), strokeDashoffset: [anime.setDashoffset, 0], duration: 700, easing: "easeInOutSine" }, "-=250")
      .add(
        {
          targets: root.querySelectorAll(".spark"),
          opacity: [{ value: 1, duration: 10 }, { value: 0, duration: 900, delay: 300 }],
          translateX: () => anime.random(-110, 110),
          translateY: () => anime.random(-110, 110),
          scale: [1.2, 0.2],
          duration: 1200,
        },
        "-=500",
      )
      .add({ targets: texts, opacity: [0, 1], translateY: [24, 0], duration: 900, delay: anime.stagger(90) }, "-=1000");
    return () => tl.pause();
  }, []);

  // role="status": el lector de pantalla anuncia el éxito
  return (
    <div ref={ref} className="flex flex-col items-start gap-6 pt-4" role="status" aria-live="polite">
      <div className="relative h-[120px] w-[120px]">
        {SPARK_COLORS.concat(SPARK_COLORS, SPARK_COLORS, SPARK_COLORS).map((c, i) => (
          <span key={i} className="spark absolute left-[54px] top-[54px] h-3 w-3 rounded-full opacity-0" style={{ background: c }} aria-hidden="true" />
        ))}
        <svg viewBox="0 0 120 120" width="120" height="120" aria-hidden="true" className="relative">
          <circle className="ok-circle" cx="60" cy="60" r="54" fill="#E4EEEB" stroke="#17616B" strokeWidth={3} style={{ transformBox: "fill-box", transformOrigin: "center" }} />
          <path className="ok-check" d="M38 61l15 15 30-32" fill="none" stroke="#17616B" strokeWidth={6} strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>

      <h1 data-c-text="" className="m-0 font-display text-[clamp(42px,4.6vw,64px)] font-normal leading-[1.02]">
        Listo, {firstName}. Envía tu solicitud por WhatsApp.
      </h1>
      <p data-c-text="" className="m-0 max-w-[560px] text-[17px] leading-relaxed text-muted">
        Abrimos WhatsApp con tu mensaje listo. Envíalo y te confirmaremos la cita con {doctorShortName}
        {when && ` ${when}`} en ese mismo chat.
      </p>
      <div data-c-text="" className="flex flex-wrap gap-3">
        <a href={whatsAppUrl} target="_blank" rel="noopener noreferrer" className={buttonClasses()}>
          Abrir WhatsApp
        </a>
        <Button variant="ghost" onClick={onAddToCalendar}>
          <Icon name="calendar" />
          Agregar a mi calendario
        </Button>
        <ButtonLink href={ROUTES.home} variant="ghost">
          Volver al inicio
        </ButtonLink>
      </div>
      <div data-c-text="" className="flex max-w-[560px] flex-col gap-2.5 rounded-[18px] border border-line bg-white px-6 py-5 text-sm leading-relaxed text-subink">
        <span className="font-semibold text-ink">Antes de tu cita</span>
        <span>
          Llega 10 minutos antes con tu DNI y, si tienes, exámenes o radiografías previas. Puedes reprogramar gratis hasta
          12 h antes.
        </span>
      </div>
    </div>
  );
}
