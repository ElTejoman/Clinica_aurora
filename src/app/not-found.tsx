import Link from "next/link";
import { ROUTES } from "@/config/routes";

/**
 * Página 404 (en el hosting se sirve como 404.html, ver public/.htaccess).
 * Siempre ofrece un camino de vuelta al embudo.
 */
export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-screen max-w-page flex-col items-start justify-center gap-6 px-4 sm:px-8">
      <span className="eyebrow">Error 404</span>
      <h1 className="m-0 font-serif text-[clamp(40px,5vw,72px)] font-normal leading-none">No encontramos esta página.</h1>
      <p className="m-0 text-lg text-muted">Pero sí podemos ayudarte a encontrar a tu especialista.</p>
      <div className="flex flex-wrap gap-3">
        <Link href={ROUTES.painFinder()} className="inline-flex h-[50px] items-center rounded-full bg-teal px-6 font-semibold !text-white no-underline">
          Encuentra tu dolor
        </Link>
        <Link href={ROUTES.home} className="inline-flex h-[50px] items-center rounded-full border border-line-strong px-6 !text-ink no-underline">
          Ir al inicio
        </Link>
      </div>
    </main>
  );
}
