import {
  createConverterUseCases,
  type ConverterUseCases,
} from "@/application/converter/useCases";
import type { BaseDeps } from "@/app/base";
import { createNavigatorClipboard } from "@/infrastructure/converter/NavigatorClipboard";

/**
 * Convertidor (/converter): el portapapeles del navegador entregado a su caso
 * de uso. La lista de convertibles, la fórmula, el intercambio y los atajos
 * son reglas puras de `src/domain/converter/`; los precios llegan de `market`.
 * Lo que devuelve esta función llega a los hooks con `useDeps().converter`.
 */
export function createConverterModule(_base: BaseDeps): ConverterUseCases {
  return createConverterUseCases(createNavigatorClipboard());
}
