import { Hero } from "@/components/home/Hero";
import { DoctorsSection } from "@/components/home/sections/DoctorsSection";
import { FinalCta } from "@/components/home/sections/FinalCta";
import { HowItWorks } from "@/components/home/sections/HowItWorks";
import { PainGrid } from "@/components/home/sections/PainGrid";
import { Testimonials } from "@/components/home/sections/Testimonials";
import { TrustStrip } from "@/components/home/sections/TrustStrip";
import { VideoSpotlight } from "@/components/home/sections/VideoSpotlight";
import { doctorService, painFinderService } from "@/services/container";

/**
 * PÁGINA 01 · INICIO   (ruta: /)
 *
 * Orden pensado como embudo, de "me interesa" a "reservo":
 *   Hero → TrustStrip → HowItWorks → DoctorsSection (las personas, no los
 *   servicios) → VideoSpotlight → PainGrid → Testimonials → FinalCta
 *
 * Se genera como HTML estático en el build. Lo que depende de la hora
 * ("Disponible hoy", "Próxima cita") lo calculan islas cliente en el navegador.
 */
export default function HomePage() {
  const featured = doctorService.getFeatured();

  return (
    <>
      <Hero doctor={doctorService.getHeroDoctor()} />
      <TrustStrip />
      <HowItWorks />
      <DoctorsSection doctors={featured} />
      <VideoSpotlight doctor={doctorService.getSpotlightDoctor()} />
      <PainGrid zones={painFinderService.getZones()} recommendations={painFinderService.getRecommendations()} />
      <Testimonials doctors={featured} />
      <FinalCta />
    </>
  );
}
