import type { Doctor, DoctorSchedule } from "@/models";
import { Reveal } from "@/components/motion/Reveal";
import { Icon } from "@/components/ui/Icon";
import { formatTime12h } from "@/utils/format";

/**
 * "Horario de atención" del perfil: los días y tramos en que atiende el
 * profesional (los mismos que usa su agenda). Si aún no tiene horario propio,
 * muestra el de la clínica y lo dice.
 */
export function ScheduleCard({ doctor, schedule }: { doctor: Pick<Doctor, "shortName">; schedule: DoctorSchedule }) {
  const workingDays = schedule.days.filter((d) => d.ranges.length > 0);
  const isOwn = schedule.source === "doctor";

  return (
    <Reveal as="section" aria-labelledby="horario-titulo" className="rounded-[20px] border border-line-soft border-l-4 border-l-teal bg-mist/60 p-6 sm:p-7">
      <h2 id="horario-titulo" className="m-0 flex items-center gap-2.5 font-display text-lg font-semibold text-teal">
        <Icon name="clock" size={22} strokeWidth={1.9} />
        {isOwn ? "Horario de atención" : "Horario de la clínica"}
      </h2>
      {!isOwn && (
        <p className="m-0 mt-2 text-sm text-muted">Confirmamos los horarios de {doctor.shortName} por WhatsApp al reservar.</p>
      )}
      <dl className="m-0 mt-5 grid grid-cols-[minmax(92px,auto)_1fr] gap-x-6 gap-y-3.5 border-t border-dashed border-line-strong pt-5">
        {workingDays.map((d) => (
          <div key={d.weekday} className="contents">
            <dt className="text-[15px] font-semibold text-ink">{d.day}</dt>
            <dd className="m-0 flex flex-col gap-1 text-[15px] text-subink sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-3">
              {d.ranges.map(([start, end], i) => (
                <span key={start} className="inline-flex items-center gap-3">
                  {i > 0 && <span aria-hidden="true" className="hidden h-4 w-px bg-line-strong sm:inline-block" />}
                  <span className="whitespace-nowrap">
                    {formatTime12h(start)} – {formatTime12h(end)}
                  </span>
                </span>
              ))}
            </dd>
          </div>
        ))}
      </dl>
    </Reveal>
  );
}
