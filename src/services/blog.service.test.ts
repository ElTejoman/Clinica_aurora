import { describe, expect, it } from "vitest";
import type { Article } from "@/models";
import { ARTICLES } from "@/data/articles";
import { SERVICES } from "@/data/services";
import { createInMemoryArticleRepository } from "@/repositories/article.repository";
import { createBlogService, readingMinutes } from "./blog.service";

const article = (slug: string, serviceSlug: string): Article => ({
  slug,
  serviceSlug,
  title: slug,
  excerpt: "",
  cover: { src: "", alt: "" },
  intro: [],
  sections: [],
});

describe("blogService", () => {
  const blog = createBlogService(
    createInMemoryArticleRepository([article("a", "acupuntura"), article("b", "nutricion"), article("c", "acupuntura"), article("d", "ozonoterapia")]),
  );

  it("should_list_related_articles_of_the_same_service_first_without_the_current_one", () => {
    expect(blog.getRelated(blog.getArticle("a")!).map((a) => a.slug)).toEqual(["c", "b", "d"]);
  });

  it("should_limit_the_related_articles", () => {
    expect(blog.getRelated(blog.getArticle("a")!, 2)).toHaveLength(2);
  });

  it("should_return_undefined_when_the_article_does_not_exist", () => {
    expect(blog.getArticle("no-existe")).toBeUndefined();
  });
});

describe("readingMinutes", () => {
  it("should_return_at_least_one_minute_when_the_text_is_short", () => {
    expect(readingMinutes({ intro: ["Hola"], sections: [] })).toBe(1);
  });

  it("should_count_intro_titles_paragraphs_and_items", () => {
    const words = (n: number) => Array.from({ length: n }, () => "palabra").join(" ");
    expect(readingMinutes({ intro: [words(200)], sections: [{ title: words(100), paragraphs: [words(150)], items: [words(150)] }] })).toBe(3);
  });
});

describe("articles data integrity", () => {
  it("should_reference_an_existing_service_from_every_article", () => {
    const slugs = new Set(SERVICES.map((s) => s.slug));
    for (const a of ARTICLES) expect(slugs.has(a.serviceSlug), `${a.slug} → ${a.serviceSlug}`).toBe(true);
  });

  it("should_have_unique_url_safe_slugs", () => {
    const slugs = ARTICLES.map((a) => a.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
    for (const s of slugs) expect(s).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/);
  });
});
