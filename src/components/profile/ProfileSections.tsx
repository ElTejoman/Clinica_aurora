import Link from "next/link";
import type { Doctor, EducationItem } from "@/models";
import { RelatedDoctorCard } from "@/components/doctors/DoctorCard";
import { Reveal } from "@/components/motion/Reveal";
import { Icon } from "@/components/ui/Icon";
import { pageContainer } from "@/components/ui/styles";
import { ROUTES } from "@/config/routes";

/**
 * Secciones del cuerpo del perfil. Cada una aparece al hacer scroll (<Reveal>).
 *   ConditionsSection     "Lo que trata": cada condición lleva a reservar con ese motivo
 *   FirstVisitSection     "Cómo es tu primera consulta" (reduce la incertidumbre)
 *   EducationSection      línea de tiempo de formación
 *   ReviewsSection        reseñas (pendiente de datos reales)
 *   RelatedDoctorsSection "También te puede ayudar" (derivación cruzada)
 */

const sectionTitle = "m-0 font-serif text-[44px] font-normal leading-[1.05]";

export function ConditionsSection({ doctor }: { doctor: Doctor }) {
  return (
    <Reveal as="section" className="flex flex-col gap-6" stagger={70}>
      <h2 className={sectionTitle}>Lo que trata</h2>
      <div className="grid grid-cols-[repeat(auto-fit,minmax(min(220px,100%),1fr))] gap-3">
        {doctor.conditions.map((condition) => (
          <Link
            key={condition}
            data-reveal-item=""
            href={ROUTES.booking({ medico: doctor.slug, motivo: condition })}
            className="flex min-h-[60px] items-center justify-between gap-3 rounded-2xl border border-line bg-white px-[18px] text-[15px] font-medium !text-ink no-underline transition-colors hover:border-teal"
          >
            {condition}
            <Icon name="arrowRight" className="flex-none text-teal" />
          </Link>
        ))}
      </div>
    </Reveal>
  );
}

const FIRST_VISIT_STEPS = [
  ["Te escucha", "Cuándo empezó, qué lo empeora y qué ya probaste."],
  ["Te examina", "Evaluación física y, si hace falta, pide exámenes."],
  ["Sales con un plan", "Diagnóstico, tratamiento y próximos pasos por escrito."],
] as const;

export function FirstVisitSection() {
  return (
    <Reveal as="section" className="flex flex-col gap-6">
      <h2 className={sectionTitle}>Cómo es tu primera consulta</h2>
      <ol className="m-0 grid list-none grid-cols-[repeat(auto-fit,minmax(min(220px,100%),1fr))] gap-4 p-0">
        {FIRST_VISIT_STEPS.map(([title, text], i) => (
          <li key={title} data-reveal-item="" className="flex flex-col gap-2.5 rounded-[20px] bg-mist p-6">
            <span className="font-serif text-[40px] leading-none text-teal">0{i + 1}</span>
            <span className="text-[17px] font-semibold">{title}</span>
            <span className="text-[15px] leading-relaxed text-muted">{text}</span>
          </li>
        ))}
      </ol>
    </Reveal>
  );
}

export function EducationSection({ education }: { education: EducationItem[] }) {
  return (
    <Reveal as="section" className="flex flex-col gap-6">
      <h2 className={sectionTitle}>Formación</h2>
      <div className="relative flex flex-col gap-7 pl-9">
        {/* Línea vertical que se dibuja al aparecer */}
        <svg viewBox="0 0 4 300" preserveAspectRatio="none" aria-hidden="true" className="absolute left-[7px] top-2 h-[calc(100%-16px)] w-1">
          <path data-draw="" d="M2 0 V300" fill="none" stroke="#9FC1B6" strokeWidth={2} />
        </svg>
        {education.map((item) => (
          <div key={item.title} data-reveal-item="" className="relative flex flex-col gap-1">
            <span className="absolute -left-9 top-1 h-[18px] w-[18px] rounded-full border-2 border-teal bg-ground" aria-hidden="true" />
            <span className="text-[13px] font-semibold text-leaf">{item.year}</span>
            <span className="text-lg font-semibold">{item.title}</span>
            <span className="text-[15px] text-muted">{item.place}</span>
          </div>
        ))}
      </div>
    </Reveal>
  );
}

/** ⚠️ Usa solo reseñas reales, de pacientes con cita atendida y con su consentimiento. */
export function ReviewsSection() {
  return (
    <Reveal as="section" className="flex flex-col gap-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <h2 className={sectionTitle}>Reseñas de pacientes</h2>
        <span className="text-sm text-muted">Solo pacientes con cita atendida</span>
      </div>
      <div className="grid grid-cols-[repeat(auto-fit,minmax(min(280px,100%),1fr))] gap-4">
        {[0, 1].map((i) => (
          <figure key={i} data-reveal-item="" className="m-0 flex flex-col gap-[18px] rounded-[20px] border border-line-soft bg-white p-7">
            <blockquote className="m-0 font-serif text-2xl leading-[1.3]">[Reseña real del paciente]</blockquote>
            <figcaption className="text-sm text-muted">[Nombre] · [Motivo de consulta]</figcaption>
          </figure>
        ))}
      </div>
    </Reveal>
  );
}

export function RelatedDoctorsSection({ doctors }: { doctors: Doctor[] }) {
  if (doctors.length === 0) return null;
  return (
    <section className={`${pageContainer} pb-[120px]`}>
      <Reveal className="flex flex-col gap-6">
        <h2 className={sectionTitle}>También te puede ayudar</h2>
        <div className="grid grid-cols-[repeat(auto-fit,minmax(min(300px,100%),1fr))] gap-4">
          {doctors.map((d) => (
            <RelatedDoctorCard key={d.slug} doctor={d} />
          ))}
        </div>
      </Reveal>
    </section>
  );
}
