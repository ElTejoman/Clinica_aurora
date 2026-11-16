import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArticleAside } from "@/components/blog/ArticleAside";
import { ArticleBody } from "@/components/blog/ArticleBody";
import { ArticleCard } from "@/components/blog/ArticleCard";
import { ArticleHero } from "@/components/blog/ArticleHero";
import { Reveal } from "@/components/motion/Reveal";
import { JsonLd } from "@/components/seo/JsonLd";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { pageContainer } from "@/components/ui/styles";
import { ROUTES } from "@/config/routes";
import { readingMinutes } from "@/services/blog.service";
import { blogService, catalogService, doctorService } from "@/services/container";
import { articleJsonLd } from "@/utils/structured-data";

/**
 * PÁGINA · ARTÍCULO DEL BLOG   (ruta: /blog-educativo/[slug]/)
 *   cabecera con portada → cuerpo + panel "Tratamiento relacionado" → sigue leyendo
 */
export const dynamicParams = false;

type Params = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return blogService.getArticles().map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const article = blogService.getArticle((await params).slug);
  if (!article) return {};
  return {
    title: article.title,
    description: article.excerpt,
    alternates: { canonical: ROUTES.article(article.slug) },
    openGraph: { type: "article", title: article.title, description: article.excerpt, images: [article.cover.src] },
  };
}

export default async function ArticlePage({ params }: Params) {
  const article = blogService.getArticle((await params).slug);
  const service = article && catalogService.getService(article.serviceSlug);
  if (!article || !service) notFound();
  const minutes = readingMinutes(article);
  const related = blogService.getRelated(article);

  return (
    <>
      <JsonLd data={articleJsonLd(article)} />
      <ArticleHero article={article} topic={service} minutes={minutes} />

      <div className={`${pageContainer} py-14`}>
        <div className="mx-auto grid max-w-[1100px] items-start gap-12 lg:grid-cols-[minmax(0,1fr)_340px] lg:gap-16">
          <ArticleBody article={article} />
          <ArticleAside service={service} doctors={doctorService.getByService(service.slug)} />
        </div>
      </div>

      {related.length > 0 && (
        <section className={`${pageContainer} pb-20`}>
          <Reveal>
            <SectionHeading eyebrow="Blog educativo">Sigue leyendo</SectionHeading>
          </Reveal>
          <Reveal className="mx-auto mt-10 grid max-w-[1100px] grid-cols-[repeat(auto-fill,minmax(min(300px,100%),1fr))] gap-6">
            {related.map((a) => {
              const topic = catalogService.getService(a.serviceSlug);
              return topic && <ArticleCard key={a.slug} article={a} topic={topic} minutes={readingMinutes(a)} />;
            })}
          </Reveal>
        </section>
      )}
    </>
  );
}
