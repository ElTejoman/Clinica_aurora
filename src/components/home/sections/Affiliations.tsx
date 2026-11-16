import Image from "next/image";
import { AFFILIATIONS } from "@/data/clinic";
import { Reveal } from "@/components/motion/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { pageContainer } from "@/components/ui/styles";

/**
 * "Tenemos el respaldo de": cada logo dentro de un sello con un aro punteado
 * que gira muy lento (se detiene con "reducir movimiento") y se pinta de teal
 * al pasar por encima. En móvil, filas compactas (sello + texto); desde sm,
 * columnas centradas.
 */
export function Affiliations() {
  return (
    <section className={`${pageContainer} py-20`}>
      <Reveal className="flex flex-col items-center gap-10 sm:gap-12">
        <SectionHeading>Tenemos el respaldo de:</SectionHeading>
        <ul className="m-0 grid w-full max-w-[1040px] list-none gap-6 p-0 sm:grid-cols-3 sm:gap-8">
          {AFFILIATIONS.map((a) => (
            <li key={a.name} data-reveal-item="" className="group flex items-center gap-5 text-left sm:flex-col sm:text-center">
              <Seal logo={a.logo} name={a.name} />
              <div className="flex flex-col gap-1.5 sm:max-w-[280px]">
                <span className="font-display text-base font-semibold text-ink">{a.name}</span>
                <span className="text-[15px] leading-relaxed text-muted">{a.detail}</span>
              </div>
            </li>
          ))}
        </ul>
      </Reveal>
    </section>
  );
}

function Seal({ logo, name }: { logo: string; name: string }) {
  return (
    <span className="relative flex h-28 w-28 shrink-0 items-center justify-center sm:h-44 sm:w-44">
      <svg
        aria-hidden="true"
        viewBox="0 0 176 176"
        className="absolute inset-0 h-full w-full animate-[spin_40s_linear_infinite] text-teal/35 transition-colors duration-500 group-hover:text-teal motion-reduce:animate-none"
      >
        <circle cx="88" cy="88" r="85" fill="none" stroke="currentColor" strokeWidth="1.5" strokeDasharray="1.5 7" strokeLinecap="round" />
      </svg>
      <span className="flex h-[92px] w-[92px] items-center justify-center rounded-full bg-white p-3 shadow-soft transition-transform duration-500 ease-out group-hover:scale-[1.04] motion-reduce:transition-none sm:h-36 sm:w-36 sm:p-4">
        <Image src={logo} alt={name} width={120} height={120} className="h-auto max-h-[72px] w-auto sm:max-h-[120px]" />
      </span>
    </span>
  );
}
