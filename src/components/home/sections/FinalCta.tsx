import { Reveal } from "@/components/motion/Reveal";
import { Magnetic } from "@/components/motion/Magnetic";
import { LogoMark } from "@/components/brand/Logo";
import { ButtonLink } from "@/components/ui/Button";
import { ROUTES } from "@/config/routes";
import { SITE } from "@/config/site";
import { whatsappUrl } from "@/utils/whatsapp";
import { pageContainer } from "@/components/ui/styles";
import { Accent } from "@/components/ui/SectionHeading";

export function FinalCta() {
  return (
    <section className={`${pageContainer} pb-[120px] pt-[100px]`}>
      <Reveal className="relative grid grid-cols-[repeat(auto-fit,minmax(min(420px,100%),1fr))] items-center gap-12 overflow-hidden rounded-[36px] bg-night px-6 py-12 sm:px-14 sm:py-20 text-night-ice">
        <div className="relative flex flex-col gap-6">
          <h2 className="m-0 font-serif text-[clamp(40px,4.8vw,68px)] font-normal leading-[1.02] tracking-[-1px]">
            Tu próxima consulta empieza con una pregunta: <Accent tone="mint">¿qué te duele?</Accent>
          </h2>
          <div className="flex flex-wrap gap-3">
            <Magnetic>
              <ButtonLink
                href={ROUTES.painFinder()}
                variant="light"
                size="lg"
                arrow
                trackAs={{ event: "cta_click", props: { location: "final_cta" } }}
              >
                Encontrar mi especialista
              </ButtonLink>
            </Magnetic>
            <a
              href={whatsappUrl(SITE.whatsapp, "Hola, quiero reservar una cita en Clínica Aurora")}
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
