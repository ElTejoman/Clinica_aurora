import Image from "next/image";
import { GALLERY } from "@/data/clinic";
import { Reveal } from "@/components/motion/Reveal";


export function Gallery() {
  return (
    <section aria-label="Nuestra clínica" className="px-2 sm:px-3">
      <Reveal className="mx-auto grid max-w-[1440px] grid-cols-2 gap-2 sm:gap-3 md:grid-cols-3" stagger={60}>
        {GALLERY.map((photo) => (
          <div key={photo.src} data-reveal-item="" className="group relative aspect-square overflow-hidden rounded-[18px] bg-mist">
            <Image
              src={photo.src}
              alt={photo.alt}
              fill
              sizes="(max-width: 768px) 50vw, 33vw"
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            />
          </div>
        ))}
      </Reveal>
    </section>
  );
}
