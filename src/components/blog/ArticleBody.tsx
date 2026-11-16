import Link from "next/link";
import type { Article, ArticleSection } from "@/models";
import { Icon } from "@/components/ui/Icon";
import { ROUTES } from "@/config/routes";

/**
 * Cuerpo del artículo: entrada con letra capital, secciones (párrafos y
 * puntos en tarjetas) y aviso de que el contenido es informativo.
 */
export function ArticleBody({ article }: { article: Pick<Article, "intro" | "sections"> }) {
  return (
    <div className="flex flex-col gap-12">
      <div className="flex flex-col gap-5">
        {article.intro.map((text, i) => (
          <p
            key={i}
            className={
              i === 0
                ? "m-0 text-[19px] leading-[1.8] text-ink/85 first-letter:float-left first-letter:mr-1.5 first-letter:mt-1 first-letter:font-display first-letter:text-[62px] first-letter:font-semibold first-letter:leading-[.85] first-letter:text-teal"
                : "m-0 text-[17px] leading-[1.8] text-ink/80"
            }
          >
            {text}
          </p>
        ))}
      </div>

      {article.sections.map((section) => (
        <Section key={section.title} section={section} />
      ))}

      <aside className="rounded-2xl border-l-4 border-sage-soft bg-mist px-5 py-4 text-[15px] leading-relaxed text-muted">
        Este artículo es informativo y no reemplaza una evaluación médica. Si tienes dudas sobre tu caso, consúltalo con
        nuestros especialistas.
      </aside>

      <Link href={ROUTES.blog} className="inline-flex items-center gap-2 self-start text-[15px] font-semibold text-teal no-underline hover:underline">
        <Icon name="arrowLeft" />
        Volver al blog
      </Link>
    </div>
  );
}

function Section({ section }: { section: ArticleSection }) {
  return (
    <section className="flex flex-col gap-5">
      <h2 className="m-0 flex items-center gap-3 font-display text-[clamp(22px,2.4vw,28px)] font-semibold leading-tight text-ink">
        <span aria-hidden="true" className="h-7 w-1.5 shrink-0 rounded-full bg-teal" />
        {section.title}
      </h2>
      {section.paragraphs?.map((text, i) => (
        <p key={i} className="m-0 text-[17px] leading-[1.8] text-ink/80">
          {text}
        </p>
      ))}
      {section.items && (
        <ul className="m-0 grid list-none gap-3 p-0 sm:grid-cols-2">
          {section.items.map((item) => (
            <li key={item} className="flex items-start gap-3 rounded-2xl border border-line-soft bg-white p-4 text-[16px] leading-snug text-ink/85">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-tint text-teal">
                <Icon name="check" size={15} strokeWidth={2.4} />
              </span>
              <span className="pt-0.5">{item}</span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
