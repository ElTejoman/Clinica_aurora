import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AuroraWave } from "@/components/three/AuroraWave";
import { Intro } from "@/components/motion/Intro";
import { Reveal } from "@/components/motion/Reveal";
import { SplitLines } from "@/components/motion/SplitLines";
import { DoctorPortrait } from "@/components/ui/DoctorPortrait";
import { Icon } from "@/components/ui/Icon";
import { LiveDot } from "@/components/ui/SectionHeading";
import { VideoButton } from "@/components/home/VideoButton";
import { BookingWidget } from "@/components/profile/BookingWidget";
import { RelatedDoctorCard } from "@/components/doctors/DoctorCard";
import { formatModes, getDoctorBySlug, getDoctors, getRelatedDoctors } from "@/data/doctors";
import { getDoctorAvailability } from "@/services/availability";
import { ROUTES, SITE } from "@/lib/site";

/**
 * =============================================================================
 * PÁGINA 04 · PERFIL DEL MÉDICO   (ruta: /especialistas/[slug])
 * =============================================================================
 * Una página por médico, generada a partir de src/data/doctors.ts.
 * Es la página que más convierte: aquí el visitante decide CON QUIÉN.
 *
 * Contenido:
 *   Hero      retrato + video 60 s + nombre + enfoque + credenciales + datos clave
 *   Cuerpo    lo que trata · cómo es la primera consulta · formación · reseñas
 *   Lateral   <BookingWidget> fijo (elige día/hora y reserva)
 *   Final     "También te puede ayudar" (derivación cruzada)
 *
 * SEO:
 *   - generateStaticParams: pre-genera todos los perfiles en el build.
 *   - generateMetadata: título y descripción por médico.
 *   - JSON-LD schema.org/Physician para resultados enriquecidos en Google.
 */

export const revalidate = 300;

export function generateStaticParams() {
  return getDoctors().map((d) => ({ slug: d.slug }));
}

type Params = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const doctor = getDoctorBySlug(slug);
  if (!doctor) return {};
  return {
    title: `${doctor.name} · ${doctor.specialty}`,
    description: doctor.bio,
    alternates: { canonical: ROUTES.doctor(doctor.slug) },
  };
}

