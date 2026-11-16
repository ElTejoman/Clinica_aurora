"use client";

import Image from "next/image";
import { useState } from "react";
import type { DayAvailability, Doctor, Service } from "@/models";
import { ButtonLink } from "@/components/ui/Button";
import { Icon, PathIcon, WhatsAppIcon } from "@/components/ui/Icon";
import { toggleClass } from "@/components/ui/styles";
import { ROUTES } from "@/config/routes";
import { useAvailabilityMap } from "@/hooks/useAvailability";
import { useSlotSelection } from "@/hooks/useSlotSelection";
import { groupSlotsByPeriod } from "@/services/availability.service";
import { serviceWhatsAppUrl } from "@/services/booking.service";
import { cn } from "@/utils/cn";
import { describeAppointmentTime, formatModes, formatTime12h } from "@/utils/format";
import { capitalize } from "@/utils/text";

export type FinderService = Pick<Service, "slug" | "name" | "icon">;
export type FinderDoctor = Pick<Doctor, "slug" | "name" | "shortName" | "specialty" | "photo" | "serviceSlugs" | "modes">;

const VISIBLE_DAYS = 7;

/**
 * <AppointmentFinder> — Agenda grande por especialidad (página de contacto)
 * =============================================================================
 * 1 · especialidad → 2 · profesional (con su próxima hora libre) → 3 · día y
 * hora (Mañana / Tarde). La barra final resume lo elegido y "Reservar" abre
 * /reservar con todo preseleccionado (empieza en "Tus datos").
 *
 * Misma lógica que el widget del perfil (useSlotSelection + agenda simulada
 * según data/schedules.ts), en versión ampliada.
 */
export function AppointmentFinder({ services, doctors }: { services: FinderService[]; doctors: FinderDoctor[] }) {
  const bookable = services.filter((s) => doctors.some((d) => d.serviceSlugs.includes(s.slug)));
  const [serviceSlug, setServiceSlug] = useState(bookable[0]?.slug);
  const service = bookable.find((s) => s.slug === serviceSlug);
  const team = doctors.filter((d) => serviceSlug && d.serviceSlugs.includes(serviceSlug));
  const [doctorSlug, setDoctorSlug] = useState(team[0]?.slug);
  const doctor = team.find((d) => d.slug === doctorSlug) ?? team[0];
  const availability = useAvailabilityMap(
    doctors.map((d) => d.slug),
    VISIBLE_DAYS,
  );

  const chooseService = (slug: string) => {
    setServiceSlug(slug);
    setDoctorSlug(doctors.find((d) => d.serviceSlugs.includes(slug))?.slug);
  };

  if (!service || !doctor) return null;

  return (
    <div data-appointment-finder="" className="overflow-hidden rounded-[28px] border border-line-soft bg-white shadow-float">
      <Step number={1} title="Especialidad" className="border-b border-line-soft">
        <SpecialtyPicker services={bookable} selected={service.slug} onSelect={chooseService} />
      </Step>
      <div className="grid lg:grid-cols-[320px_minmax(0,1fr)]">
        <Step number={2} title="Profesional" className="border-b border-line-soft lg:border-b-0 lg:border-r">
          <DoctorPicker doctors={team} selected={doctor.slug} availability={availability} onSelect={setDoctorSlug} />
        </Step>
        {availability === undefined ? (
          <Step number={3} title="Día y hora">
            <p className="m-0 min-h-[220px] text-sm text-muted">Buscando horarios…</p>
          </Step>
        ) : (
          <DayTimeAndSummary key={doctor.slug} service={service} doctor={doctor} days={availability[doctor.slug] ?? []} />
        )}
      </div>
    </div>
  );
}

function Step({ number, title, className, children }: { number: number; title: string; className?: string; children: React.ReactNode }) {
  return (
    <fieldset className={cn("m-0 min-w-0 border-0 p-5 sm:p-7", className)}>
      <legend className="float-left mb-4 flex w-full items-center gap-2.5 p-0 font-display text-[15px] font-semibold text-ink">
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-teal text-[13px] text-white">{number}</span>
        {title}
      </legend>
      <div className="clear-both">{children}</div>
    </fieldset>
  );
}

function SpecialtyPicker({ services, selected, onSelect }: { services: FinderService[]; selected: string; onSelect: (slug: string) => void }) {
  return (
    <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap">
      {services.map((s) => (
        <button
          key={s.slug}
          type="button"
          aria-pressed={s.slug === selected}
          onClick={() => onSelect(s.slug)}
          className={cn(
            toggleClass(s.slug === selected),
            "inline-flex min-h-11 items-center gap-2 rounded-2xl px-3 py-2 text-left text-sm font-semibold leading-tight sm:rounded-full sm:px-4 sm:text-[15px]",
          )}
        >
          <PathIcon d={s.icon} size={18} strokeWidth={1.8} className="shrink-0" />
          {s.name}
        </button>
      ))}
    </div>
  );
}

