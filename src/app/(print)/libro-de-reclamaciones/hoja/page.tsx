import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";
import { LogoMark } from "@/components/brand/Logo";
import { PrintButton } from "@/components/complaints/PrintButton";
import { Icon } from "@/components/ui/Icon";
import { ROUTES } from "@/config/routes";
import { SITE } from "@/config/site";
import { cn } from "@/utils/cn";

/**
 * HOJA DE RECLAMACIÓN (ruta: /libro-de-reclamaciones/hoja/)
 * Reproduce el formato de la clínica, pero se puede LLENAR en pantalla: el
 * paciente escribe, pulsa "Guardar como PDF o imprimir" y la hoja sale con sus
 * datos. No se envía ni se guarda nada (sitio estático): son campos HTML sin
 * estado, así que funciona sin JavaScript. Los datos del proveedor salen de
 * SITE.legal.
 */
export const metadata: Metadata = {
  title: "Hoja de reclamación",
  robots: { index: false, follow: false },
};

/** Campo sin caja: solo texto sobre el papel. */
const fieldBase = "w-full border-0 bg-transparent px-0 text-ink outline-none";
/** Una línea: subrayado que se pinta teal al escribir. */
const underlined = "border-b border-ink/40 transition-colors focus:border-teal";
/** Renglones para textos largos: líneas cada 28 px y el área crece con el contenido. */
const ruled =
  "min-h-[112px] resize-none bg-[linear-gradient(transparent_27px,rgba(16,41,43,.35)_28px)] bg-[length:100%_28px] py-0 text-[14px] leading-[28px] [field-sizing:content] [print-color-adjust:exact] focus:bg-[linear-gradient(transparent_27px,rgba(23,97,107,.7)_28px)]";

function Field({ id, label, type = "text", long = false, autoComplete, className }: { id: string; label: string; type?: string; long?: boolean; autoComplete?: string; className?: string }) {
  return (
    <div className={cn("flex flex-col gap-1", className)}>
      <label htmlFor={id} className="text-[11px] font-semibold uppercase tracking-[.5px] text-subink">
        {label}
      </label>
      {long ? (
        <textarea id={id} name={id} rows={4} className={cn(fieldBase, ruled)} />
      ) : (
        <input id={id} name={id} type={type} autoComplete={autoComplete} className={cn(fieldBase, underlined, "h-8 text-[14px]")} />
      )}
    </div>
  );
}

function Block({ n, title, children }: { n: number; title: string; children: ReactNode }) {
  return (
    <section className="flex flex-col gap-4 break-inside-avoid">
      <h2 className="m-0 rounded-md bg-teal px-3 py-1.5 font-display text-[13px] font-semibold uppercase tracking-[.5px] text-white [print-color-adjust:exact]">
        {n}. {title}
      </h2>
      {children}
    </section>
  );
}

function Signature({ label }: { label: string }) {
  return (
    <div className="ml-auto w-56 pt-10 text-center text-[12px] font-semibold">
      <span className="block border-b border-ink/40" />
      {label}
    </div>
  );
}

