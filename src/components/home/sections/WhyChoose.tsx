import { WHY_CHOOSE } from "@/data/clinic";
import { Reveal } from "@/components/motion/Reveal";
import { MorphCycle } from "@/components/three/MorphCycle";
import { Icon } from "@/components/ui/Icon";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { pageContainer } from "@/components/ui/styles";
import { SITE } from "@/config/site";


export function WhyChoose() {
  return (
    <section className={`${pageContainer} py-24`}>
      <Reveal>
        <SectionHeading>
          ¿Por qué elegir <span className="text-teal">{SITE.name}</span>?
        </SectionHeading>
      </Reveal>
      <div className="mt-14 grid items-center gap-12 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)]">
        <Reveal className="relative mx-auto aspect-square w-full max-w-[480px] overflow-hidden rounded-[32px] bg-mist">
          <MorphCycle className="absolute inset-0 h-full w-full" />
        </Reveal>
        <Reveal className="flex flex-col gap-6" stagger={70}>
          <span className="eyebrow">Un enfoque integral para cuidar de ti</span>
          <ul className="m-0 flex list-none flex-col gap-5 p-0">
            {WHY_CHOOSE.map((item) => (
              <li key={item.title} data-reveal-item="" className="flex gap-4">
                <span className="mt-0.5 flex h-8 w-8 flex-none items-center justify-center rounded-full bg-sage-soft text-teal">
                  <Icon name="check" size={16} strokeWidth={2.4} />
                </span>
                <p className="m-0 text-[16px] leading-relaxed text-muted">
                  <strong className="font-display font-semibold text-ink">{item.title}:</strong> {item.text}
                </p>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
