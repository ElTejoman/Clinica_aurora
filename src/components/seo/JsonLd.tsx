/**
 * Datos estructurados (schema.org) para Google.
 * Escapa "<" para que ningún valor (p. ej. una bio traída de un CMS) pueda
 * cerrar la etiqueta <script> e inyectar HTML.
 */
export function JsonLd({ data }: { data: Record<string, unknown> }) {
  const json = JSON.stringify(data).replace(/</g, "\\u003c");
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: json }} />;
}