export default function ComplaintFormPage() {
  return (
    <main className="mx-auto max-w-[860px] px-4 py-8 print:max-w-none print:p-0">
      <Toolbar />

      <form className="flex flex-col gap-7 rounded-[18px] bg-white p-6 shadow-soft sm:p-9 print:rounded-none print:p-0 print:shadow-none" aria-label="Hoja de reclamación">
        <header className="flex flex-wrap items-center justify-between gap-4 border-b-2 border-teal pb-4">
          <div className="flex items-center gap-3">
            <LogoMark size={64} />
            <div>
              <p className="m-0 font-display text-lg font-semibold text-ink">LIBRO DE RECLAMACIONES</p>
              <p className="m-0 text-sm text-muted">Hoja de reclamación virtual · {SITE.name}</p>
            </div>
          </div>
          <div className="grid w-full max-w-[260px] grid-cols-[auto_1fr] items-end gap-x-2 gap-y-2 text-[12px] font-semibold text-subink">
            <label htmlFor="fecha">FECHA:</label>
            {/* Texto (no type="date"): vacío no imprime "dd/mm/aaaa" ni el ícono del calendario. */}
            <input
              id="fecha"
              name="fecha"
              inputMode="numeric"
              placeholder="dd/mm/aaaa"
              maxLength={10}
              className={cn(fieldBase, underlined, "h-7 text-[13px] placeholder:font-normal placeholder:text-faint print:placeholder:text-transparent")}
            />
            <span>N.º:</span>
            <span className="flex h-7 items-end border-b border-ink/40 pb-0.5 text-[11px] font-normal text-faint print:text-transparent">Lo asigna la clínica</span>
          </div>
        </header>

        <dl className="m-0 grid gap-x-6 gap-y-1 rounded-xl bg-mist px-4 py-3 text-[13px] sm:grid-cols-[auto_auto_1fr] [print-color-adjust:exact]">
          <div>
            <dt className="font-semibold">PROVEEDOR</dt>
            <dd className="m-0">{SITE.legal.name}</dd>
          </div>
          <div>
            <dt className="font-semibold">RUC</dt>
            <dd className="m-0 tabular-nums">{SITE.legal.ruc}</dd>
          </div>
          <div>
            <dt className="font-semibold">DOMICILIO</dt>
            <dd className="m-0">{SITE.legal.address}</dd>
          </div>
        </dl>

        <Block n={1} title="Identificación del consumidor reclamante">
          <div className="grid gap-x-6 gap-y-4 sm:grid-cols-2">
            <Field id="nombre" label="Nombre" autoComplete="name" />
            <Field id="documento" label="DNI / CE" />
            <Field id="domicilio" label="Domicilio" autoComplete="street-address" />
            <Field id="telefono" label="Teléfono" type="tel" autoComplete="tel" />
            <Field id="email" label="E-mail" type="email" autoComplete="email" />
            <Field id="apoderado" label="Si es menor de edad: nombre del padre, madre o apoderado" />
          </div>
        </Block>

        <Block n={2} title="Identificación del bien contratado">
          <div className="grid gap-x-6 gap-y-4 sm:grid-cols-2">
            <Field id="producto" label="Producto" />
            <Field id="monto" label="Monto reclamado" />
            <Field id="servicio" label="Servicio" />
            <Field id="descripcion" label="Descripción" />
          </div>
        </Block>

        <Block n={3} title="Detalle de la reclamación y pedido del consumidor">
          <fieldset className="m-0 flex flex-wrap gap-6 border-0 p-0 text-[13px] font-semibold">
            <legend className="sr-only">Tipo</legend>
            {[
              { value: "reclamo", label: "Reclamo¹" },
              { value: "queja", label: "Queja²" },
            ].map((o) => (
              <label key={o.value} className="inline-flex cursor-pointer items-center gap-2">
                <input type="radio" name="tipo" value={o.value} className="h-4 w-4 accent-teal" />
                {o.label}
              </label>
            ))}
          </fieldset>
          <Field id="detalle" label="Detalle" long />
          <Field id="pedido" label="Pedido" long />
          <Signature label="Firma del consumidor" />
        </Block>

        <Block n={4} title="Observaciones y acciones adoptadas por el proveedor">
          <p className="m-0 text-[12px] text-muted print:hidden">Lo completa la clínica.</p>
          <div className="flex flex-col gap-1">
            <span className="text-[11px] font-semibold uppercase tracking-[.5px] text-subink">Fecha de comunicación de la respuesta</span>
            <span className="block h-8 border-b border-ink/40" />
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-[11px] font-semibold uppercase tracking-[.5px] text-subink">Observaciones</span>
            <span className="block h-[112px] bg-[linear-gradient(transparent_27px,rgba(16,41,43,.35)_28px)] bg-[length:100%_28px] [print-color-adjust:exact]" />
          </div>
          <Signature label="Firma del proveedor" />
        </Block>

        <footer className="flex flex-col gap-1 border-t border-line pt-4 text-[11px] leading-relaxed text-muted">
          <p className="m-0">¹ RECLAMO: disconformidad relacionada con los productos o servicios.</p>
          <p className="m-0">² QUEJA: disconformidad no relacionada con los productos o servicios; o malestar o descontento respecto a la atención al público.</p>
          <p className="m-0">* La formulación del reclamo no impide acudir a otras vías de solución de controversias ni es requisito previo para interponer una denuncia ante el INDECOPI.</p>
          <p className="m-0">* El proveedor debe dar respuesta al reclamo o queja en un plazo no mayor a quince (15) días hábiles, el cual es improrrogable.</p>
        </footer>
      </form>
    </main>
  );
}

/** Barra superior (no se imprime): volver, cómo usar la hoja y botón de PDF. */
function Toolbar() {
  return (
    <div className="mb-6 flex flex-col gap-4 print:hidden">
      <Link href={ROUTES.complaints} className="inline-flex items-center gap-1.5 self-start text-sm font-semibold no-underline">
        <Icon name="arrowLeft" size={15} />
        Volver al Libro de Reclamaciones
      </Link>
      <div className="flex flex-col gap-4 rounded-[18px] border border-line bg-white px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="m-0 text-[14.5px] leading-relaxed text-subink">
          <strong className="text-ink">Completa la hoja aquí mismo</strong> y guárdala como PDF o imprímela. Luego envíala firmada
          por WhatsApp o correo, o entrégala en la clínica.
        </p>
        <PrintButton />
      </div>
    </div>
  );
}
