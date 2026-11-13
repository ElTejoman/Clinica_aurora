import type { Doctor } from "@/models";
import { Reveal } from "@/components/motion/Reveal";
import { ButtonLink } from "@/components/ui/Button";
import { DoctorCard } from "@/components/doctors/DoctorCard";
import { ROUTES } from "@/config/routes";
import { pageContainer } from "@/components/ui/styles";
import { Accent, SectionHeading } from "@/components/ui/SectionHeading";

export function DoctorsSection({ doctors }: { doctors: Doctor[] }) {
  return (
    <section className={`${pageContainer} pb-10 pt-[100px]`}>
      <Reveal className="flex flex-wrap items-end justify-between gap-6">
        <SectionHeading eyebrow="Nuestros médicos" className="max-w-[680px]">
          Primero, las personas. Conoce a <Accent>quien te va a atender.</Accent>
        </SectionHeading>
        <ButtonLink href={ROUTES.specialists()} variant="ghost" size="sm" arrow>
          Ver todos los especialistas
        </ButtonLink>
      </Reveal>
      <Reveal className="mt-12 grid grid-cols-[repeat(auto-fit,minmax(min(270px,100%),1fr))] gap-6">
        {doctors.map((d) => (
          <DoctorCard key={d.slug} doctor={d} />
        ))}
      </Reveal>
    </section>
  );
}
