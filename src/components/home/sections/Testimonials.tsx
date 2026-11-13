import type { Doctor } from "@/models";
import { Reveal } from "@/components/motion/Reveal";
import { pageContainer } from "@/components/ui/styles";
import { QuoteMark } from "@/components/ui/Icon";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ofDoctor } from "@/utils/format";

/**
 * Testimonios: SIEMPRE ligados a un médico ("Paciente de la Dra. Quispe")
 * para reforzar la confianza en la persona.
 * ⚠️ Usa solo testimonios reales y con consentimiento escrito del paciente.
 */
export function Testimonials({ doctors }: { doctors: Doctor[] }) {
  return (
    <section className={`${pageContainer} pb-10 pt-[100px]`}>
      <Reveal>
        <SectionHeading eyebrow="Pacientes">Historias con nombre y apellido.</SectionHeading>
      </Reveal>
      <Reveal className="mt-12 grid grid-cols-[repeat(auto-fit,minmax(min(320px,100%),1fr))] gap-6">
        {doctors.slice(0, 3).map((d) => (
          <figure key={d.slug} data-reveal-item="" className="m-0 flex flex-col gap-6 rounded-3xl border border-line-soft bg-white p-8">
            <QuoteMark />
            <blockquote className="m-0 font-serif text-2xl leading-[1.3]">[Testimonio real del paciente, 1–2 frases]</blockquote>
            <figcaption className="mt-auto flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-tint text-sm font-semibold text-teal">
                [N]
              </span>
              <span className="flex flex-col gap-0.5">
                <span className="text-[15px] font-semibold">[Nombre del paciente]</span>
                <span className="text-[13px] text-muted">Paciente {ofDoctor(d)}</span>
              </span>
            </figcaption>
          </figure>
        ))}
      </Reveal>
    </section>
  );
}
