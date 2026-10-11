import { createMarketUseCases, type MarketUseCases } from "@/application/market/useCases";
import { createCoinGeckoMarketData } from "@/infrastructure/market/CoinGeckoMarketData";
import { createCoinPaprikaMarketData } from "@/infrastructure/market/CoinPaprikaMarketData";
import { createFallbackMarketData } from "@/infrastructure/market/FallbackMarketData";
import { createGetJson } from "@/infrastructure/market/httpJson";
import type { AppEnv } from "@/app/env";

/**
 * Datos de mercado: CoinGecko como proveedor principal y CoinPaprika como
 * respaldo cuando el principal falla, entregados a sus casos de uso.
 */
export function createMarketModule(env: AppEnv): MarketUseCases {
  const primary = createCoinGeckoMarketData(env.coingeckoBase);
  const fallback = createCoinPaprikaMarketData(createGetJson(env.coinpaprikaBase));
  return createMarketUseCases(createFallbackMarketData(primary, fallback));
}