export default async function DoctorPage({ params }: Params) {
  const { slug } = await params;
  const doctor = getDoctorBySlug(slug);
  if (!doctor) notFound();

  const days = await getDoctorAvailability(doctor.slug, 5);
  const related = getRelatedDoctors(doctor);
  const atiendeHoy = days[0]?.dow === "HOY";
  // Titular en dos líneas: "Dra. Valeria" / "Quispe" (la 2ª en cursiva teal)
  const nameParts = doctor.name.split(" ");
  const line2 = nameParts.pop() ?? "";
  const line1 = nameParts.join(" ");

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Physician",
    name: doctor.name,
    medicalSpecialty: doctor.specialty,
    description: doctor.bio,
    url: `${SITE.url}${ROUTES.doctor(doctor.slug)}`,
    worksFor: { "@type": "MedicalClinic", name: SITE.name, address: SITE.address },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* =================== HERO DEL PERFIL =================== */}
      <section className="relative">
        {/* La máscara desvanece la ola hacia la derecha para que no pase por detrás del texto */}
        <AuroraWave
          variant="profile"
          className="absolute inset-x-0 top-[140px] h-[460px] w-full [mask-image:linear-gradient(90deg,#000_0%,#000_30%,transparent_52%)]"
        />
        <Intro>
          <div className="relative mx-auto flex max-w-page flex-col gap-7 px-4 sm:px-8 pb-16 pt-5">
            <nav aria-label="Ruta" className="flex flex-wrap gap-2 text-[13px] text-muted">
              <Link href={ROUTES.specialists} className="no-underline">
                Especialistas
              </Link>
              <span aria-hidden="true">/</span>
              <span>{doctor.specialty}</span>
              <span aria-hidden="true">/</span>
              <span className="font-medium text-ink" aria-current="page">
                {doctor.name}
              </span>
            </nav>

            <div className="grid grid-cols-[repeat(auto-fit,minmax(min(420px,100%),1fr))] items-end gap-12">
              <div data-fade="">
                <DoctorPortrait
                  doctor={doctor}
                  className="aspect-[5/5.4] max-w-[560px] rounded-[32px]"
                  initialsSize={200}
                  label="FOTO PROFESIONAL · RETRATO VERTICAL"
                  rings="top"
                  priority
                  sizes="(max-width: 900px) 100vw, 560px"
                >
                  <div className="absolute bottom-5 right-5">
                    <VideoButton
                      doctorName={doctor.name}
                      videoUrl={doctor.videoUrl}
                      variant="pill"
                      label={`Conóce${doctor.name.startsWith("Dra") ? "la" : "lo"} en 60 s`}
                    />
                  </div>
                </DoctorPortrait>
              </div>

              <div className="flex flex-col gap-[22px] pb-2">
                {atiendeHoy && (
                  <span data-fade="" className="inline-flex items-center gap-2 self-start rounded-full border border-line bg-white px-3 py-[7px] text-xs font-semibold text-leaf-ink">
                    <LiveDot />
                    Atiende hoy
                  </span>
                )}
                <span data-fade="" className="eyebrow">
                  {doctor.specialty}
                  {doctor.subspecialty && ` · ${doctor.subspecialty}`}
                </span>
                <h1 className="m-0 font-serif text-[clamp(52px,6.4vw,96px)] font-normal leading-[.96] tracking-[-2px]">
                  <SplitLines
                    lines={[
                      line1,
                      <em key="l2" className="italic text-teal">
                        {line2}
                      </em>,
                    ]}
                  />
                </h1>
                <p data-fade="" className="m-0 max-w-[520px] text-lg leading-relaxed text-muted">
                  {doctor.bio}
                </p>
                <ul data-fade="" className="m-0 flex list-none flex-wrap gap-2.5 p-0 text-sm text-subink">
                  {[`CMP ${doctor.cmp} · RNE ${doctor.rne}`, formatModes(doctor.modes), `Idiomas: ${doctor.languages}`].map((t) => (
                    <li key={t} className="inline-flex h-9 items-center rounded-full border border-line bg-white px-3.5">
                      {t}
                    </li>
                  ))}
                </ul>
                {/* Datos clave: rellenar con datos reales (nunca inventar cifras) */}
                <dl data-fade="" className="m-0 flex flex-wrap gap-8 border-t border-line pt-2">
                  {[
                    [doctor.yearsExperience, "años de experiencia"],
                    [`S/ ${doctor.price}`, `consulta · ${doctor.durationMin} min`],
                    ["[N]", "reseñas verificadas"],
                  ].map(([value, label]) => (
                    <div key={label} className="flex flex-col-reverse gap-0.5 pt-4">
                      <dt className="text-[13px] text-muted">{label}</dt>
                      <dd className="m-0 font-serif text-4xl leading-none">{value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </div>
          </div>
        </Intro>
      </section>

      {/* =================== CUERPO + RESERVA =================== */}
      <div className="mx-auto flex max-w-page flex-wrap items-start gap-12 px-4 sm:px-8 pb-20 pt-10">
        <div className="flex min-w-0 flex-[999_1_600px] flex-col gap-[88px]">
          <Reveal as="section" className="flex flex-col gap-6" stagger={70}>
            <h2 className="m-0 font-serif text-[44px] font-normal leading-[1.05]">Lo que trata</h2>
            <div className="grid grid-cols-[repeat(auto-fit,minmax(min(220px,100%),1fr))] gap-3">
              {doctor.conditions.map((c) => (
                <Link
                  key={c}
                  data-reveal-item=""
                  href={ROUTES.booking({ medico: doctor.slug, motivo: c })}
                  className="flex min-h-[60px] items-center justify-between gap-3 rounded-2xl border border-line bg-white px-[18px] text-[15px] font-medium !text-ink no-underline transition-colors hover:border-teal"
                >
                  {c}
                  <Icon name="arrowRight" className="flex-none text-teal" />
                </Link>
              ))}
            </div>
          </Reveal>

          <Reveal as="section" className="flex flex-col gap-6">
            <h2 className="m-0 font-serif text-[44px] font-normal leading-[1.05]">Cómo es tu primera consulta</h2>
            <ol className="m-0 grid list-none grid-cols-[repeat(auto-fit,minmax(min(220px,100%),1fr))] gap-4 p-0">
              {[
                ["Te escucha", "Cuándo empezó, qué lo empeora y qué ya probaste."],
                ["Te examina", "Evaluación física y, si hace falta, pide exámenes."],
                ["Sales con un plan", "Diagnóstico, tratamiento y próximos pasos por escrito."],
              ].map(([title, text], i) => (
                <li key={title} data-reveal-item="" className="flex flex-col gap-2.5 rounded-[20px] bg-mist p-6">
                  <span className="font-serif text-[40px] leading-none text-teal">0{i + 1}</span>
                  <span className="text-[17px] font-semibold">{title}</span>
                  <span className="text-[15px] leading-relaxed text-muted">{text}</span>
                </li>
              ))}
            </ol>
          </Reveal>

          <Reveal as="section" className="flex flex-col gap-6">
            <h2 className="m-0 font-serif text-[44px] font-normal leading-[1.05]">Formación</h2>
            <div className="relative flex flex-col gap-7 pl-9">
              {/* Línea vertical que se dibuja al aparecer */}
              <svg viewBox="0 0 4 300" preserveAspectRatio="none" aria-hidden="true" className="absolute left-[7px] top-2 h-[calc(100%-16px)] w-1">
                <path data-draw="" d="M2 0 V300" fill="none" stroke="#9FC1B6" strokeWidth={2} />
              </svg>
              {doctor.education.map((e) => (
                <div key={e.title} data-reveal-item="" className="relative flex flex-col gap-1">
                  <span className="absolute -left-9 top-1 h-[18px] w-[18px] rounded-full border-2 border-teal bg-ground" aria-hidden="true" />
                  <span className="text-[13px] font-semibold text-leaf">{e.year}</span>
                  <span className="text-lg font-semibold">{e.title}</span>
                  <span className="text-[15px] text-muted">{e.place}</span>
                </div>
              ))}
            </div>
          </Reveal>

          <Reveal as="section" className="flex flex-col gap-6">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <h2 className="m-0 font-serif text-[44px] font-normal leading-[1.05]">Reseñas de pacientes</h2>
              <span className="text-sm text-muted">Solo pacientes con cita atendida</span>
            </div>
            {/* TODO: conectar reseñas reales (p. ej. una tabla `reviews` con la cita atendida). */}
            <div className="grid grid-cols-[repeat(auto-fit,minmax(min(280px,100%),1fr))] gap-4">
              {[0, 1].map((i) => (
                <figure key={i} data-reveal-item="" className="m-0 flex flex-col gap-[18px] rounded-[20px] border border-line-soft bg-white p-7">
                  <blockquote className="m-0 font-serif text-2xl leading-[1.3]">[Reseña real del paciente]</blockquote>
                  <figcaption className="text-sm text-muted">[Nombre] · [Motivo de consulta]</figcaption>
                </figure>
              ))}
            </div>
          </Reveal>
        </div>

        <aside aria-label={`Reservar con ${doctor.name}`} className="top-6 min-w-0 flex-[1_1_360px] lg:sticky">
          <BookingWidget doctor={doctor} days={days} />
        </aside>
      </div>

      {/* =================== DERIVACIÓN CRUZADA =================== */}
      {related.length > 0 && (
        <section className="mx-auto max-w-page px-4 sm:px-8 pb-[120px]">
          <Reveal className="flex flex-col gap-6">
            <h2 className="m-0 font-serif text-[44px] font-normal leading-[1.05]">También te puede ayudar</h2>
            <div className="grid grid-cols-[repeat(auto-fit,minmax(min(300px,100%),1fr))] gap-4">
              {related.map((d) => (
                <RelatedDoctorCard key={d.slug} doctor={d} />
              ))}
            </div>
          </Reveal>
        </section>
      )}
    </>
  );
}
