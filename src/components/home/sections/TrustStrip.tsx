import { SITE } from "@/config/site";
import { Icon } from "@/components/ui/Icon";

export function TrustStrip() {
  const items = [
    "Médicos colegiados con CMP y RNE",
    "Consulta presencial o por video",
    "Reserva online, sin llamadas",
    `Seguros: ${SITE.insurers}`,
  ];
  return (
    <section className="border-y border-line bg-white">
      <ul className="mx-auto m-0 flex max-w-page list-none flex-wrap justify-between gap-x-8 gap-y-[18px] px-4 sm:px-8 py-[22px] text-sm font-medium text-subink">
        {items.map((t) => (
          <li key={t} className="inline-flex items-center gap-2.5">
            <Icon name="check" size={18} className="text-leaf" />
            {t}
          </li>
        ))}
      </ul>
    </section>
  );
}
