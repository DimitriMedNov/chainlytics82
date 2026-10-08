import type { BaseDeps } from "@/app/base";

/**
 * Mercados (/markets): filtros (todas / suben / bajan), búsqueda por nombre o símbolo y orden de la lista.
 *
 * Esta pantalla no necesita nada de fuera que no esté ya en `base`: lee la
 * consulta de mercados compartida (`base.market`, vía `useMarkets`) y todo lo
 * demás son reglas puras de `src/domain/markets/`. Por eso no crea adaptadores
 * ni casos de uso propios y `useDeps().markets` queda vacío.
 */
export function createMarketsModule(_base: BaseDeps) {
  return {};
}
