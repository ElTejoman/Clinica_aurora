import type { Metadata } from "next";
import Link from "next/link";
import { LogoMark } from "@/components/brand/Logo";
import { PrintButton } from "@/components/complaints/PrintButton";
import { ROUTES } from "@/config/routes";
import { SITE } from "@/config/site";

/**
 * HOJA DE RECLAMACIÓN imprimible (ruta: /libro-de-reclamaciones/hoja/)
 * Reproduce los campos del formato de la clínica. Los datos del proveedor
 * salen de SITE.legal (src/config/site.ts).
 */
export const metadata: Metadata = {
  title: "Hoja de reclamación",
  robots: { index: false, follow: false },
};

const line = "block min-h-[30px] border-b border-ink/40";

function Row({ label, tall = false }: { label: string; tall?: boolean }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-[11px] font-semibold uppercase tracking-[.5px] text-subink">{label}</span>
      <span className={tall ? "block min-h-[84px] border-b border-ink/40" : line} />
    </div>
  );
}

function Block({ n, title, children }: { n: number; title: string; children: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-3 break-inside-avoid">
      <h2 className="m-0 rounded-md bg-teal px-3 py-1.5 font-display text-[13px] font-semibold uppercase tracking-[.5px] text-white print:bg-teal">
        {n}. {title}
      </h2>
      {children}
    </section>
  );
}

export default function ComplaintFormPage() {
  return (
    <main className="mx-auto max-w-[820px] px-4 py-8 print:max-w-none print:p-0">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3 print:hidden">
        <Link href={ROUTES.complaints} className="text-sm font-semibold">
          ← Volver al Libro de Reclamaciones
        </Link>
        <PrintButton />
      </div>

      <article className="flex flex-col gap-6 rounded-[18px] bg-white p-8 shadow-soft print:rounded-none print:p-0 print:shadow-none">
        <header className="flex items-center justify-between gap-4 border-b-2 border-teal pb-4">
          <div className="flex items-center gap-3">
            <LogoMark size={64} />
            <div>
              <p className="m-0 font-display text-lg font-semibold text-ink">LIBRO DE RECLAMACIONES</p>
              <p className="m-0 text-sm text-muted">Hoja de reclamación · {SITE.name}</p>
            </div>
          </div>
          <div className="grid grid-cols-[auto_120px] items-end gap-x-2 gap-y-2 text-[12px] font-semibold text-subink">
            <span>FECHA:</span>
            <span className={line} />
            <span>N.º:</span>
            <span className={line} />
          </div>
        </header>

        <dl className="m-0 grid gap-1 text-[13px] sm:grid-cols-3">
          <div>
            <dt className="font-semibold">PROVEEDOR</dt>
            <dd className="m-0">{SITE.legal.name}</dd>
          </div>
          <div>
            <dt className="font-semibold">RUC</dt>
            <dd className="m-0">{SITE.legal.ruc}</dd>
          </div>
          <div>
            <dt className="font-semibold">DOMICILIO</dt>
            <dd className="m-0">{SITE.legal.address}</dd>
          </div>
        </dl>

        <Block n={1} title="Identificación del consumidor reclamante">
          <div className="grid gap-3 sm:grid-cols-2">
            <Row label="Nombre" />
            <Row label="DNI / CE" />
            <Row label="Domicilio" />
            <Row label="Teléfono" />
            <Row label="E-mail" />
            <Row label="Si es menor de edad: nombre del padre, madre o apoderado" />
          </div>
        </Block>

        <Block n={2} title="Identificación del bien contratado">
          <div className="grid gap-3 sm:grid-cols-2">
            <Row label="Producto" />
            <Row label="Monto reclamado" />
            <Row label="Servicio" />
            <Row label="Descripción" />
          </div>
        </Block>

        <Block n={3} title="Detalle de la reclamación y pedido del consumidor">
          <div className="flex flex-wrap gap-6 text-[13px] font-semibold">
            <span className="inline-flex items-center gap-2">
              <span className="inline-block h-4 w-4 border border-ink" /> Reclamo¹
            </span>
            <span className="inline-flex items-center gap-2">
              <span className="inline-block h-4 w-4 border border-ink" /> Queja²
            </span>
          </div>
          <Row label="Detalle" tall />
          <Row label="Pedido" tall />
          <div className="ml-auto w-56 pt-8 text-center text-[12px] font-semibold">
            <span className={line} />
            Firma del consumidor
          </div>
        </Block>

        <Block n={4} title="Observaciones y acciones adoptadas por el proveedor">
          <Row label="Fecha de comunicación de la respuesta" />
          <Row label="Observaciones" tall />
          <div className="ml-auto w-56 pt-8 text-center text-[12px] font-semibold">
            <span className={line} />
            Firma del proveedor
          </div>
        </Block>

        <footer className="flex flex-col gap-1 border-t border-line pt-4 text-[11px] leading-relaxed text-muted">
          <p className="m-0">¹ RECLAMO: disconformidad relacionada con los productos o servicios.</p>
          <p className="m-0">² QUEJA: disconformidad no relacionada con los productos o servicios; o malestar o descontento respecto a la atención al público.</p>
          <p className="m-0">* La formulación del reclamo no impide acudir a otras vías de solución de controversias ni es requisito previo para interponer una denuncia ante el INDECOPI.</p>
          <p className="m-0">* El proveedor debe dar respuesta al reclamo o queja en un plazo no mayor a quince (15) días hábiles, el cual es improrrogable.</p>
        </footer>
      </article>
    </main>
  );
}
