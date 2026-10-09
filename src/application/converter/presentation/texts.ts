import type { NoConversionReason } from "../../../domain/converter/conversion.ts";
import type { Convertible } from "../../../domain/converter/convertible.ts";

/**
 * Textos del Convertidor, tal como estaban en la interfaz anterior
 * (`src/pages/Converter.tsx`, `src/components/converter/*`). Los marcados como
 * «nuevo» son de estados que antes no existían.
 *
 * Aparte siguen: `unitPriceText`, `resultText` y `summaryText` (`conversionText.ts`)
 * y el aviso `COPY_FAILED` (`../useCases.ts`).
 */
export const CONVERTER_TEXTS = {
  title: "Convertidor",
  subtitle: "Entre criptomonedas y monedas fiat, con tasas reales de CoinGecko",

  form: {
    title: "Convertidor",
    amountLabel: "Cantidad",
    amountPlaceholder: "0,00",
    fromLabel: "Desde",
    toLabel: "Hacia",
    currencyPlaceholder: "Elige",
    resultLabel: "Resultado",
    resultPlaceholder: "Resultado",
    copyLabel: "Copiar resultado",
    /** Nuevo: anuncio para lectores de pantalla cuando la copia sale bien. */
    copiedLabel: "Copiado",
    /** Nuevo: nombre accesible del botón de copiar mientras muestra la confirmación. */
    copiedAria: "Resultado copiado",
    swapLabel: "Intercambiar las dos monedas",
    errorTitle: "No se pudieron cargar las tasas",
    /** Nuevo: etiqueta de carga para lectores de pantalla. */
    loading: "Cargando el convertidor",
  },

  rates: {
    title: "Tasas actuales",
    /** Nuevo: etiqueta de carga para lectores de pantalla. */
    loading: "Cargando las tasas actuales",
    /** Nuevo: el bloque no tenía estado de error ni de vacío. */
    errorTitle: "No se pudieron cargar las tasas",
    emptyTitle: "Sin tasas que mostrar",
    emptyDescription: "El servicio de precios no devolvió ninguna criptomoneda en este momento.",
    emptyAction: "Volver a intentar",
    /** Nuevo: gráfica de barras con el cambio de 24 h de cada tasa. */
    chartTitle: "Cambio en 24 h",
    /** Nuevo: arranque del nombre accesible de la gráfica; detrás va el valor de cada moneda. */
    chartAria: "Cambio en 24 h de cada tasa",
    /** Nuevo: ninguna tasa trae cambio de 24 h, así que no hay barras que dibujar. */
    chartEmptyTitle: "Sin cambio que graficar",
    chartEmptyDescription: "Ninguna de las tasas trae ahora su cambio de las últimas 24 horas.",
  },

  quick: {
    title: "Conversiones rápidas",
    /** «1 BTC», «1000 ADA». */
    amountLabel: (amount: number, code: string) => `${amount} ${code}`,
    /** «Bitcoin a dólares». */
    caption: (name: string) => `${name} a dólares`,
    /** Nuevo: etiqueta de carga para lectores de pantalla. */
    loading: "Cargando las conversiones rápidas",
    /** Nuevo: el bloque no tenía estado de error ni de vacío. */
    errorTitle: "No se pudieron cargar las conversiones",
    emptyTitle: "Sin conversiones que mostrar",
    emptyDescription: "Ninguna de las monedas de estos atajos está ahora entre las 30 primeras.",
    emptyAction: "Volver a intentar",
  },
} as const;

/** Texto del badge junto a cada selector. Es el mismo valor que `Convertible.kind`. */
export const CONVERTIBLE_KIND_LABELS: Readonly<Record<Convertible["kind"], string>> = {
  cripto: "cripto",
  fiat: "fiat",
};

/**
 * Nuevo: explicación opcional bajo el campo «Resultado» cuando está vacío
 * (`form.isResultEmpty` + `form.emptyReason`). Antes no se decía nada.
 */
export const RESULT_EMPTY_TEXTS: Readonly<Record<NoConversionReason, string>> = {
  "invalid-amount": "Escribe una cantidad mayor que cero para ver el resultado.",
  "unknown-currency": "Elige las dos monedas para ver el resultado.",
};
