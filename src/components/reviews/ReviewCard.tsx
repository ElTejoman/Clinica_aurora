"use client";

import { useState } from "react";
import type { Review } from "@/models";
import { StarIcon } from "@/components/ui/Icon";
import { cn } from "@/utils/cn";

const CLAMP_CHARS = 220;

/** Reseña con estrellas; los textos largos se pueden expandir con "Leer más". */
export function ReviewCard({ review }: { review: Review }) {
  const [expanded, setExpanded] = useState(false);
  const long = review.text.length > CLAMP_CHARS;
  const text = expanded || !long ? review.text : `${review.text.slice(0, CLAMP_CHARS).trimEnd()}…`;

  return (
    <figure data-reveal-item="" className="m-0 flex h-full flex-col gap-4 rounded-[22px] border border-line-soft bg-white p-6 shadow-[0_1px_0_rgba(16,41,43,.04)]">
      <div className="flex items-center gap-3">
        <span className="flex h-11 w-11 flex-none items-center justify-center rounded-full bg-sage-soft font-display text-lg font-semibold text-teal">
          {review.author.charAt(0).toUpperCase()}
        </span>
        <figcaption className="flex min-w-0 flex-col">
          <span className="truncate font-display text-[15px] font-semibold text-ink">{review.author}</span>
          <span className="text-xs text-muted">Reseña en {review.source}</span>
        </figcaption>
      </div>
      <div className="flex gap-0.5 text-[#F4B400]" role="img" aria-label={`${review.rating} de 5 estrellas`}>
        {Array.from({ length: review.rating }, (_, i) => (
          <StarIcon key={i} size={17} />
        ))}
      </div>
      <blockquote className={cn("m-0 text-[15px] leading-relaxed text-subink", !expanded && "flex-1")}>{text}</blockquote>
      {long && (
        <button type="button" onClick={() => setExpanded((v) => !v)} className="self-start text-sm font-semibold text-teal hover:underline">
          {expanded ? "Leer menos" : "Leer más"}
        </button>
      )}
    </figure>
  );
}
