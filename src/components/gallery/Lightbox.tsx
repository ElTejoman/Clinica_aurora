"use client";

import Image from "next/image";
import { useEffect, useRef, type KeyboardEvent, type MouseEvent, type TouchEvent } from "react";
import type { GalleryPhoto } from "@/models";
import { Icon } from "@/components/ui/Icon";

const SWIPE_THRESHOLD_PX = 50;

const navButton =
  "flex h-12 w-12 items-center justify-center rounded-full bg-night/60 text-white ring-1 ring-white/25 backdrop-blur-sm transition-colors hover:bg-night/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white";

/**
 * Visor de fotos a pantalla completa sobre `<dialog>` nativo: atrapa el foco,
 * cierra con Esc y devuelve el foco a la miniatura. Flechas ←/→ del teclado,
 * botones y deslizamiento en móvil para cambiar de foto; clic fuera para cerrar.
 */
export function Lightbox({
  photos,
  index,
  onClose,
  onNavigate,
}: {
  photos: readonly GalleryPhoto[];
  index: number | null;
  onClose: () => void;
  onNavigate: (step: 1 | -1) => void;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const touchStartX = useRef<number | null>(null);
  const isOpen = index !== null;

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (isOpen && !dialog.open) dialog.showModal();
    if (!isOpen && dialog.open) dialog.close();
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const root = document.documentElement;
    const previous = root.style.overflow;
    root.style.overflow = "hidden";
    return () => {
      root.style.overflow = previous;
    };
  }, [isOpen]);

  const handleKeyDown = (e: KeyboardEvent<HTMLDialogElement>) => {
    if (e.key === "ArrowRight") onNavigate(1);
    if (e.key === "ArrowLeft") onNavigate(-1);
  };
  const handleBackdropClick = (e: MouseEvent<HTMLDialogElement>) => {
    if (e.target === e.currentTarget) onClose();
  };
  const handleTouchEnd = (e: TouchEvent) => {
    const start = touchStartX.current;
    const end = e.changedTouches[0]?.clientX;
    touchStartX.current = null;
    if (start === null || end === undefined || Math.abs(end - start) < SWIPE_THRESHOLD_PX) return;
    onNavigate(end < start ? 1 : -1);
  };

  const photo = isOpen ? photos[index] : undefined;
  const position = (index ?? 0) + 1;

  return (
    <dialog
      ref={dialogRef}
      aria-label="Galería de fotos"
      onClose={onClose}
      onKeyDown={handleKeyDown}
      onClick={handleBackdropClick}
      onTouchStart={(e) => (touchStartX.current = e.touches[0]?.clientX ?? null)}
      onTouchEnd={handleTouchEnd}
      className="m-0 h-full max-h-none w-full max-w-none bg-transparent p-0 backdrop:bg-night/90 backdrop:backdrop-blur-sm"
    >
      {photo && (
        <div className="pointer-events-none flex h-full flex-col items-center justify-center gap-4 px-4 py-16 sm:px-20">
          <figure className="pointer-events-auto m-0 flex h-full w-full max-w-[1100px] flex-col items-center gap-4">
            <div className="relative w-full flex-1">
              <Image key={photo.src} src={photo.src} alt={photo.alt} fill sizes="100vw" className="object-contain" />
            </div>
            <figcaption className="flex items-center gap-3 text-white">
              <span className="font-display text-lg font-semibold">{photo.caption}</span>
              <span className="text-sm text-white/60" aria-label={`Foto ${position} de ${photos.length}`}>
                {position} / {photos.length}
              </span>
            </figcaption>
          </figure>
        </div>
      )}
      <button type="button" autoFocus onClick={onClose} aria-label="Cerrar galería" className={`${navButton} absolute right-4 top-4`}>
        <Icon name="close" size={22} />
      </button>
      <button type="button" onClick={() => onNavigate(-1)} aria-label="Foto anterior" className={`${navButton} absolute left-3 top-1/2 -translate-y-1/2 sm:left-6`}>
        <Icon name="chevronLeft" size={24} />
      </button>
      <button type="button" onClick={() => onNavigate(1)} aria-label="Foto siguiente" className={`${navButton} absolute right-3 top-1/2 -translate-y-1/2 sm:right-6`}>
        <Icon name="chevronRight" size={24} />
      </button>
    </dialog>
  );
}
