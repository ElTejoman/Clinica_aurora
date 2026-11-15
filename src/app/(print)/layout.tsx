/** Layout de páginas para imprimir: sin cabecera, pie ni animaciones. */
export default function PrintLayout({ children }: { children: React.ReactNode }) {
  return <div className="min-h-screen bg-mist print:bg-white">{children}</div>;
}
