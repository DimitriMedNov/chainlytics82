import type { BaseDeps } from "@/app/base";
import { createPanelUseCases, type PanelUseCases } from "@/application/panel/advancedChart";
import { createTradingViewAdvancedChart } from "@/infrastructure/panel/TradingViewAdvancedChart";

/**
 * Panel (/): conecta el widget de gráfica avanzada (TradingView) con su caso
 * de uso. Las cifras, el top 5 y el histórico de Bitcoin salen de `base.market`
 * a través de los hooks de mercado; aquí no hace falta nada más.
 * Lo que devuelve esta función llega a los hooks con `useDeps().panel`.
 */
export function createPanelModule(_base: BaseDeps): PanelUseCases {
  return createPanelUseCases(createTradingViewAdvancedChart());
}
