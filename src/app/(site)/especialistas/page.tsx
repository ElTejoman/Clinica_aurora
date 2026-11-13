import type { Metadata } from "next";
import { SpecialistsDirectory } from "@/components/specialists/SpecialistsDirectory";
import { Intro } from "@/components/motion/Intro";
import { SplitLines } from "@/components/motion/SplitLines";
import { ButtonLink } from "@/components/ui/Button";
import { getDoctors } from "@/data/doctors";
import { getPainZone } from "@/data/pains";
import { getNextAvailableMap } from "@/services/availability";
import { ROUTES } from "@/lib/site";

/**
 * =============================================================================
 * PÁGINA 03 · ESPECIALISTAS   (ruta: /especialistas)
 * =============================================================================
 * Directorio filtrable. Para quien ya sabe lo que busca, o quiere comparar.
 *
 * Parámetros de URL:
 *   ?molestia=espalda   → abre con ese filtro activo
 *   ?q=migraña          → abre con esa búsqueda escrita
 * (El componente cliente actualiza la URL al filtrar, así se puede compartir
 *  un enlace ya filtrado.)
 */
export const metadata: Metadata = {
  title: "Especialistas",
  description: "Elige a tu médico por lo que te duele. Mira quién atiende antes y reserva directo.",
};

export default async function SpecialistsPage({
  searchParams,
}: {
  searchParams: Promise<{ molestia?: string; q?: string }>;
}) {
  const { molestia, q } = await searchParams;
  const doctors = getDoctors();
  const nextAvailable = await getNextAvailableMap(doctors.map((d) => d.slug));

  return (
    <>
      <Intro>
        <section className="mx-auto flex max-w-page flex-col gap-8 px-4 sm:px-8 pb-8 pt-14">
          <div className="flex flex-wrap items-end justify-between gap-8">
            <h1 className="m-0 max-w-[820px] font-serif text-[clamp(46px,5.6vw,84px)] font-normal leading-none tracking-[-1.5px]">
              <SplitLines
                lines={[
                  "Elige a tu médico",
                  <em key="a" className="italic text-teal">
                    por lo que te duele.
                  </em>,
                ]}
              />
            </h1>
            <p data-fade="" className="m-0 max-w-[360px] text-base leading-relaxed text-muted">
              Filtra por molestia, mira quién atiende antes y reserva directo con él o ella.
            </p>
          </div>
        </section>
      </Intro>

      <SpecialistsDirectory
        doctors={doctors}
        nextAvailable={nextAvailable}
        initialFilter={getPainZone(molestia)?.id ?? "todos"}
        initialQuery={q ?? ""}
      />

      {/* Rescate: quien no sabe a quién elegir vuelve al cuestionario */}
      <section className="mx-auto max-w-page px-4 sm:px-8 pb-[100px]">
        <div className="flex flex-wrap items-center justify-between gap-6 rounded-[28px] bg-night px-6 py-8 sm:px-12 sm:py-10 text-night-ice">
          <div className="flex max-w-[640px] flex-col gap-2">
            <span className="font-serif text-4xl leading-[1.1]">¿No sabes a quién elegir?</span>
            <span className="text-base text-night-muted">Responde tres preguntas y te decimos qué especialista te conviene.</span>
          </div>
          <ButtonLink href={ROUTES.painFinder} variant="light" trackAs={{ event: "cta_click", props: { location: "directory_rescue" } }}>
            Encontrar mi especialista
          </ButtonLink>
        </div>
      </section>
    </>
  );
}
