import type { WatchlistCoin } from "../../domain/watchlist/entries.ts";
import type { SortOrder } from "../../domain/watchlist-screen/sort.ts";

/** Rutas a las que lleva esta pantalla. La navegación la hace la interfaz. */
export const MARKETS_PATH = "/markets";
export const CONVERTER_PATH = "/converter";

/** Textos fijos de la pantalla, tal como estaban en la interfaz anterior. */
export const WATCHLIST_TEXTS = {
  title: "Mi watchlist",
  sortByName: "Ordenar por nombre",
  sortByPrice: "Precio",
  sortByChange: "Cambio",
  searchLabel: "Buscar en tu watchlist",
  searchPlaceholder: "Por nombre o símbolo…",
  listErrorTitle: "No se pudo cargar tu watchlist",
  pricesErrorTitle: "No se pudieron cargar los precios",
  emptyTitle: "Tu watchlist está vacía",
  emptyDescription: "Añade criptomonedas desde Mercados para seguir sus precios desde aquí.",
  emptyAction: "Explorar mercados",
  noMatchesTitle: "Ninguna coincidencia",
  noMatchesDescription: "Ninguna moneda de tu watchlist coincide con esa búsqueda.",
  noMatchesAction: "Limpiar búsqueda",
  // Textos NUEVOS: el estado «ninguna está en el top 100» no existía.
  outsideTopTitle: "Tus monedas no están entre las 100 primeras",
  outsideTopDescription:
    "Aquí solo hay precios en vivo de las 100 monedas con mayor capitalización. Las que sigues continúan guardadas.",
  outsideTopAction: "Explorar mercados",
  // Textos NUEVOS: gráfica de cambio y etiquetas para lectores de pantalla.
  chartTitle: "Cambio en 24 h",
  chartDescription: "Cuánto sube o baja cada moneda de la lista.",
  loadingList: "Cargando tu watchlist",
  loadingChart: "Cargando la gráfica de cambio en 24 h",
  sortGroupLabel: "Ordenar la lista",
  ascending: "ascendente",
  descending: "descendente",
  changePeriod: "en 24 horas",
} as const;

export function favoritesTitle(count: number): string {
  return `Favoritas (${count})`;
}

export function othersTitle(count: number): string {
  return `Todas (${count})`;
}

/**
 * Nuevo: aviso en `ready` cuando `hiddenCount > 0` (monedas seguidas que no
 * están entre las 100 primeras y por eso no salen en la lista).
 */
export function hiddenNotice(hiddenCount: number): string {
  return hiddenCount === 1
    ? "1 moneda que sigues no aparece aquí porque no está entre las 100 primeras."
    : `${hiddenCount} monedas que sigues no aparecen aquí porque no están entre las 100 primeras.`;
}

/** Flecha que acompaña al botón de orden activo. */
export function sortArrow(order: SortOrder): string {
  return order === "asc" ? "↑" : "↓";
}

type Named = Pick<WatchlistCoin, "name">;

/** Nombres accesibles (`aria-label`) de los cuatro botones de cada fila. */
export const rowLabels = {
  favorite: (item: Named & Pick<WatchlistCoin, "isFavorite">) =>
    item.isFavorite ? `Quitar ${item.name} de favoritos` : `Marcar ${item.name} como favorito`,
  details: (item: Named) => `Ver detalles de ${item.name}`,
  convert: (item: Named) => `Convertir ${item.name}`,
  remove: (item: Named) => `Quitar ${item.name} del watchlist`,
};
