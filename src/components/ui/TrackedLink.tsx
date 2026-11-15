"use client";

import Link from "next/link";
import type { ComponentPropsWithoutRef } from "react";
import { track, type FunnelEvent } from "@/lib/analytics";

/** Enlace sin estilo propio que envía un evento de analítica al hacer clic. */
export function TrackedLink({
  trackAs,
  onClick,
  ...rest
}: ComponentPropsWithoutRef<typeof Link> & { trackAs: { event: FunnelEvent; props?: Record<string, string> } }) {
  return (
    <Link
      onClick={(e) => {
        track(trackAs.event, trackAs.props);
        onClick?.(e);
      }}
      {...rest}
    />
  );
}
