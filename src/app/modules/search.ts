import type { BaseDeps } from "@/app/base";
import { createSearchUseCases, type SearchUseCases } from "@/application/search/useCases";
import { createNavigatorPlatform } from "@/infrastructure/search/NavigatorPlatform";

/**
 * Buscador global. La búsqueda y la carga de monedas ya las da `base.market`
 * (`useCoinSearch`, `useCoinsByIds`, `useMarkets`); aquí solo se conecta lo
 * propio del buscador: cómo se enseña el atajo según la plataforma.
 * Llega a los hooks con `useDeps().search`.
 */
export function createSearchModule(_base: BaseDeps): SearchUseCases {
  return createSearchUseCases(createNavigatorPlatform());
}
