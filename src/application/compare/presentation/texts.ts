/** Textos de la pantalla Comparar, tal como están hoy. */
export const COMPARE_TEXTS = {
  title: "Comparar",
  subtitle:
    "Varias monedas en el mismo gráfico, todas partiendo de cero, para ver cuál lo ha hecho mejor",

  picker: {
    title: "Qué comparar",
    errorTitle: "No se pudo cargar la lista de monedas",
    /** Para lectores de pantalla, mientras se pinta el skeleton. */
    loadingLabel: "Cargando la lista de monedas",
    noneSelected: "Aún no has elegido ninguna moneda.",
    addLabel: "Añadir moneda",
    addPlaceholder: "Elige una criptomoneda",
    fullPlaceholder: "Quita una para añadir otra",
    fullLabel: (max: number) => `Máximo ${max} monedas`,
    hint: (max: number) => `Puedes comparar hasta ${max} a la vez`,
    optionLabel: (name: string, symbol: string) => `${name} (${symbol})`,
    removeLabel: (name: string) => `Quitar ${name} de la comparación`,
  },

  range: {
    title: "Periodo",
    ariaLabel: "Periodo de la comparación",
    /** Acción de los vacíos: recibe la etiqueta del rango (`RANGES[n].label`). */
    widenAction: (rangeLabel: string) => `Ampliar a ${rangeLabel}`,
  },

  chart: {
    title: "Variación desde el inicio del periodo",
    errorTitle: "No se pudo cargar el histórico",
    /** Para lectores de pantalla, mientras se pinta el skeleton. */
    loadingLabel: "Cargando la comparación",
    emptySelectionTitle: "Elige al menos una moneda",
    emptySelectionDescription:
      "Añade monedas arriba y verás sus curvas superpuestas, cada una partiendo de cero.",
    emptyNoCommonTitle: "Sin datos en común",
    emptyNoCommonDescription:
      "Estas monedas no tienen histórico coincidente en el periodo elegido. Prueba con un periodo más amplio.",
  },

  ranking: {
    title: "Quién lo ha hecho mejor",
    /** Para lectores de pantalla, mientras se pinta el skeleton. */
    loadingLabel: "Cargando la clasificación",
  },
} as const;
