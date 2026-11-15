import type { Metadata } from "next";
import { Suspense } from "react";
import { Intro } from "@/components/motion/Intro";
import { SplitLines } from "@/components/motion/SplitLines";
import { StaffDirectory } from "@/components/staff/StaffDirectory";
import { StaffDirectoryFromUrl } from "@/components/staff/StaffDirectoryFromUrl";
import { catalogService, doctorService } from "@/services/container";

/**
 * PÁGINA · STAFF DE PROFESIONALES   (ruta: /staff-de-profesionales/)
 * Parámetros (se leen en el navegador): ?servicio=acupuntura · ?q=meza
 */
export const metadata: Metadata = {
  title: "Staff de profesionales",
  description: "Conoce a nuestros médicos y especialistas en acupuntura, nutrición, medicina funcional y medicina general.",
};

export default function StaffPage() {
  const doctors = doctorService.getAll();
  const services = catalogService.getServices().map(({ slug, name }) => ({ slug, name }));

  return (
    <>
      <Intro>
        <section className="mx-auto flex max-w-[860px] flex-col items-center gap-4 px-4 pb-10 pt-16 text-center">
          <span data-fade="" className="eyebrow">
            Nuestro equipo
          </span>
          <h1 className="m-0 font-display text-[clamp(34px,4.6vw,54px)] font-semibold leading-[1.1] text-ink">
            <SplitLines lines={["Staff de profesionales"]} />
          </h1>
          <p data-fade="" className="m-0 text-lg leading-relaxed text-muted">
            Médicos colegiados y especialistas con formación nacional e internacional, que dedican a cada paciente el tiempo
            que necesita.
          </p>
        </section>
      </Intro>
      <Suspense fallback={<StaffDirectory doctors={doctors} services={services} />}>
        <StaffDirectoryFromUrl doctors={doctors} services={services} />
      </Suspense>
    </>
  );
}
