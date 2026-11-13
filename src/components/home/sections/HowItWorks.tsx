import { Reveal } from "@/components/motion/Reveal";
import { pageContainer } from "@/components/ui/styles";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function HowItWorks() {
  const steps = [
    { title: "Dinos qué te molesta", text: "Marca dónde y cómo te duele. Sin términos médicos: con tus propias palabras." },
    { title: "Conoce a tu especialista", text: "Ve su formación, su enfoque y un video de presentación antes de decidir." },
    { title: "Reserva en minutos", text: "Elige día y hora libres. Te confirmamos por WhatsApp." },
  ];
  return (
    <section id="como" className={`${pageContainer} scroll-mt-8 pb-10 pt-[120px]`}>
      <Reveal>
        <SectionHeading eyebrow="Cómo funciona">De “me duele” a tu cita, en tres pasos.</SectionHeading>
      </Reveal>
      <Reveal className="relative mt-14">
        {/* Línea punteada que se "dibuja" uniendo los pasos (data-draw) */}
        <svg viewBox="0 0 1200 40" preserveAspectRatio="none" aria-hidden="true" className="absolute inset-x-0 top-7 h-10 w-full">
          <path
            data-draw=""
            d="M 40 20 C 300 -10, 500 50, 600 20 S 900 -10, 1160 20"
            fill="none"
            stroke="#9FC1B6"
            strokeWidth={1.5}
            strokeDasharray="4 6"
          />
        </svg>
        <ol className="relative m-0 grid list-none grid-cols-[repeat(auto-fit,minmax(min(280px,100%),1fr))] gap-8 p-0">
          {steps.map((s, i) => (
            <li key={s.title} data-reveal-item="" className="flex flex-col gap-4">
              <span
                className={
                  i === 0
                    ? "flex h-[72px] w-[72px] items-center justify-center rounded-full bg-teal font-serif text-[32px] text-white"
                    : "flex h-[72px] w-[72px] items-center justify-center rounded-full border border-line-strong bg-white font-serif text-[32px] text-teal"
                }
              >
                {i + 1}
              </span>
              <h3 className="m-0 text-[21px] font-semibold">{s.title}</h3>
              <p className="m-0 text-base leading-relaxed text-muted">{s.text}</p>
            </li>
          ))}
        </ol>
      </Reveal>
    </section>
  );
}
