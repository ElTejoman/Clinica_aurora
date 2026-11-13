"use client";

import Link from "next/link";
import type { Doctor } from "@/models";
import { Button, ButtonLink } from "@/components/ui/Button";
import { DoctorPortrait } from "@/components/ui/DoctorPortrait";
import { Icon } from "@/components/ui/Icon";
import { chipClass } from "@/components/ui/styles";
import { ROUTES } from "@/config/routes";
import { useUpcomingSlots } from "@/hooks/useAvailability";
import { formatModes } from "@/utils/format";

/** Paso 4: especialista recomendado + próximos horarios + CTA de reserva. */
export function QuizResult({ doctor, answers, onRestart }: { doctor: Doctor; answers: string[]; onRestart: () => void }) {
  const reason = answers.join(" · ");

  return (
    <>
      <span data-q-head="" className="eyebrow">
        Tu especialista recomendado
      </span>
      <h1 id="q-title" data-q-head="" className="m-0 font-serif text-[clamp(40px,4.6vw,64px)] font-normal leading-[1.02] tracking-[-1px]">
        Para lo que nos cuentas, te conviene ver a <em className="italic text-teal">{doctor.name}</em>.
      </h1>
      <ul data-q-head="" className="m-0 flex list-none flex-wrap gap-2 p-0" aria-label="Tus respuestas">
        {answers.map((answer) => (
          <li key={answer} className="inline-flex h-[34px] items-center rounded-full bg-tint px-3.5 text-[13px] font-medium text-teal-deep">
            {answer}
          </li>
        ))}
      </ul>

      <article data-q-opt="" className="flex flex-wrap gap-6 rounded-[28px] border border-[#DCE6E2] bg-white p-5 shadow-float">
        <DoctorPortrait doctor={doctor} className="h-[230px] w-[200px] flex-none rounded-[20px]" initialsSize={88} rings="none" sizes="200px" />
        <div className="flex min-w-0 flex-[1_1_260px] flex-col gap-3.5">
          <div className="flex flex-col gap-1">
            <span className="text-xs font-semibold uppercase tracking-[1px] text-leaf">{doctor.specialty}</span>
            <span className="font-serif text-[34px] leading-[1.1]">{doctor.name}</span>
            <span className="text-sm text-muted">
              CMP {doctor.cmp} · RNE {doctor.rne} · {formatModes(doctor.modes)}
            </span>
          </div>
          <UpcomingSlotLinks doctorSlug={doctor.slug} reason={reason} />
          <div className="mt-1 flex flex-wrap gap-2.5">
            <ButtonLink
              href={ROUTES.booking({ medico: doctor.slug, motivo: reason })}
              shape="soft"
              trackAs={{ event: "cta_click", props: { location: "quiz_result", doctor: doctor.slug } }}
            >
              Reservar con {doctor.shortName}
            </ButtonLink>
            <ButtonLink href={ROUTES.doctor(doctor.slug)} variant="ghost" shape="soft">
              Ver perfil
            </ButtonLink>
          </div>
        </div>
      </article>

      {/* Aviso de seguridad: obligatorio en un orientador de síntomas */}
      <div data-q-opt="" role="note" className="flex gap-3.5 rounded-2xl border border-warn-line bg-warn-bg px-5 py-[18px] text-sm leading-relaxed text-warn-ink">
        <Icon name="alert" size={20} strokeWidth={1.8} className="mt-px flex-none" />
        <span>
          Esta orientación no reemplaza una evaluación médica. Si tienes dolor de pecho intenso, falta de aire o pérdida
          de fuerza, acude a urgencias.
        </span>
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <Button variant="ghost" size="sm" onClick={onRestart} className="h-11">
          Volver a empezar
        </Button>
        <Link href={ROUTES.specialists()} className="text-sm font-medium">
          Ver todos los especialistas
        </Link>
      </div>
    </>
  );
}

function UpcomingSlotLinks({ doctorSlug, reason }: { doctorSlug: string; reason: string }) {
  const slots = useUpcomingSlots(doctorSlug, 3);
  if (slots?.length === 0) return null;

  return (
    <div className="flex min-h-[78px] flex-col gap-2" aria-busy={!slots}>
      <span className="text-[13px] text-muted">{slots ? "Próximos horarios" : "Buscando horarios…"}</span>
      <div className="flex flex-wrap gap-2">
        {slots?.map((s) => (
          <Link
            key={s.date + s.time}
            href={ROUTES.booking({ medico: doctorSlug, dia: s.date, hora: s.time, motivo: reason })}
            className={chipClass()}
          >
            {s.label}
          </Link>
        ))}
      </div>
    </div>
  );
}
