import { createBaseDeps } from "@/app/base";
import type { AppEnv } from "@/app/env";
import { createAnalystModule } from "@/app/modules/analyst";
import { createAuthScreenModule } from "@/app/modules/auth-screen";
import { createCoinDetailModule } from "@/app/modules/coin-detail";
import { createCompareModule } from "@/app/modules/compare";
import { createConverterModule } from "@/app/modules/converter";
import { createMarketsModule } from "@/app/modules/markets";
import { createPanelModule } from "@/app/modules/panel";
import { createPortfolioScreenModule } from "@/app/modules/portfolio-screen";
import { createSearchModule } from "@/app/modules/search";
import { createWatchlistScreenModule } from "@/app/modules/watchlist-screen";

/**
 * Composition root: el único sitio donde se crean los adaptadores concretos y
 * se entregan a los casos de uso. Hay un archivo por funcionalidad en
 * `src/app/modules/`; aquí solo se juntan.
 */
export function createContainer(env: AppEnv) {
  const base = createBaseDeps(env);

  return {
    ...base,
    markets: createMarketsModule(base),
    portfolioScreen: createPortfolioScreenModule(base),
    compare: createCompareModule(base),
    converter: createConverterModule(base),
    analyst: createAnalystModule(base, env),
    search: createSearchModule(base),
    watchlistScreen: createWatchlistScreenModule(base),
    panel: createPanelModule(base),
    coinDetail: createCoinDetailModule(base),
    authScreen: createAuthScreenModule(base),
  };
}

/** Todo lo que los hooks pueden pedir con `useDeps()`. */
export type Deps = ReturnType<typeof createContainer>;
