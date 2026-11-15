import type { RatingSummary, Review } from "@/models";
import { WRITE_REVIEW_URL } from "@/data/reviews";
import { Reveal } from "@/components/motion/Reveal";
import { StarIcon } from "@/components/ui/Icon";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { pageContainer } from "@/components/ui/styles";
import { ReviewCard } from "./ReviewCard";

/**
 * "Historias de bienestar": resumen de Google + reseñas reales.
 * No muestra un promedio inventado: solo el número de reseñas y enlaces
 * oficiales para leerlas todas o escribir una.
 */
export function ReviewsSection({
  reviews,
  rating,
  title = "Historias de bienestar",
  intro = "Lo que dicen nuestros pacientes.",
  className,
}: {
  reviews: Review[];
  rating: RatingSummary;
  title?: string;
  intro?: string;
  className?: string;
}) {
  if (reviews.length === 0) return null;
  return (
    <section className={className ?? "bg-mist py-20"}>
      <div className={pageContainer}>
        <Reveal>
          <SectionHeading eyebrow="Testimonios" intro={intro}>
            {title}
          </SectionHeading>
        </Reveal>
        <Reveal className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-sm">
          <span className="inline-flex items-center gap-2 font-display font-semibold text-ink">
            <span className="flex text-[#F4B400]" aria-hidden="true">
              {Array.from({ length: 5 }, (_, i) => (
                <StarIcon key={i} size={16} />
              ))}
            </span>
            {rating.count} reseñas en {rating.source}
          </span>
          {rating.url && (
            <a href={rating.url} target="_blank" rel="noopener noreferrer" className="font-semibold">
              Ver todas
            </a>
          )}
          <a href={WRITE_REVIEW_URL} target="_blank" rel="noopener noreferrer" className="rounded-full border border-line-strong bg-white px-4 py-2 font-semibold !text-ink no-underline hover:border-teal">
            Escribe una reseña
          </a>
        </Reveal>
        <Reveal className="mt-10 grid grid-cols-[repeat(auto-fill,minmax(min(300px,100%),1fr))] items-start gap-5" stagger={70}>
          {reviews.map((r) => (
            <ReviewCard key={r.author} review={r} />
          ))}
        </Reveal>
      </div>
    </section>
  );
}
