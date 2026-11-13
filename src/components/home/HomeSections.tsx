import Link from "next/link";
import type { Doctor } from "@/types";
import { Reveal } from "@/components/motion/Reveal";
import { Magnetic } from "@/components/motion/Magnetic";
import { LogoMark } from "@/components/brand/Logo";
import { ButtonLink } from "@/components/ui/Button";
import { DoctorPortrait } from "@/components/ui/DoctorPortrait";
import { Icon, PathIcon, QuoteMark } from "@/components/ui/Icon";
import { Accent, SectionHeading } from "@/components/ui/SectionHeading";
import { DoctorCard } from "@/components/doctors/DoctorCard";
import { VideoButton } from "./VideoButton";
import { PAIN_ZONES } from "@/data/pains";
import { getDoctorBySlug, ofDoctor } from "@/data/doctors";
import { ROUTES, SITE, whatsappLink } from "@/lib/site";

/**
 * =============================================================================
 * SECCIONES DE LA PÁGINA DE INICIO (debajo del hero)
 * =============================================================================
 * Orden pensado como embudo (de "me interesa" a "reservo"):
 *
 *   TrustStrip        confianza inmediata (colegiatura, modalidades, seguros)
 *   HowItWorks        reduce la incertidumbre: 3 pasos
 *   DoctorsSection    ⭐ el centro: personas, no servicios
 *   VideoSpotlight    conexión humana antes de la cita
 *   PainGrid          otra entrada al embudo: "cada dolor tiene su especialista"
 *   Testimonials      prueba social, siempre ligada a un médico
 *   FinalCta          último empujón al cuestionario
 *
 * Todas usan <Reveal> para aparecer al hacer scroll.
 */

const container = "mx-auto max-w-page px-4 sm:px-8";

/* ------------------------------------------------------------------------- */
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

