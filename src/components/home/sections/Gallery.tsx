import { GALLERY } from "@/data/clinic";
import { PhotoMosaic } from "@/components/gallery/PhotoMosaic";
import { Reveal } from "@/components/motion/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";

/** Galería del inicio: título + mosaico de fotos reales con visor. */
export function Gallery() {
  return (
    <section aria-labelledby="galeria-titulo" className="px-2 py-4 sm:px-3">
      <div className="mx-auto flex max-w-[1440px] flex-col gap-10">
        <Reveal>
          <SectionHeading intro="Consultas y tratamientos en nuestra sede de Miraflores.">
            <span id="galeria-titulo">Conoce nuestra clínica</span>
          </SectionHeading>
        </Reveal>
        <PhotoMosaic photos={GALLERY} />
      </div>
    </section>
  );
}
