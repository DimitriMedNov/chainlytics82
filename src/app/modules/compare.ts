import type { BaseDeps } from "@/app/base";

/**
 * Comparar (/comparar): reglas de selección (por defecto, máximo 5, sin duplicados) y series normalizadas (compareMath).
 *
 * No crea ningún adaptador ni caso de uso con puerto propio: Comparar no habla
 * con nada de fuera que no esté ya en `market`. Sus hooks
 * (`src/hooks/compare/`) piden el histórico con `useDeps().market` y
 * `marketQueries.priceHistory`, para compartir caché con el resto de la app, y
 * las reglas son funciones puras de `src/domain/compare/` y
 * `src/application/compare/`. Si algún día Comparar necesita un puerto propio
 * (por ejemplo, guardar comparaciones), se monta aquí sobre `base`.
 */
export function createCompareModule(_base: BaseDeps) {
  return {};
}