/* ------------------------------------------------------------------------- */
export function HowItWorks() {
  const steps = [
    { title: "Dinos qué te molesta", text: "Marca dónde y cómo te duele. Sin términos médicos: con tus propias palabras." },
    { title: "Conoce a tu especialista", text: "Ve su formación, su enfoque y un video de presentación antes de decidir." },
    { title: "Reserva en minutos", text: "Elige día y hora libres. Te confirmamos por WhatsApp y correo." },
  ];
  return (
    <section id="como" className={`${container} scroll-mt-8 pb-10 pt-[120px]`}>
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

/* ------------------------------------------------------------------------- */
export function DoctorsSection({ doctors, nextAvailable }: { doctors: Doctor[]; nextAvailable: Record<string, string> }) {
  return (
    <section className={`${container} pb-10 pt-[100px]`}>
      <Reveal className="flex flex-wrap items-end justify-between gap-6">
        <SectionHeading eyebrow="Nuestros médicos" className="max-w-[680px]">
          Primero, las personas. Conoce a <Accent>quien te va a atender.</Accent>
        </SectionHeading>
        <ButtonLink href={ROUTES.specialists} variant="ghost" size="sm" arrow>
          Ver todos los especialistas
        </ButtonLink>
      </Reveal>
      <Reveal className="mt-12 grid grid-cols-[repeat(auto-fit,minmax(min(270px,100%),1fr))] gap-6">
        {doctors.map((d) => (
          <DoctorCard key={d.slug} doctor={d} nextAvailable={nextAvailable[d.slug] ?? "Consultar"} />
        ))}
      </Reveal>
    </section>
  );
}

/* ------------------------------------------------------------------------- */
export function VideoSpotlight({ doctor }: { doctor: Doctor }) {
  return (
    <section className={`${container} pb-10 pt-[100px]`}>
      <Reveal className="grid grid-cols-[repeat(auto-fit,minmax(min(460px,100%),1fr))] overflow-hidden rounded-[32px] bg-night">
        <div className="relative flex min-h-[460px] items-center justify-center overflow-hidden bg-night-2">
          {doctor.photo && (
            <DoctorPortrait doctor={doctor} className="absolute inset-0 opacity-60" label={null} rings="none" />
          )}
          <svg viewBox="0 0 600 460" preserveAspectRatio="xMidYMid slice" aria-hidden="true" className="absolute inset-0 h-full w-full">
            {[260, 190, 120].map((r) => (
              <circle key={r} cx="300" cy="230" r={r} fill="none" stroke="rgba(234,242,239,.09)" strokeWidth={1} />
            ))}
          </svg>
          <span className="absolute bottom-5 left-6 text-[11px] font-semibold tracking-[1.2px] text-night-soft">
            VIDEO DE PRESENTACIÓN · 60 s
          </span>
          <VideoButton doctorName={doctor.name} videoUrl={doctor.videoUrl} />
        </div>

        <div className="flex flex-col justify-center gap-[22px] p-7 text-night-ice sm:p-14">
          <span className="text-[13px] font-semibold uppercase tracking-[1.6px] text-leaf-mint">Antes de tu cita</span>
          <h2 className="m-0 font-serif text-[clamp(34px,3.6vw,52px)] font-normal leading-[1.06]">
            Conoce {doctor.shortName.startsWith("el") ? "al" : "a la"} {doctor.name} en 60 segundos.
          </h2>
          <p className="m-0 max-w-[460px] text-[17px] leading-[1.65] text-night-muted">
            {doctor.bio} Cada médico de Aurora graba una presentación corta para que llegues a consulta sabiendo con
            quién vas a hablar.
          </p>
          <div className="mt-1.5 flex flex-wrap gap-3">
            <Magnetic>
              <ButtonLink
                href={ROUTES.booking({ medico: doctor.slug })}
                variant="light"
                trackAs={{ event: "cta_click", props: { location: "video_spotlight", doctor: doctor.slug } }}
              >
                Reservar con {doctor.shortName}
              </ButtonLink>
            </Magnetic>
            <ButtonLink href={ROUTES.doctor(doctor.slug)} variant="outline">
              Ver perfil completo
            </ButtonLink>
          </div>
        </div>
      </Reveal>
    </section>
  );
}

/* ------------------------------------------------------------------------- */
export function PainGrid() {
  return (
    <section className={`${container} pb-10 pt-[100px]`}>
      <Reveal>
        <SectionHeading eyebrow="Busca por molestia">Cada dolor tiene a su especialista.</SectionHeading>
      </Reveal>
      <Reveal className="mt-12 grid grid-cols-[repeat(auto-fit,minmax(min(360px,100%),1fr))] gap-4">
        {PAIN_ZONES.map((zone) => {
          const doc = getDoctorBySlug(zone.doctorSlug);
          return (
            <Link
              key={zone.id}
              data-reveal-item=""
              href={`${ROUTES.painFinder}?zona=${zone.id}`}
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

/* ------------------------------------------------------------------------- */
/**
 * Testimonios: SIEMPRE ligados a un médico ("Paciente de la Dra. Quispe")
 * para reforzar la confianza en la persona.
 * ⚠️ Usa solo testimonios reales y con consentimiento escrito del paciente.
 */
export function Testimonials({ doctors }: { doctors: Doctor[] }) {
  return (
    <section className={`${container} pb-10 pt-[100px]`}>
      <Reveal>
        <SectionHeading eyebrow="Pacientes">Historias con nombre y apellido.</SectionHeading>
      </Reveal>
      <Reveal className="mt-12 grid grid-cols-[repeat(auto-fit,minmax(min(320px,100%),1fr))] gap-6">
        {doctors.slice(0, 3).map((d) => (
          <figure key={d.slug} data-reveal-item="" className="m-0 flex flex-col gap-6 rounded-3xl border border-line-soft bg-white p-8">
            <QuoteMark />
            <blockquote className="m-0 font-serif text-2xl leading-[1.3]">[Testimonio real del paciente, 1–2 frases]</blockquote>
            <figcaption className="mt-auto flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-tint text-sm font-semibold text-teal">
                [N]
              </span>
              <span className="flex flex-col gap-0.5">
                <span className="text-[15px] font-semibold">[Nombre del paciente]</span>
                <span className="text-[13px] text-muted">Paciente {ofDoctor(d)}</span>
              </span>
            </figcaption>
          </figure>
        ))}
      </Reveal>
    </section>
  );
}

/* ------------------------------------------------------------------------- */
export function FinalCta() {
  return (
    <section className={`${container} pb-[120px] pt-[100px]`}>
      <Reveal className="relative grid grid-cols-[repeat(auto-fit,minmax(min(420px,100%),1fr))] items-center gap-12 overflow-hidden rounded-[36px] bg-night px-6 py-12 sm:px-14 sm:py-20 text-night-ice">
        <div className="relative flex flex-col gap-6">
          <h2 className="m-0 font-serif text-[clamp(40px,4.8vw,68px)] font-normal leading-[1.02] tracking-[-1px]">
            Tu próxima consulta empieza con una pregunta: <Accent tone="mint">¿qué te duele?</Accent>
          </h2>
          <div className="flex flex-wrap gap-3">
            <Magnetic>
              <ButtonLink
                href={ROUTES.painFinder}
                variant="light"
                size="lg"
                arrow
                trackAs={{ event: "cta_click", props: { location: "final_cta" } }}
              >
                Encontrar mi especialista
              </ButtonLink>
            </Magnetic>
            <a
              href={whatsappLink("Hola, quiero reservar una cita en Clínica Aurora")}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-[54px] items-center rounded-full border border-night-ice/35 px-6 text-base font-medium !text-night-ice no-underline hover:bg-night-ice/10"
            >
              Escribir por WhatsApp
            </a>
          </div>
        </div>
        <div className="relative flex justify-center">
          <LogoMark size={300} tone="dark" animate breathe className="max-w-full" />
        </div>
      </Reveal>
    </section>
  );
}
