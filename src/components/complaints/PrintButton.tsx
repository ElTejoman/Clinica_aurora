"use client";

import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";

/** Abre el diálogo de impresión (permite "Guardar como PDF"). */
export function PrintButton() {
  return (
    <Button onClick={() => window.print()} className="print:hidden">
      <Icon name="printer" />
      Imprimir o guardar como PDF
    </Button>
  );
}
