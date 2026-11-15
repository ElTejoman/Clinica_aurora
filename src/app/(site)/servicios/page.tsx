import type { Metadata } from "next";
import { QuickActions } from "@/components/home/sections/QuickActions";
import { ServicesGrid } from "@/components/home/sections/ServicesGrid";
import { Intro } from "@/components/motion/Intro";
import { SplitLines } from "@/components/motion/SplitLines";
import { catalogService, doctorService } from "@/services/container";

/** PÁGINA · SERVICIOS   (ruta: /servicios/) */
export const metadata: Metadata = {
  title: "Servicios",
  description: "Ozonoterapia, acupuntura, sueroterapia, nutrición, medicina funcional y medicina general en Miraflores, Lima.",
};

export default function ServicesPage() {
  return (
    <>
      <Intro>
        <section className="bg-mist">
          <div className="mx-auto flex max-w-[860px] flex-col items-center gap-4 px-4 py-16 text-center">
            <span data-fade="" className="eyebrow">
              Medicina integrativa
            </span>
            <h1 className="m-0 font-display text-[clamp(34px,4.6vw,54px)] font-semibold leading-[1.1] text-ink">
              <SplitLines lines={["Nuestros servicios"]} />
            </h1>
            <p data-fade="" className="m-0 text-lg leading-relaxed text-muted">
              Elige el tratamiento que necesitas y conoce a los profesionales que lo realizan.
            </p>
          </div>
        </section>
      </Intro>
      <ServicesGrid services={catalogService.getServices()} heading="Elige tu tratamiento" />
      <QuickActions staff={doctorService.getAll()} />
    </>
  );
}
