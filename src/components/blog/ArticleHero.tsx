import Image from "next/image";
import Link from "next/link";
import type { Article } from "@/models";
import { Intro } from "@/components/motion/Intro";
import { SplitLines } from "@/components/motion/SplitLines";
import { ROUTES } from "@/config/routes";
import { ReadingTime, TopicChip, type ArticleTopic } from "./ArticleCard";

/** Cabecera del artículo: ruta, tema, título, resumen y foto de portada que monta sobre el cuerpo. */
export function ArticleHero({ article, topic, minutes }: { article: Article; topic: ArticleTopic; minutes: number }) {
  return (
    <section>
      <div className="bg-mist pb-[clamp(120px,22vw,260px)]">
        <Intro>
          <div className="mx-auto flex max-w-[860px] flex-col items-center gap-5 px-4 pt-12 text-center sm:pt-16">
            <nav aria-label="Ruta" className="flex flex-wrap justify-center gap-2 text-[13px] text-muted">
              <Link href={ROUTES.home} className="no-underline">
                Inicio
              </Link>
              <span aria-hidden="true">/</span>
              <Link href={ROUTES.blog} className="no-underline">
                Blog educativo
              </Link>
            </nav>
            <div data-fade="" className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2">
              <Link href={ROUTES.service(topic.slug)} className="no-underline transition-opacity hover:opacity-80">
                <TopicChip topic={topic} className="bg-white" />
              </Link>
              <ReadingTime minutes={minutes} />
            </div>
            <h1 className="m-0 font-display text-[clamp(32px,4.4vw,52px)] font-semibold leading-[1.12] text-ink">
              <SplitLines lines={[article.title]} />
            </h1>
            <p data-fade="" className="m-0 max-w-[680px] text-lg leading-relaxed text-muted">
              {article.excerpt}
            </p>
          </div>
        </Intro>
      </div>
      <div className="mx-auto -mt-[clamp(100px,20vw,230px)] max-w-[1100px] px-4 sm:px-8">
        <div className="relative aspect-[4/3] overflow-hidden rounded-[24px] shadow-float sm:aspect-[16/9] sm:rounded-[28px]">
          <Image src={article.cover.src} alt={article.cover.alt} fill priority sizes="(max-width: 1100px) 100vw, 1040px" className="object-cover object-[50%_35%]" />
        </div>
      </div>
    </section>
  );
}
