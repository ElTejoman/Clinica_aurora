"use client";

import { useRef } from "react";
import { PlayIcon } from "@/components/ui/Icon";
import { Magnetic } from "@/components/motion/Magnetic";
import { track } from "@/lib/analytics";
import { cn } from "@/lib/cn";

/**
 * <VideoButton> — Botón "play" + reproductor en ventana modal
 * =============================================================================
 * Usa el elemento nativo <dialog> (accesible: atrapa el foco, se cierra con
 * Esc). Acepta:
 *   - un MP4 propio ("/videos/martin-salazar.mp4")
 *   - un enlace de YouTube/Vimeo en formato embed
 *     ("https://www.youtube-nocookie.com/embed/ID", "https://player.vimeo.com/video/ID")
 *
 * Si el médico aún no tiene `videoUrl`, el botón se ve igual pero avisa que
 * el video está pendiente (útil durante la maqueta).
 *
 * Variantes visuales:
 *   "large" → círculo grande del bloque de inicio
 *   "pill"  → pastilla "Conócela en 60 s" sobre el retrato del perfil
 */
export function VideoButton({
  doctorName,
  videoUrl,
  variant = "large",
  label,
  className,
}: {
  doctorName: string;
  videoUrl?: string;
  variant?: "large" | "pill";
  label?: string;
  className?: string;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const isEmbed = videoUrl ? /youtube|vimeo/.test(videoUrl) : false;

  const open = () => {
    track("cta_click", { location: "video", doctor: doctorName });
    if (videoUrl) dialogRef.current?.showModal();
  };

  return (
    <>
      <Magnetic className={cn("relative inline-flex", className)}>
        {variant === "large" ? (
          <button
            type="button"
            onClick={open}
            aria-label={`Reproducir video de presentación de ${doctorName}`}
            title={videoUrl ? undefined : "Video pendiente de grabar"}
            className="relative flex h-[104px] w-[104px] cursor-pointer items-center justify-center rounded-full border-0 bg-night-ice text-night shadow-[0_0_0_14px_rgba(234,242,239,.12),0_0_0_30px_rgba(234,242,239,.06)]"
          >
            <PlayIcon className="ml-1" />
          </button>
        ) : (
          <button
            type="button"
            onClick={open}
            aria-label={`Ver video de presentación de ${doctorName}`}
            title={videoUrl ? undefined : "Video pendiente de grabar"}
            className="inline-flex h-12 cursor-pointer items-center gap-2.5 rounded-full border-0 bg-white py-0 pl-2 pr-[18px] text-sm font-semibold text-ink shadow-[0_10px_30px_-12px_rgba(16,41,43,.4)]"
          >
            <span className="flex h-[34px] w-[34px] items-center justify-center rounded-full bg-teal text-white">
              <PlayIcon size={14} className="ml-0.5" />
            </span>
            {label ?? "Ver video"}
          </button>
        )}
      </Magnetic>

      {videoUrl && (
        <dialog
          ref={dialogRef}
          className="w-[min(960px,92vw)] rounded-3xl border-0 bg-night p-0 backdrop:bg-ink/70"
          onClick={(e) => e.target === dialogRef.current && dialogRef.current?.close()}
        >
          <div className="relative aspect-video w-full">
            {isEmbed ? (
              <iframe
                src={videoUrl}
                title={`Presentación de ${doctorName}`}
                allow="autoplay; encrypted-media; picture-in-picture"
                allowFullScreen
                className="absolute inset-0 h-full w-full"
              />
            ) : (
              <video src={videoUrl} controls autoPlay className="absolute inset-0 h-full w-full" />
            )}
          </div>
          <form method="dialog" className="absolute right-3 top-3">
            <button className="h-11 rounded-full bg-white/90 px-4 text-sm font-semibold text-ink">Cerrar</button>
          </form>
        </dialog>
      )}
    </>
  );
}
