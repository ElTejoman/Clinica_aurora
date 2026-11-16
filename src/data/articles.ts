import type { Article } from "@/models";

/**
 * Artículos del blog educativo (/blog-educativo/).
 * El primero de la lista se muestra destacado en el índice.
 *
 * Para agregar uno: copia un objeto, cambia el `slug` (será su URL) y usa una
 * foto horizontal 4:3 en WebP. `serviceSlug` debe existir en src/data/services.ts.
 */
export const ARTICLES: readonly Article[] = [
  {
    slug: "acupuntura-tradicion-milenaria",
    title: "Acupuntura: una tradición milenaria para tu bienestar",
    excerpt: "Qué es esta técnica de la medicina tradicional china, sus beneficios y las condiciones que tratamos con ella en la clínica.",
    serviceSlug: "acupuntura",
    cover: { src: "/images/clinic/terapia-acupuntura.webp", alt: "Especialista de la clínica durante una sesión de acupuntura con un paciente" },
    intro: [
      "La acupuntura es una técnica de la medicina tradicional china que consiste en la inserción de agujas muy finas en puntos específicos del cuerpo. Su objetivo es equilibrar la energía vital (Qi) y estimular la capacidad natural de curación del organismo.",
    ],
    sections: [
      {
        title: "Beneficios de la acupuntura",
        items: [
          "Alivio natural del dolor agudo y crónico.",
          "Reducción significativa del estrés y la ansiedad.",
          "Mejora en la calidad del sueño.",
          "Fortalecimiento del sistema inmunológico.",
        ],
      },
      {
        title: "Condiciones que tratamos",
        items: [
          "Dolores de espalda, cervicales y lumbares.",
          "Migrañas y dolores de cabeza tensionales.",
          "Problemas digestivos y trastornos del sueño.",
          "Recuperación de lesiones deportivas.",
        ],
      },
    ],
  },
];
