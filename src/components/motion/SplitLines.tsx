import type { ReactNode } from "react";

/**
 * <SplitLines> — Titular partido en líneas que "suben" al cargar
 * =============================================================================
 * Componente de SERVIDOR (solo marcado). La animación la hace <Intro>, que
 * busca `.split-line > span` dentro de él.
 *
 * Partimos las líneas a mano (no con JS) para que el texto quede en el HTML
 * para SEO/lectores de pantalla y para controlar dónde corta cada línea.
 *
 *   <SplitLines lines={["Cuéntanos qué te duele.", <em key="b">quien sabe tratarlo.</em>]} />
 */
export function SplitLines({ lines }: { lines: ReactNode[] }) {
  return (
    <>
      {lines.map((line, i) => (
        <span key={i} className="split-line">
          <span>{line}</span>
        </span>
      ))}
    </>
  );
}
