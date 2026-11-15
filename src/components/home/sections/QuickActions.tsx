import { Magnetic } from "@/components/motion/Magnetic";
import { Reveal } from "@/components/motion/Reveal";
import { ButtonLink } from "@/components/ui/Button";
import { Icon, type IconName } from "@/components/ui/Icon";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { pageContainer } from "@/components/ui/styles";
import { ROUTES } from "@/config/routes";


const QUICK_ACTIONS: { label: string; href: string; icon: IconName }[] = [
  { label: "Agendar cita", href: ROUTES.booking(), icon: "calendar" },
  { label: "Ver sede", href: ROUTES.contact("sede"), icon: "mapPin" },
  { label: "Staff médico", href: ROUTES.staff(), icon: "users" },
];

export function QuickActions() {
  return (
    <section className="bg-mist py-16">
      <Reveal className={`${pageContainer} flex flex-col items-center gap-9`}>
        <SectionHeading>¿Qué deseas realizar hoy?</SectionHeading>
        <div className="grid w-full max-w-[920px] grid-cols-[repeat(auto-fit,minmax(min(240px,100%),1fr))] gap-4">
          {QUICK_ACTIONS.map((a) => (
            <Magnetic key={a.label} strength={0.12} className="flex">
              <ButtonLink
                data-reveal-item=""
                href={a.href}
                size="lg"
                className="h-[60px] w-full text-[17px]"
                trackAs={{ event: "cta_click", props: { location: `quick_${a.icon}` } }}
              >
                <Icon name={a.icon} size={20} />
                {a.label}
              </ButtonLink>
            </Magnetic>
          ))}
        </div>
      </Reveal>
    </section>
  );
}
