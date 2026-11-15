import Image from "next/image";
import type { ReactNode } from "react";
import type { Doctor } from "@/models";
import { cn } from "@/utils/cn";

/**
 * <DoctorPortrait> — Foto del médico (o marcador con iniciales)
 * =============================================================================
 * El sitio está centrado en los MÉDICOS, así que la foto es lo más importante
 * de cada tarjeta. Mientras no tengas fotos, se muestra un marcador elegante
 * con las iniciales y la etiqueta "FOTO".
 *
 * 📸 Para usar fotos reales:
 *   1. Guarda la foto en /public/doctors/<slug>.webp (vertical, ~1200px de alto,
 *      fondo neutro, misma luz para todos los médicos).
 *   2. Pon `photo: "/doctors/<slug>.webp"` en src/data/doctors.ts.
 *   El sitio es estático (sin optimizador de imágenes en el servidor):
 *   comprime la foto antes de subirla (WebP, < 250 KB).
 *
 * El contenedor define el tamaño (pásalo en `className`, ej. "aspect-[4/4.4]").
 */
export function DoctorPortrait({
  doctor,
  className,
  initialsSize = 96,
  label = "FOTO",
  rings = "corner",
  sizes = "(max-width: 768px) 100vw, 400px",
  priority,
  children,
}: {
  doctor: Pick<Doctor, "name" | "initials" | "tint" | "photo">;
  className?: string;
  /** Tamaño en px de las iniciales del marcador. */
  initialsSize?: number;
  /** Texto del marcador (null para ocultarlo). */
  label?: string | null;
  /** Patrón decorativo de círculos: esquina inferior, superior o ninguno. */
  rings?: "corner" | "top" | "none";
  sizes?: string;
  priority?: boolean;
  /** Elementos superpuestos (etiquetas, botón de video…). */
  children?: ReactNode;
}) {
  return (
    <div
      className={cn("relative flex items-center justify-center overflow-hidden", className)}
      style={{ background: doctor.tint }}
    >
      {doctor.photo ? (
        <Image src={doctor.photo} alt={`Foto de ${doctor.name}`} fill sizes={sizes} priority={priority} className="object-cover" />
      ) : (
        <>
          {rings !== "none" && (
            <svg
              viewBox="0 0 300 330"
              preserveAspectRatio="xMidYMid slice"
              aria-hidden="true"
              className="absolute inset-0 h-full w-full"
            >
              {[150, 100, 50].map((r) => (
                <circle
                  key={r}
                  cx={rings === "corner" ? 40 : 240}
                  cy={rings === "corner" ? 300 : 50}
                  r={r}
                  fill="none"
                  stroke="rgba(23,97,107,.12)"
                  strokeWidth={1}
                  data-draw=""
                />
              ))}
            </svg>
          )}
          <span
            className="relative font-display leading-none text-teal"
            style={{ fontSize: initialsSize }}
            aria-label={`Foto pendiente de ${doctor.name}`}
            role="img"
          >
            {doctor.initials}
          </span>
          {label && (
            <span className="absolute bottom-3 left-3.5 text-[11px] font-semibold tracking-[1.2px] text-subink">
              {label}
            </span>
          )}
        </>
      )}
      {children}
    </div>
  );
}
