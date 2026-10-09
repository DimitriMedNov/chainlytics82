/**
 * Textos del modal de detalle, tal como estaban en la interfaz anterior
 * (`src/components/crypto/*`). Los dos puntos finales forman parte del texto.
 */
export const COIN_DETAIL_TEXTS = {
  // Cabecera (CryptoHeader.tsx)
  follow: "Seguir",
  following: "En watchlist",
  convert: "Convertir",

  // Precio (CryptoPriceSection.tsx)
  priceLabel: "Precio actual",
  change24hSuffix: "24 h",
  high24h: "Máximo 24 h",
  low24h: "Mínimo 24 h",
  ath: "Máximo histórico",
  atl: "Mínimo histórico",

  // Gráfica (CryptoPriceChart.tsx)
  chartTitle: "Evolución del precio",
  rangeSelectorLabel: "Periodo del gráfico",
  chartErrorTitle: "No se pudo cargar el gráfico",
  /** Nuevo: `chart.status === "empty"` no existía. La acción llama a `chart.retry()`. */
  chartEmptyTitle: "Sin datos para este periodo",
  chartEmptyDescription: "El servicio de precios no devolvió ningún punto para este periodo.",
  chartEmptyAction: "Volver a intentar",

  // Capitalización, volumen y oferta (CryptoMarketStats.tsx)
  marketCapTitle: "Capitalización de mercado",
  fdv: "Totalmente diluida:",
  rank: "Ranking global:",
  volumeTitle: "Volumen y oferta",
  circulatingSupply: "Oferta circulante:",
  totalSupply: "Oferta total:",

  // Información adicional (CryptoAdditionalInfo.tsx)
  additionalTitle: "Información adicional",
  symbol: "Símbolo:",
  coinGeckoId: "Id en CoinGecko:",
  athDistance: "Distancia a su máximo:",
  change7d: "Cambio en 7 días:",

  // Textos de accesibilidad y de estados de la interfaz nueva (antes escritos a mano en `src/ui/coin-detail`).
  /** `LoadingRegion` de la gráfica. */
  chartLoading: "Cargando el gráfico de precio",
  /** Botón del vacío de la gráfica mientras `chart.isRetrying`. */
  chartRetrying: "Pidiendo…",
  /** `aria-label` del botón de cerrar. */
  close: "Cerrar el detalle",
  /** Descripción accesible del diálogo. */
  dialogDescription: (name: string) => `Precio, evolución y cifras de mercado de ${name}.`,
  /** Prefijo `sr-only` del ranking; el espacio final es parte del texto. */
  rankPrefix: "Puesto ",
  /** Esqueleto (modal abierto sin moneda): título, descripción y etiqueta de carga. */
  skeletonTitle: "Detalle de moneda",
  skeletonDescription: "Cargando los datos de la moneda.",
  skeletonLoading: "Cargando la moneda",
  /** `aria-label` de las barras de proporción. */
  marketCapBarLabel: "Capitalización respecto a la totalmente diluida",
  supplyBarLabel: "Oferta circulante respecto a la oferta total",
  dayRangeBarLabel: "Precio dentro del rango de 24 h",
  /** Sentido del cambio de 24 h, para lectores de pantalla (`sr-only`). */
  trend: { rises: "Sube", falls: "Baja" },
  /** `aria-valuetext` de una barra: porcentaje entero. */
  ratioValueText: (percent: number) => `${percent} %`,
  /** `aria-label` de la barra con marcador (posición dentro de un rango). */
  ratioMarkerLabel: (label: string, percent: number) =>
    `${label}: ${percent} % del recorrido entre el mínimo y el máximo`,
  /** Texto alternativo de la gráfica sin resumen. */
  chartAlt: (coinName: string) => `Evolución del precio de ${coinName}.`,
  /** Texto alternativo con las cifras del periodo ya formateadas; `changePct: null` = sin paréntesis. */
  chartAltSummary: (parts: {
    coinName: string;
    first: string;
    last: string;
    changePct: string | null;
    min: string;
    max: string;
  }) =>
    `Evolución del precio de ${parts.coinName}: de ${parts.first} a ` +
    `${parts.last}${parts.changePct === null ? "" : ` (${parts.changePct})`}. Mínimo ${parts.min}, ` +
    `máximo ${parts.max}.`,

  /** Lo que se escribe cuando un dato no viene de la API. */
  unavailable: "No disponible",
} as const;
