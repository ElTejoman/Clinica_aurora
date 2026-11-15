import type { CredentialItem, Doctor, SpecialtyItem } from "@/models";
import { RelatedDoctorCard } from "@/components/doctors/DoctorCard";
import { Reveal } from "@/components/motion/Reveal";
import { Icon } from "@/components/ui/Icon";
import { pageContainer } from "@/components/ui/styles";

/**
 * Secciones del cuerpo del perfil (aparecen al hacer scroll):
 *   SpecialtiesSection     áreas de especialidad
 *   ExperienceSection      formación y experiencia (línea de tiempo)
 *   RelatedDoctorsSection  "También te puede ayudar"
 */

const sectionTitle = "m-0 font-display text-[clamp(26px,3vw,34px)] font-semibold leading-[1.15] text-ink";

export function SpecialtiesSection({ specialties }: { specialties: SpecialtyItem[] }) {
  const detailed = specialties.some((s) => s.description);
  return (
    <Reveal as="section" className="flex flex-col gap-6" stagger={50}>
      <h2 className={sectionTitle}>Especialidades</h2>
      <ul className={detailed ? "m-0 flex list-none flex-col gap-3 p-0" : "m-0 grid list-none grid-cols-[repeat(auto-fit,minmax(min(260px,100%),1fr))] gap-3 p-0"}>
        {specialties.map((s) => (
          <li key={s.title} data-reveal-item="" className="flex gap-3 rounded-2xl border border-line bg-white p-4">
            <Icon name="check" size={18} strokeWidth={2.4} className="mt-0.5 flex-none text-leaf" />
            <span className="text-[15px] leading-relaxed text-subink">
              <strong className="font-semibold text-ink">{s.title}</strong>
              {s.description && `: ${s.description}`}
            </span>
          </li>
        ))}
      </ul>
    </Reveal>
  );
}

export function ExperienceSection({ experience }: { experience: CredentialItem[] }) {
  return (
    <Reveal as="section" className="flex flex-col gap-6">
      <h2 className={sectionTitle}>Formación y experiencia</h2>
      <div className="relative flex flex-col gap-7 pl-9">
        {/* Línea vertical que se dibuja al aparecer */}
        <svg viewBox="0 0 4 300" preserveAspectRatio="none" aria-hidden="true" className="absolute left-[7px] top-2 h-[calc(100%-16px)] w-1">
          <path data-draw="" d="M2 0 V300" fill="none" stroke="#9FC1B6" strokeWidth={2} />
        </svg>
        {experience.map((item) => (
          <div key={item.title} data-reveal-item="" className="relative flex flex-col gap-1">
            <span className="absolute -left-9 top-1 h-[18px] w-[18px] rounded-full border-2 border-teal bg-white" aria-hidden="true" />
            {item.year && <span className="text-[13px] font-semibold text-leaf">{item.year}</span>}
            <span className="font-display text-[17px] font-semibold text-ink">{item.title}</span>
            {item.place && <span className="text-[15px] text-muted">{item.place}</span>}
          </div>
        ))}
      </div>
    </Reveal>
  );
}

export function RelatedDoctorsSection({ doctors }: { doctors: Doctor[] }) {
  if (doctors.length === 0) return null;
  return (
    <section className={`${pageContainer} pb-24`}>
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
