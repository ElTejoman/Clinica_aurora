import { HeroSlider } from "@/components/home/HeroSlider";
import { Affiliations } from "@/components/home/sections/Affiliations";
import { Gallery } from "@/components/home/sections/Gallery";
import { QuickActions } from "@/components/home/sections/QuickActions";
import { ServicesGrid } from "@/components/home/sections/ServicesGrid";
import { WellbeingCta } from "@/components/home/sections/WellbeingCta";
import { WhyChoose } from "@/components/home/sections/WhyChoose";
import { WelcomeIntro } from "@/components/home/WelcomeIntro";
import { ReviewsSection } from "@/components/reviews/ReviewsSection";
import { HOME_BANNERS } from "@/data/clinic";
import { catalogService, doctorService } from "@/services/container";

/**
 * PÁGINA 01 · INICIO   (ruta: /)
 * Estructura del sitio actual de la clínica, con mejor acabado:
 *   banners → titular → servicios → ¿qué deseas realizar hoy? → respaldo →
 *   galería → por qué elegirnos (partículas 3D) → testimonios → cierre.
 */
export default function HomePage() {
  return (
    <>
      <HeroSlider banners={HOME_BANNERS} />
      <WelcomeIntro services={catalogService.getServices()} />
      <ServicesGrid services={catalogService.getServices()} />
      <QuickActions staff={doctorService.getAll()} />
      <Affiliations />
      <Gallery />
      <WhyChoose />
      <ReviewsSection reviews={catalogService.getReviews()} rating={catalogService.getRating()} />
      <div className="pt-24">
        <WellbeingCta />
      </div>
    </>
  );
}
