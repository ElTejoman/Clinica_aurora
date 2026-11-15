/** Ilustración de libro abierto (Libro de Reclamaciones). Decorativa. */
export function OpenBook({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 240 170" className={className} aria-hidden="true">
      <ellipse cx="120" cy="158" rx="96" ry="9" fill="#17616B" opacity=".12" />
      <path d="M120 30c-24-14-58-18-96-12v118c38-6 72-2 96 12z" fill="#FFFFFF" stroke="#17616B" strokeWidth="3" strokeLinejoin="round" />
      <path d="M120 30c24-14 58-18 96-12v118c-38-6-72-2-96 12z" fill="#EEF5F4" stroke="#17616B" strokeWidth="3" strokeLinejoin="round" />
      <path d="M120 30v118" stroke="#17616B" strokeWidth="3" />
      <g stroke="#9FC1B6" strokeWidth="3" strokeLinecap="round">
        <path d="M42 46c20-3 40-2 60 5M42 64c20-3 40-2 60 5M42 82c20-3 40-2 60 5M42 100c20-3 40-2 60 5" />
        <path d="M138 51c20-7 40-8 60-5M138 69c20-7 40-8 60-5M138 87c20-7 40-8 60-5" />
      </g>
      <path d="M150 104l12 12 26-28" fill="none" stroke="#4C7942" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
