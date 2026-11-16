/** Foto de la galería del inicio. */
export interface GalleryPhoto {
  src: string;
  alt: string;
  /** Leyenda corta visible sobre la foto ("Sueroterapia"). */
  caption: string;
  /** Las verticales ocupan dos filas del mosaico. */
  orientation: "portrait" | "landscape";
}
