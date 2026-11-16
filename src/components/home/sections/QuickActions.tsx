import Image from "next/image";
import type { ReactNode } from "react";
import type { Doctor } from "@/models";
import { Reveal } from "@/components/motion/Reveal";
import { OpeningStatusText } from "@/components/availability/OpeningStatusText";
import { Icon, WhatsAppIcon, type IconName } from "@/components/ui/Icon";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { TrackedLink } from "@/components/ui/TrackedLink";
import { pageContainer } from "@/components/ui/styles";
import { ROUTES } from "@/config/routes";
import { SITE } from "@/config/site";
import { whatsappUrl } from "@/utils/whatsapp";
import { cn } from "@/utils/cn";

type StaffAvatar = Pick<Doctor, "slug" | "name" | "photo">;

interface QuickAction {
  id: string;
  title: string;
  detail: ReactNode;
  cta: string;
  href: string;
  visual: ReactNode;
  primary?: boolean;
  external?: boolean;
}

/**
 * "¿Qué deseas realizar hoy?": cuatro accesos con un dato útil cada uno
 * (duración e idiomas, estado de la sede según el horario real, el equipo y
 * WhatsApp). "Agendar cita" es la acción principal y va destacada.
 */
export function QuickActions({ staff }: { staff: readonly StaffAvatar[] }) {
  const actions: QuickAction[] = [
    {
      id: "booking",
      title: "Agendar cita",
      detail: `Consultas de 30 minutos en ${SITE.languages.join(", ").replace(/, ([^,]*)$/, " y $1")}.`,
      cta: "Elegir horario",
      href: ROUTES.booking(),
      visual: <IconBadge name="calendar" className="bg-white/15 text-white" />,
      primary: true,
    },
    {
      id: "location",
      title: "Ver sede",
      detail: (
        <>
          <span className="block">{SITE.address.replace(/, Lima$/, "")}</span>
          <OpeningStatusText className="mt-2 font-semibold text-ink" />
        </>
      ),
      cta: "Cómo llegar",
      href: ROUTES.contact("sede"),
      visual: <IconBadge name="mapPin" className="bg-sage-soft text-teal" />,
    },
    {
      id: "staff",
      title: "Staff médico",
      detail: `${staff.length} profesionales de distintas especialidades.`,
      cta: "Ver equipo",
      href: ROUTES.staff(),
      visual: <AvatarStack staff={staff} />,
    },
    {
      id: "whatsapp",
      title: "Escríbenos por WhatsApp",
      detail: "Resolvemos tus dudas sobre tratamientos y citas.",
      cta: "Abrir chat",
      href: whatsappUrl(SITE.whatsapp.general, `Hola, quisiera información sobre ${SITE.name}.`),
      visual: (
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[#25D366]/15 text-[#128C4A]">
          <WhatsAppIcon size={24} />
        </span>
      ),
      external: true,
    },
  ];

  return (
    <section className="bg-mist py-16">
      <div className={`${pageContainer} flex flex-col items-center gap-9`}>
        <Reveal>
          <SectionHeading>¿Qué deseas realizar hoy?</SectionHeading>
        </Reveal>
        <Reveal className="grid w-full max-w-[1120px] grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4" stagger={70}>
          {actions.map((action) => (
            <ActionCard key={action.id} action={action} />
          ))}
        </Reveal>
      </div>
    </section>
  );
}

function ActionCard({ action }: { action: QuickAction }) {
  const { primary, external } = action;
  return (
    <TrackedLink
      data-reveal-item=""
      href={action.href}
      trackAs={{ event: "cta_click", props: { location: `quick_${action.id}` } }}
      {...(external && { target: "_blank", rel: "noopener noreferrer" })}
      className={cn(
        "group flex flex-col gap-4 rounded-[24px] border p-5 no-underline transition-[transform,box-shadow,background-color,border-color] duration-300 ease-out hover:-translate-y-1 hover:shadow-lift sm:p-6",
        primary ? "border-teal bg-teal !text-white hover:bg-teal-dark" : "border-line-soft bg-white !text-ink hover:border-sage-soft",
      )}
    >
      {action.visual}
      <span className="flex flex-col gap-1.5">
        <span className="font-display text-lg font-semibold leading-tight sm:text-xl">{action.title}</span>
        <span className={cn("text-sm leading-relaxed sm:text-[15px]", primary ? "text-white/85" : "text-muted")}>{action.detail}</span>
      </span>
      <span className={cn("mt-auto inline-flex items-center gap-1.5 pt-1 text-sm font-semibold", primary ? "text-white" : "text-teal")}>
        {action.cta}
        <Icon name="arrowRight" className="transition-transform duration-300 group-hover:translate-x-1" />
        {external && <span className="sr-only">(se abre en WhatsApp)</span>}
      </span>
    </TrackedLink>
  );
}

function IconBadge({ name, className }: { name: IconName; className: string }) {
  return (
    <span className={cn("flex h-12 w-12 items-center justify-center rounded-full", className)}>
      <Icon name={name} size={22} />
    </span>
  );
}

function AvatarStack({ staff }: { staff: readonly StaffAvatar[] }) {
  return (
    <span aria-hidden="true" className="flex h-12 items-center">
      {staff.map((doctor, i) => (
        <span
          key={doctor.slug}
          className={cn("relative h-11 w-11 overflow-hidden rounded-full bg-white shadow-[0_0_0_2px_#fff,0_0_0_3px_rgba(23,97,107,.2)]", i > 0 && "-ml-2.5")}
        >
          {doctor.photo && <Image src={doctor.photo} alt="" fill sizes="88px" className="origin-[50%_10%] scale-[1.6] object-cover object-top" />}
        </span>
      ))}
    </span>
  );
}
