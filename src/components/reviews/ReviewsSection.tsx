import type { RatingSummary, Review } from "@/models";
import { WRITE_REVIEW_URL } from "@/data/reviews";
import { Reveal } from "@/components/motion/Reveal";
import { StarIcon } from "@/components/ui/Icon";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { pageContainer } from "@/components/ui/styles";
import { env } from "@/config/env";
import { ReviewCarousel } from "./ReviewCarousel";
import { TrustindexWidget } from "./TrustindexWidget";

/**
 * "Historias de bienestar": reseñas de Google en una fila deslizable.
 *   - Con NEXT_PUBLIC_TRUSTINDEX_WIDGET_ID → widget de Trustindex (se
 *     sincroniza solo; su diseño se configura en el panel de Trustindex).
 *   - Sin él → resumen + reseñas fijas de data/reviews.ts. No muestra un
 *     promedio inventado: solo el número de reseñas y enlaces oficiales.
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
  const widgetId = env.trustindexWidgetId;
  if (!widgetId && reviews.length === 0) return null;
  return (
    <section className={className ?? "bg-mist py-20"}>
      <div className={pageContainer}>
        <Reveal>
          <SectionHeading eyebrow="Testimonios" intro={intro}>
            {title}
          </SectionHeading>
        </Reveal>
        {widgetId ? (
          <div className="mt-10">
            <TrustindexWidget widgetId={widgetId} />
          </div>
        ) : (
          <>
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
            <Reveal className="mt-10">
              <ReviewCarousel reviews={reviews} />
            </Reveal>
          </>
        )}
      </div>
    </section>
  );
}
