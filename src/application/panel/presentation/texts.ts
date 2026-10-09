import { TOP_COINS_VISIBLE } from "../../../domain/panel/topCoins.ts";

/**
 * Textos del Panel, tal como estaban en la pantalla. Los marcados como
 * «nuevo» son de estados que antes no existían.
 */
export const PANEL_TEXTS = {
  title: "Panel",
  subtitle: "Precios y cifras del mercado, en vivo desde CoinGecko",
  /** Nuevo: botón de la cabecera que abre el buscador. */
  searchCoins: "Buscar monedas",

  stats: {
    marketCap: "Capitalización total",
    volume: "Volumen 24 h",
    dominance: "Dominancia BTC",
    changeSuffix: "(24 h)",
    errorTitle: "No se pudieron cargar las cifras del mercado",
    /** Nuevo: nombre accesible (`aria-label`) de la sección de cifras. */
    sectionLabel: "Cifras del mercado",
    /** Nuevo: etiqueta de carga para lectores de pantalla. */
    loading: "Cargando las cifras del mercado",
    /** Etiqueta del único tramo del anillo de dominancia. */
    dominanceRingLabel: "Bitcoin",
    /** Texto alternativo del anillo; recibe el porcentaje ya formateado (`formatDominance`). */
    dominanceRingAlt: (percentText: string) => `Bitcoin supone el ${percentText} del mercado`,
  },

  tradingView: {
    title: "Precio de Bitcoin",
    /** Nuevo: antes no había estado de carga ni de error. */
    loading: "Cargando el gráfico de TradingView…",
    errorTitle: "No se pudo cargar el gráfico de TradingView",
    errorMessage: "Revisa tu conexión o desactiva el bloqueador de contenido y vuelve a intentarlo.",
  },

  bitcoin: {
    title: "Bitcoin",
    rangeLabel: "Periodo del gráfico de Bitcoin",
    errorTitle: "No se pudo cargar el histórico",
    /** Nuevo: etiqueta de carga para lectores de pantalla. */
    loading: "Cargando el histórico de Bitcoin",
    /** Nuevo: antes una serie sin puntos pintaba unos ejes vacíos. */
    emptyTitle: "Sin datos para este periodo",
    emptyDescription: "El servicio de precios no devolvió ningún punto para este periodo.",
    emptyAction: "Volver a intentar",
    /** Texto alternativo de la gráfica de área sin puntos. */
    chartAlt: "Evolución del precio de Bitcoin.",
    /** Texto alternativo con el primer y el último punto; precios y fechas ya formateados. */
    chartAltRange: (parts: { firstPrice: string; firstDate: string; lastPrice: string; lastDate: string }) =>
      `Evolución del precio de Bitcoin: de ${parts.firstPrice} (${parts.firstDate}) ` +
      `a ${parts.lastPrice} (${parts.lastDate}).`,
  },

  top: {
    title: "Top criptomonedas",
    seeAll: "Ver todas",
    seeAllHref: "/markets",
    caption: `Las ${TOP_COINS_VISIBLE} criptomonedas con mayor capitalización`,
    columns: { name: "Nombre", price: "Precio", change: "Cambio 24 h", volume: "Volumen" },
    errorTitle: "No se pudo cargar el top de criptomonedas",
    /** Nuevo: etiqueta de carga para lectores de pantalla. */
    loading: "Cargando el top de criptomonedas",
    /** Nuevo: nombre accesible (`aria-label`) del botón de cada fila. */
    seeDetail: (name: string) => `Ver detalle de ${name}`,
    emptyTitle: "Sin monedas que mostrar",
    emptyDescription: "El servicio de precios no devolvió ninguna moneda en este momento.",
    emptyAction: "Volver a intentar",
  },

  /** Sentido de una variación, para lectores de pantalla (`sr-only`). */
  trend: { rises: "Sube", falls: "Baja" },

  retry: "Reintentar",
  retrying: "Reintentando…",
} as const;
