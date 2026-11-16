import type { Article } from "@/models";

/** Acceso a los artículos del blog. */
export interface ArticleRepository {
  findAll(): Article[];
  findBySlug(slug: string): Article | undefined;
}

/** Implementación sobre un array en memoria (hoy: src/data/articles.ts). */
export function createInMemoryArticleRepository(articles: readonly Article[]): ArticleRepository {
  const bySlug = new Map(articles.map((a) => [a.slug, a]));
  return {
    findAll: () => [...articles],
    findBySlug: (slug) => bySlug.get(slug),
  };
}
