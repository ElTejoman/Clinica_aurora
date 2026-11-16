import type { Article } from "@/models";
import type { ArticleRepository } from "@/repositories/article.repository";

const WORDS_PER_MINUTE = 200;

/** Blog educativo: listado, detalle y artículos relacionados. */
export interface BlogService {
  getArticles(): Article[];
  getArticle(slug: string): Article | undefined;
  /** Otros artículos, primero los del mismo servicio. */
  getRelated(article: Article, limit?: number): Article[];
}

export function createBlogService(articles: ArticleRepository): BlogService {
  return {
    getArticles: () => articles.findAll(),
    getArticle: (slug) => articles.findBySlug(slug),
    getRelated: (article, limit = 3) => {
      const others = articles.findAll().filter((a) => a.slug !== article.slug);
      const sameTopic = others.filter((a) => a.serviceSlug === article.serviceSlug);
      const rest = others.filter((a) => a.serviceSlug !== article.serviceSlug);
      return [...sameTopic, ...rest].slice(0, limit);
    },
  };
}

/** Minutos de lectura estimados (mínimo 1). */
export function readingMinutes(article: Pick<Article, "intro" | "sections">): number {
  const texts = [
    ...article.intro,
    ...article.sections.flatMap((s) => [s.title, ...(s.paragraphs ?? []), ...(s.items ?? [])]),
  ];
  const words = texts.join(" ").split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / WORDS_PER_MINUTE));
}
