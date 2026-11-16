"use client";

import { useEffect, useRef } from "react";

const LOADER_URL = "https://cdn.trustindex.io/loader.js";

/**
 * Widget de reseñas de Trustindex. Su script se inserta DENTRO del contenedor
 * y el widget aparece en ese mismo lugar. El diseño (una fila en carrusel,
 * colores, cantidad) se configura en el panel de Trustindex, no aquí.
 * El ID llega validado (solo letras y números) desde config/env.ts.
 */
export function TrustindexWidget({ widgetId }: { widgetId: string }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const script = document.createElement("script");
    script.src = `${LOADER_URL}?${widgetId}`;
    script.defer = true;
    script.async = true;
    container.appendChild(script);
    return () => {
      container.replaceChildren();
    };
  }, [widgetId]);

  return <div ref={containerRef} className="min-h-[220px]" />;
}