function DoctorPicker({
  doctors,
  selected,
  availability,
  onSelect,
}: {
  doctors: FinderDoctor[];
  selected: string;
  availability: Record<string, DayAvailability[]> | undefined;
  onSelect: (slug: string) => void;
}) {
  return (
    <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-1">
      {doctors.map((d) => {
        const active = d.slug === selected;
        return (
          <button
            key={d.slug}
            type="button"
            aria-pressed={active}
            onClick={() => onSelect(d.slug)}
            className={cn(
              "flex items-center gap-3 rounded-2xl border p-3 text-left transition-colors",
              active ? "border-teal bg-tint" : "border-line bg-white hover:border-teal",
            )}
          >
            <span className="relative h-14 w-14 shrink-0 overflow-hidden rounded-full bg-mist">
              {d.photo && <Image src={d.photo} alt="" fill sizes="112px" className="origin-[50%_10%] scale-[1.6] object-cover object-top" />}
            </span>
            <span className="flex min-w-0 flex-col gap-0.5">
              <span className="font-semibold text-ink">{d.name}</span>
              <span className="text-[13px] text-muted">{d.specialty}</span>
              <NextSlot days={availability?.[d.slug]} />
            </span>
            {active && <Icon name="check" size={18} strokeWidth={2.4} className="ml-auto shrink-0 text-teal" />}
          </button>
        );
      })}
    </div>
  );
}

function NextSlot({ days }: { days: DayAvailability[] | undefined }) {
  if (!days) return <span className="text-[13px] text-faint">Buscando horarios…</span>;
  const first = days[0];
  if (!first) return <span className="text-[13px] text-faint">Sin horarios próximos</span>;
  return (
    <span className="text-[13px] font-semibold text-leaf-ink">
      Próxima: {capitalize(first.label)} · {formatTime12h(first.slots[0]!)}
    </span>
  );
}

/** Paso 3 + barra de resumen. Se monta de nuevo al cambiar de profesional (key), así la selección vuelve al primer horario. */
function DayTimeAndSummary({ service, doctor, days }: { service: FinderService; doctor: FinderDoctor; days: DayAvailability[] }) {
  const { day, time, dayIndex, selectDay, selectTime } = useSlotSelection(days);

  return (
    <div className="flex min-w-0 flex-col">
      <Step number={3} title="Día y hora" className="flex-1">
        {day && time ? (
          <div className="flex flex-col gap-6">
            <DayStrip days={days} selected={dayIndex} onSelect={selectDay} />
            <SlotGroups slots={day.slots} selected={time} onSelect={selectTime} />
          </div>
        ) : (
          <NoSlots service={service} />
        )}
      </Step>
      {day && time && <Summary service={service} doctor={doctor} day={day} time={time} />}
    </div>
  );
}

function DayStrip({ days, selected, onSelect }: { days: DayAvailability[]; selected: number; onSelect: (i: number) => void }) {
  return (
    <div role="group" aria-label="Día" className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1 [scrollbar-width:thin]">
      {days.map((d, i) => (
        <button
          key={d.date}
          type="button"
          aria-pressed={i === selected}
          aria-label={d.isToday ? `Hoy ${d.dayNumber}` : d.label}
          onClick={() => onSelect(i)}
          className={cn(toggleClass(i === selected), "flex h-[72px] min-w-[62px] flex-1 flex-col items-center justify-center gap-0.5 rounded-2xl")}
        >
          <span className="text-[11px] font-semibold tracking-[.6px]">{d.dow}</span>
          <span className="text-xl font-semibold">{d.dayNumber}</span>
        </button>
      ))}
    </div>
  );
}

function SlotGroups({ slots, selected, onSelect }: { slots: string[]; selected: string; onSelect: (t: string) => void }) {
  return (
    <div className="flex flex-col gap-5">
      {groupSlotsByPeriod(slots).map((period) => (
        <div key={period.label} role="group" aria-label={period.label} className="flex flex-col gap-2.5">
          <span className="text-[13px] font-semibold uppercase tracking-[.6px] text-subink">{period.label}</span>
          <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 xl:grid-cols-6">
            {period.slots.map((t) => (
              <button
                key={t}
                type="button"
                aria-pressed={t === selected}
                onClick={() => onSelect(t)}
                className={cn(toggleClass(t === selected), "h-11 rounded-xl text-sm font-medium")}
              >
                {formatTime12h(t)}
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function Summary({ service, doctor, day, time }: { service: FinderService; doctor: FinderDoctor; day: DayAvailability; time: string }) {
  return (
    <div className="flex flex-col gap-4 border-t border-line-soft bg-mist px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-7">
      <div className="flex flex-col gap-1">
        <span aria-live="polite" className="font-display text-[17px] font-semibold text-ink">
          {service.name} con {doctor.shortName}, {describeAppointmentTime(day, time)}
        </span>
        <span className="text-[13px] text-muted">
          Consulta de 30 minutos · {formatModes(doctor.modes)} · Te confirmamos por WhatsApp
        </span>
      </div>
      <div className="flex shrink-0 flex-wrap items-center gap-3">
        <a
          href={serviceWhatsAppUrl(service)}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Consultar ${service.name} por WhatsApp`}
          className="inline-flex h-[50px] w-[50px] items-center justify-center rounded-full bg-[#25D366] !text-white no-underline transition hover:brightness-95"
        >
          <WhatsAppIcon size={22} />
        </a>
        <ButtonLink
          href={ROUTES.booking({ servicio: service.slug, medico: doctor.slug, dia: day.date, hora: time })}
          size="md"
          className="flex-1 sm:flex-none"
          trackAs={{ event: "cta_click", props: { location: "contact_finder", service: service.slug, doctor: doctor.slug } }}
        >
          <Icon name="calendar" />
          Reservar
        </ButtonLink>
      </div>
    </div>
  );
}

function NoSlots({ service }: { service: FinderService }) {
  return (
    <div className="flex flex-col items-start gap-3">
      <p className="m-0 text-base text-subink">Por ahora no hay horarios publicados para este profesional. Escríbenos y te avisamos.</p>
      <a href={serviceWhatsAppUrl(service)} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 font-semibold text-teal no-underline hover:underline">
        <WhatsAppIcon size={18} />
        Consultar por WhatsApp
      </a>
    </div>
  );
}
