import Image from "next/image";
import Link from "next/link";
import type { Article, Service } from "@/models";
import { Icon, PathIcon } from "@/components/ui/Icon";
import { ROUTES } from "@/config/routes";
import { cn } from "@/utils/cn";

export type ArticleTopic = Pick<Service, "slug" | "name" | "icon">;

/** Etiqueta del tema del artículo (icono + nombre del servicio). */
export function TopicChip({ topic, className }: { topic: ArticleTopic; className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-1.5 rounded-full bg-tint px-3 py-1 text-[13px] font-semibold text-teal", className)}>
      <PathIcon d={topic.icon} size={15} strokeWidth={1.9} />
      {topic.name}
    </span>
  );
}

export function ReadingTime({ minutes }: { minutes: number }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-[13px] text-muted">
      <Icon name="clock" size={14} />
      {minutes} min de lectura
    </span>
  );
}

/**
 * Tarjeta de artículo del blog. `featured` = horizontal y grande (el primero
 * del índice). "Leer artículo" se estira sobre toda la tarjeta.
 */
export function ArticleCard({ article, topic, minutes, featured = false }: { article: Article; topic: ArticleTopic; minutes: number; featured?: boolean }) {
  return (
    <article
      data-reveal-item=""
      data-article-card={article.slug}
      className={cn(
        "group relative grid overflow-hidden rounded-[28px] border border-line-soft bg-white transition-[transform,box-shadow,border-color] duration-[450ms] ease-out hover:-translate-y-1 hover:border-sage-soft hover:shadow-lift has-[.card-link:focus-visible]:ring-2 has-[.card-link:focus-visible]:ring-teal has-[.card-link:focus-visible]:ring-offset-2",
        featured && "md:grid-cols-[minmax(0,11fr)_minmax(0,9fr)]",
      )}
    >
      <div className={cn("relative aspect-[4/3] overflow-hidden bg-teal-deep", featured && "md:aspect-auto md:min-h-[420px]")}>
        <Image
          src={article.cover.src}
          alt={article.cover.alt}
          fill
          sizes={featured ? "(max-width: 768px) 100vw, 640px" : "(max-width: 700px) 100vw, 400px"}
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
        />
      </div>
      <div className={cn("flex flex-col gap-4 p-6", featured && "justify-center gap-5 sm:p-10")}>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
          <TopicChip topic={topic} />
          <ReadingTime minutes={minutes} />
        </div>
        <h2 className={cn("m-0 font-display font-semibold leading-[1.2] text-ink", featured ? "text-[clamp(24px,2.6vw,34px)]" : "text-[21px]")}>{article.title}</h2>
        <p className={cn("m-0 leading-relaxed text-muted", featured ? "text-[17px]" : "text-[15px]")}>{article.excerpt}</p>
        <Link
          href={ROUTES.article(article.slug)}
          className="card-link mt-auto inline-flex items-center gap-1.5 pt-1 text-[15px] font-semibold text-teal no-underline after:absolute after:inset-0 after:content-[''] focus-visible:outline-none"
        >
          Leer artículo<span className="sr-only">: {article.title}</span>
          <Icon name="arrowRight" className="transition-transform duration-300 group-hover:translate-x-1" />
        </Link>
      </div>
    </article>
  );
}
