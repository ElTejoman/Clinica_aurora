import Image from "next/image";
import { AFFILIATIONS } from "@/data/clinic";
import { Reveal } from "@/components/motion/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { pageContainer } from "@/components/ui/styles";


export function Affiliations() {
  return (
    <section className={`${pageContainer} py-20`}>
      <Reveal className="flex flex-col items-center gap-10">
        <SectionHeading>Tenemos el respaldo de:</SectionHeading>
        <ul className="m-0 grid w-full max-w-[980px] list-none grid-cols-[repeat(auto-fit,minmax(min(220px,100%),1fr))] gap-8 p-0">
          {AFFILIATIONS.map((a) => (
            <li key={a.name} data-reveal-item="" className="flex flex-col items-center gap-4 text-center">
              <span className="flex h-36 w-36 items-center justify-center rounded-full bg-white p-4 shadow-soft">
                <Image src={a.logo} alt={a.name} width={120} height={120} className="h-auto max-h-[120px] w-auto" />
              </span>
              <span className="font-display text-[15px] font-semibold text-subink">{a.name}</span>
            </li>
          ))}
        </ul>
      </Reveal>
    </section>
  );
}
