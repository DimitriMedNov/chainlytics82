import { useMemo } from "react";
import { useFiatRates, useMarkets } from "@/hooks/useMarketData";

/** Una unidad convertible: cripto o fiat, siempre con su precio en dólares. */
export interface Convertible {
  code: string;
  name: string;
  /** Cuántos dólares vale 1 unidad. */
  usdPrice: number;
  change24h: number | null;
  kind: "cripto" | "fiat";
  image?: string;
}

const CRIPTOS_EN_LISTA = 30;

/**
 * Lista única para el convertidor: las criptos más grandes más las monedas
 * fiat. Todo se compara pasando por el dólar.
 */
export function useConvertibles() {
  const markets = useMarkets();
  const fiat = useFiatRates();

  const convertibles = useMemo<Convertible[]>(() => {
    const cryptoItems: Convertible[] = (markets.data ?? []).slice(0, CRIPTOS_EN_LISTA).map((coin) => ({
      code: coin.symbol,
      name: coin.name,
      usdPrice: coin.price,
      change24h: coin.change24h,
      kind: "cripto",
      image: coin.image,
    }));

    const fiatItems: Convertible[] = (fiat.data ?? []).map((rate) => ({
      code: rate.code,
      name: rate.name,
      usdPrice: rate.usdPerUnit,
      change24h: null,
      kind: "fiat",
    }));

    return [...cryptoItems, ...fiatItems];
  }, [markets.data, fiat.data]);

  return {
    convertibles,
    isPending: markets.isPending || fiat.isPending,
    isError: markets.isError || fiat.isError,
    isFetching: markets.isFetching || fiat.isFetching,
    errorMessage: markets.error?.message ?? fiat.error?.message ?? "",
    refetch: () => {
      void markets.refetch();
      void fiat.refetch();
    },
  };
}
