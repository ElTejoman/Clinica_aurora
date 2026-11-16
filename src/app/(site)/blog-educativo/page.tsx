import type { Metadata } from "next";
import { ArticleCard } from "@/components/blog/ArticleCard";
import { WellbeingCta } from "@/components/home/sections/WellbeingCta";
import { Intro } from "@/components/motion/Intro";
import { Reveal } from "@/components/motion/Reveal";
import { SplitLines } from "@/components/motion/SplitLines";
import { pageContainer } from "@/components/ui/styles";
import type { Article } from "@/models";
import { blogService, catalogService } from "@/services/container";
import { readingMinutes } from "@/services/blog.service";

/**
 * PÁGINA · BLOG EDUCATIVO   (ruta: /blog-educativo/)
 *   cabecera → artículo destacado (el primero) → resto en grilla → cierre
 */
export const metadata: Metadata = {
  title: "Blog educativo",
  description: "Aprende sobre salud integral, consejos de nuestros especialistas y descubre cómo mejorar tu bienestar día a día.",
};

export default function BlogPage() {
  const [featured, ...rest] = blogService.getArticles();

  return (
    <>
      <Intro>
        <section className="bg-mist">
          <div className="mx-auto flex max-w-[860px] flex-col items-center gap-4 px-4 py-16 text-center">
            <span data-fade="" className="eyebrow">
              Salud integral
            </span>
            <h1 className="m-0 font-display text-[clamp(34px,4.6vw,54px)] font-semibold leading-[1.1] text-ink">
              <SplitLines lines={["Blog educativo"]} />
            </h1>
            <p data-fade="" className="m-0 max-w-[640px] text-lg leading-relaxed text-muted">
              Aprende sobre salud integral, consejos de nuestros especialistas y descubre cómo mejorar tu bienestar día a día.
            </p>
          </div>
        </section>
      </Intro>

      <section className={`${pageContainer} py-16`}>
        {featured && (
          <Reveal className="mx-auto max-w-[1100px]">
            <ArticleListItem article={featured} featured />
          </Reveal>
        )}
        {rest.length > 0 && (
          <Reveal className="mx-auto mt-8 grid max-w-[1100px] grid-cols-[repeat(auto-fill,minmax(min(300px,100%),1fr))] gap-6">
            {rest.map((a) => (
              <ArticleListItem key={a.slug} article={a} />
            ))}
          </Reveal>
        )}
      </section>

      <WellbeingCta />
    </>
  );
}

function ArticleListItem({ article, featured }: { article: Article; featured?: boolean }) {
  const topic = catalogService.getService(article.serviceSlug);
  if (!topic) return null;
  return <ArticleCard article={article} topic={topic} minutes={readingMinutes(article)} featured={featured} />;
}
