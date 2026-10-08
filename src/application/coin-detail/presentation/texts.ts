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

  /** Lo que se escribe cuando un dato no viene de la API. */
  unavailable: "No disponible",
} as const;
