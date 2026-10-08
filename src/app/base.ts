import { browserStorage } from "@/infrastructure/shared/browserStorage";
import type { AppEnv } from "@/app/env";
import { createMarketModule } from "@/app/modules/market";
import { createPortfolioModule } from "@/app/modules/portfolio";
import { createSessionModule } from "@/app/modules/session";
import { createSyncModule } from "@/app/modules/sync";
import { createThemeModule } from "@/app/modules/theme";
import { createWatchlistModule } from "@/app/modules/watchlist";

/**
 * Lo compartido por varias pantallas. Los módulos de pantalla lo reciben para
 * construir sus casos de uso encima (por ejemplo, sobre `market`).
 */
export function createBaseDeps(env: AppEnv) {
  const watchlist = createWatchlistModule(browserStorage);
  const portfolio = createPortfolioModule(browserStorage);

  return {
    market: createMarketModule(env),
    session: createSessionModule(env),
    watchlist,
    portfolio,
    sync: createSyncModule(watchlist.local, portfolio.local),
    theme: createThemeModule(browserStorage),
  };
}

export type BaseDeps = ReturnType<typeof createBaseDeps>;
