/** Bloque del cuerpo de un artículo: subtítulo con párrafos y/o una lista de puntos. */
export interface ArticleSection {
  title: string;
  paragraphs?: string[];
  items?: string[];
}

/** Artículo del blog educativo. Cada uno se asocia a un servicio de la clínica. */
export interface Article {
  /** URL: /blog-educativo/[slug]/ */
  slug: string;
  title: string;
  /** Resumen de 1–2 frases para la tarjeta del listado y la meta descripción. */
  excerpt: string;
  /** Servicio del que trata: da el tema, el icono y el CTA de reserva. */
  serviceSlug: string;
  /** Foto horizontal (4:3), en public/images/. */
  cover: { src: string; alt: string };
  /** Párrafos de entrada, antes de las secciones. */
  intro: string[];
  sections: ArticleSection[];
}
