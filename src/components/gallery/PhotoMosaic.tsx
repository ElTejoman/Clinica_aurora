"use client";

import Image from "next/image";
import { useState } from "react";
import type { GalleryPhoto } from "@/models";
import { Reveal } from "@/components/motion/Reveal";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/utils/cn";
import { Lightbox } from "./Lightbox";

/**
 * Mosaico de fotos: las verticales ocupan dos filas, las horizontales 4:3.
 * La leyenda aparece al pasar el cursor o con el foco (siempre visible en
 * pantallas táctiles). Cada foto abre el visor a pantalla completa.
 */
export function PhotoMosaic({ photos }: { photos: readonly GalleryPhoto[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const navigate = (step: 1 | -1) => setOpenIndex((i) => (i === null ? i : (i + step + photos.length) % photos.length));

  return (
    <>
      <Reveal className="grid grid-cols-2 gap-2 sm:gap-3 lg:grid-cols-4" stagger={60}>
        {photos.map((photo, i) => (
          <button
            key={photo.src}
            type="button"
            data-reveal-item=""
            onClick={() => setOpenIndex(i)}
            aria-label={`Ampliar foto: ${photo.alt}`}
            className={cn(
              "group relative overflow-hidden rounded-[18px] bg-mist focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal",
              photo.orientation === "portrait" ? "row-span-2" : "aspect-[4/3]",
            )}
          >
            <Image
              src={photo.src}
              alt=""
              fill
              sizes="(max-width: 1024px) 50vw, 25vw"
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-105 motion-reduce:transition-none motion-reduce:group-hover:scale-100"
            />
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-0 bottom-0 flex items-end justify-between gap-2 bg-gradient-to-t from-night/75 via-night/30 to-transparent p-3 pt-12 text-left transition-opacity duration-300 group-focus-visible:opacity-100 sm:p-4 sm:pt-16 [@media(hover:hover)]:opacity-0 [@media(hover:hover)]:group-hover:opacity-100"
            >
              <span className="text-sm font-semibold leading-tight text-white sm:text-base">{photo.caption}</span>
              <span className="hidden h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-sm sm:flex">
                <Icon name="expand" size={16} />
              </span>
            </span>
          </button>
        ))}
      </Reveal>
      <Lightbox photos={photos} index={openIndex} onClose={() => setOpenIndex(null)} onNavigate={navigate} />
    </>
  );
}
