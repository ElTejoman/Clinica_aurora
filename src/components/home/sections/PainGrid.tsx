import Link from "next/link";
import type { PainZone } from "@/models";
import type { Recommendations } from "@/services/pain-finder.service";
import { Reveal } from "@/components/motion/Reveal";
import { ROUTES } from "@/config/routes";
import { pageContainer } from "@/components/ui/styles";
import { Icon, PathIcon } from "@/components/ui/Icon";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function PainGrid({ zones, recommendations }: { zones: PainZone[]; recommendations: Recommendations }) {
  return (
    <section className={`${pageContainer} pb-10 pt-[100px]`}>
      <Reveal>
        <SectionHeading eyebrow="Busca por molestia">Cada dolor tiene a su especialista.</SectionHeading>
      </Reveal>
      <Reveal className="mt-12 grid grid-cols-[repeat(auto-fit,minmax(min(360px,100%),1fr))] gap-4">
        {zones.map((zone) => {
          const doc = recommendations[zone.id];
          return (
            <Link
              key={zone.id}
              data-reveal-item=""
              href={ROUTES.painFinder({ zona: zone.id })}
              className="group flex items-center gap-5 rounded-[20px] border border-line bg-mist p-6 !text-ink no-underline transition-colors duration-300 hover:border-teal hover:bg-white"
            >
              <span className="flex h-14 w-14 flex-none items-center justify-center rounded-2xl bg-white text-teal">
                <PathIcon d={zone.icon} size={26} />
              </span>
              <span className="flex min-w-0 flex-1 flex-col gap-1">
                <span className="text-lg font-semibold">{zone.title}</span>
                {doc && (
                  <span className="text-sm text-muted">
                    Lo ve {doc.shortName} · {doc.specialty}
                  </span>
                )}
              </span>
              <Icon name="arrowRight" size={20} className="flex-none text-teal transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          );
        })}
      </Reveal>
    </section>
  );
}
