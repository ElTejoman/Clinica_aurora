import { CheckoutHeader } from "@/components/layout/CheckoutHeader";

/**
 * Layout del paso final del embudo (/reservar): cabecera mínima y sin pie,
 * para que nada distraiga de terminar la reserva.
 */
export default function CheckoutLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen overflow-x-hidden bg-ground">
      <CheckoutHeader />
      {children}
    </div>
  );
}
