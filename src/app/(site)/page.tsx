import { Hero } from "@/components/home/Hero";
import {
  DoctorsSection,
  FinalCta,
  HowItWorks,
  PainGrid,
  Testimonials,
  TrustStrip,
  VideoSpotlight,
} from "@/components/home/HomeSections";
import { getFeaturedDoctors, getHeroDoctor, getSpotlightDoctor } from "@/data/doctors";
import { getDoctorAvailability, getNextAvailableMap } from "@/services/availability";

/**
 * =============================================================================
 * PÁGINA 01 · INICIO   (ruta: /)
 * =============================================================================
 * Componente de SERVIDOR: obtiene datos (médicos + disponibilidad) y los pasa
 * a las secciones. Las partes interactivas (3D, animaciones, buscador) son
 * componentes cliente dentro de esas secciones.
 *
 * `revalidate`: la página se genera estática y se regenera cada 5 minutos,
 * para que "Próxima cita" y "Disponible hoy" no queden desactualizados.
 * Si conectas una agenda en tiempo real y necesitas exactitud al minuto,
 * cambia a `export const dynamic = "force-dynamic"`.
 */
export const revalidate = 300;

export default async function HomePage() {
  const heroDoctor = getHeroDoctor();
  const featured = getFeaturedDoctors(4);
  const spotlight = getSpotlightDoctor();

  const [heroDays, nextAvailable] = await Promise.all([
    getDoctorAvailability(heroDoctor.slug, 1),
    getNextAvailableMap(featured.map((d) => d.slug)),
  ]);

  return (
    <>
      <Hero doctor={heroDoctor} day={heroDays[0]} />
      <TrustStrip />
      <HowItWorks />
      <DoctorsSection doctors={featured} nextAvailable={nextAvailable} />
      <VideoSpotlight doctor={spotlight} />
      <PainGrid />
      <Testimonials doctors={featured} />
      <FinalCta />
    </>
  );
}
