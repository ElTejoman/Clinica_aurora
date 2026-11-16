"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { Review } from "@/models";
import { Icon } from "@/components/ui/Icon";
import { ReviewCard } from "./ReviewCard";

const arrowButton =
  "flex h-11 w-11 items-center justify-center rounded-full border border-line-strong bg-white text-ink transition-colors hover:border-teal hover:text-teal disabled:cursor-not-allowed disabled:opacity-35 disabled:hover:border-line-strong disabled:hover:text-ink";

/**
 * Reseñas en UNA fila deslizable (scroll-snap nativo: arrastre en móvil,
 * rueda/teclado en escritorio) con flechas que avanzan una "página".
 * Si todas caben, las flechas no se muestran.
 */
export function ReviewCarousel({ reviews }: { reviews: Review[] }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [edges, setEdges] = useState({ atStart: true, atEnd: true });

  const updateEdges = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    const maxScroll = track.scrollWidth - track.clientWidth;
    setEdges({ atStart: track.scrollLeft <= 4, atEnd: track.scrollLeft >= maxScroll - 4 });
  }, []);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    updateEdges();
    const observer = new ResizeObserver(updateEdges);
    observer.observe(track);
    return () => observer.disconnect();
  }, [updateEdges]);

  const scrollPage = (direction: 1 | -1) => {
    const track = trackRef.current;
    track?.scrollBy({ left: direction * track.clientWidth, behavior: "smooth" });
  };

  const scrollable = !(edges.atStart && edges.atEnd);

  return (
    <div role="region" aria-roledescription="carrusel" aria-label="Reseñas de pacientes" className="flex flex-col gap-6">
      <div
        ref={trackRef}
        onScroll={updateEdges}
        tabIndex={0}
        className="-mx-4 flex snap-x snap-mandatory scroll-px-4 gap-4 overflow-x-auto scroll-smooth px-4 pb-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-teal sm:gap-5 [scrollbar-width:none] motion-reduce:scroll-auto [&::-webkit-scrollbar]:hidden"
      >
        {reviews.map((review) => (
          <div key={review.author} className="w-[85%] flex-none snap-start sm:w-[calc((100%-1.25rem)/2)] lg:w-[calc((100%-2.5rem)/3)]">
            <ReviewCard review={review} />
          </div>
        ))}
      </div>
      {scrollable && (
        <div className="flex justify-center gap-3">
          <button type="button" onClick={() => scrollPage(-1)} disabled={edges.atStart} aria-label="Reseñas anteriores" className={arrowButton}>
            <Icon name="chevronLeft" size={20} />
          </button>
          <button type="button" onClick={() => scrollPage(1)} disabled={edges.atEnd} aria-label="Reseñas siguientes" className={arrowButton}>
            <Icon name="chevronRight" size={20} />
          </button>
        </div>
      )}
    </div>
  );
}
