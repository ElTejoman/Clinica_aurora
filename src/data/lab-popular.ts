/**
 * Los análisis más solicitados: se muestran primero en el tarifario, en este
 * orden y con la etiqueta "Más solicitado". Nombres exactos de LAB_TESTS (un
 * test falla si alguno no existe). Base: chequeos preventivos habituales en
 * Perú (MINSA/EsSalud: glucosa, perfil lipídico, triglicéridos, hemograma,
 * creatinina, orina) y controles de rutina (tiroides, diabetes, hígado,
 * vitamina D, parasitológico). Cámbialo con los datos reales de la clínica.
 */
export const POPULAR_LAB_TESTS: readonly string[] = [
  "Hemograma",
  "Glucosa",
  "Perfil lipídico",
  "Colesterol total",
  "Triglicéridos",
  "Hemoglobina glicosilada",
  "Orina completa",
  "Creatinina",
  "Urea",
  "Ácido úrico",
  "Perfil hepático",
  "TSH ultrasensible",
  "Perfil tiroideo (T3, T4, T4 libre, TSH)",
  "Vitamina D total (25-hidroxivitamina D2 + D3)",
  "Parasitológico seriado",
];
