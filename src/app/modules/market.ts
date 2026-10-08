import { createMarketUseCases, type MarketUseCases } from "@/application/market/useCases";
import { createCoinGeckoMarketData } from "@/infrastructure/market/CoinGeckoMarketData";
import type { AppEnv } from "@/app/env";

/** Datos de mercado: el adaptador de CoinGecko entregado a sus casos de uso. */
export function createMarketModule(env: AppEnv): MarketUseCases {
  return createMarketUseCases(createCoinGeckoMarketData(env.coingeckoBase));
}
