import { Icon, WhatsAppIcon } from "@/components/ui/Icon";
import { SITE } from "@/config/site";
import { whatsappUrl } from "@/utils/whatsapp";

/**
 * Tarjetas de canales de atención (WhatsApp, teléfono, correo).
 * Se usan en Contacto y en el Libro de Reclamaciones.
 */
interface Channel {
  title: string;
  value: string;
  href: string;
  note: string;
  icon: "whatsapp" | "phone" | "mail";
  external?: boolean;
}

const display = (digits: string) => `+${digits.slice(0, 2)} ${digits.slice(2, 5)} ${digits.slice(5, 8)} ${digits.slice(8)}`;

export function contactChannels(): Channel[] {
  return [
    { title: "WhatsApp citas", value: display(SITE.whatsapp.booking), href: whatsappUrl(SITE.whatsapp.booking), note: "Reserva y reprogramación de citas", icon: "whatsapp", external: true },
    { title: "WhatsApp consultas", value: display(SITE.whatsapp.general), href: whatsappUrl(SITE.whatsapp.general), note: "Información general y solicitudes", icon: "whatsapp", external: true },
    { title: "Teléfonos", value: SITE.phones.join(" · "), href: `tel:${SITE.phones[0].replace(/\s/g, "")}`, note: "En nuestro horario de atención", icon: "phone" },
    { title: "Correo corporativo", value: SITE.email, href: `mailto:${SITE.email}`, note: "Te respondemos en horario de oficina", icon: "mail" },
  ];
}

export function ContactChannels({ channels = contactChannels() }: { channels?: Channel[] }) {
  return (
    <ul className="m-0 grid list-none grid-cols-[repeat(auto-fit,minmax(min(240px,100%),1fr))] gap-4 p-0">
      {channels.map((c) => (
        <li key={c.title}>
          <a
            data-reveal-item=""
            href={c.href}
            {...(c.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
            className="flex h-full flex-col items-center gap-3 rounded-[22px] border border-line bg-white px-5 py-8 text-center !text-ink no-underline transition-[transform,box-shadow,border-color] duration-300 hover:-translate-y-1 hover:border-teal hover:shadow-soft"
          >
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-sage-soft text-teal">
              {c.icon === "whatsapp" ? <WhatsAppIcon size={22} /> : <Icon name={c.icon} size={22} strokeWidth={1.8} />}
            </span>
            <span className="font-display text-[17px] font-semibold">{c.title}</span>
            <span className="break-all font-semibold text-teal">{c.value}</span>
            <span className="text-sm text-muted">{c.note}</span>
          </a>
        </li>
      ))}
    </ul>
  );
}
