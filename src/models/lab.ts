/** Indicaciones previas a un análisis. */
export interface LabPreparation {
  /** Etiqueta corta para la lista: "Ayuno de 8 h", "Sin preparación"… */
  summary: string;
  /** Indicaciones completas, cuando hay más que decir que la etiqueta. */
  details?: string;
}

/** Una prueba del tarifario de laboratorio. */
export interface LabTest {
  name: string;
  /** Soles, precio al paciente. */
  price: number;
  /** Entrega de resultados: "1 día hábil", "8 horas"… */
  resultIn: string;
  preparation: LabPreparation;
  /** Entre los más solicitados (lo marca el servicio a partir de data/lab-popular.ts). */
  popular?: boolean;
}
