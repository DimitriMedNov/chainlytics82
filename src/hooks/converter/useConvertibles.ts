import { useCallback, useMemo } from "react";
import { buildConvertibles, type Convertible } from "@/domain/converter/convertible";
import { useFiatRates, useMarkets } from "@/hooks/market/useMarketData";

export interface Convertibles {
  /** Las 30 criptos mayores y después las monedas fiat. Vacía mientras carga. */
  convertibles: Convertible[];
  isPending: boolean;
  isError: boolean;
  isFetching: boolean;
  /** Mensaje del fallo, ya en español; `""` si no hay. */
  errorMessage: string;
  /** Relanza las dos lecturas: mercados y tasas fiat. */
  refetch: () => void;
  /** Solo la lectura de criptos, de la que dependen los bloques laterales. */
  crypto: { isError: boolean; isFetching: boolean; errorMessage: string; refetch: () => void };
}

/**
 * Lista única para el convertidor. Reutiliza las consultas compartidas de
 * mercados (`["markets", 100]`) y tasas fiat (`["fiat-rates"]`): no pide nada
 * que otra pantalla no haya pedido ya.
 */
export function useConvertibles(): Convertibles {
  const markets = useMarkets();
  const fiat = useFiatRates();

  const convertibles = useMemo(
    () => buildConvertibles(markets.data, fiat.data),
    [markets.data, fiat.data],
  );

  const refetchMarkets = markets.refetch;
  const refetchFiat = fiat.refetch;
  const refetchCrypto = useCallback(() => {
    void refetchMarkets();
  }, [refetchMarkets]);
  const refetch = useCallback(() => {
    void refetchMarkets();
    void refetchFiat();
  }, [refetchMarkets, refetchFiat]);

  return {
    convertibles,
    // Conservado: las dos lecturas cuentan como una; si una falla o tarda,
    // toda la pantalla lo nota (inventario §9, punto 29).
    isPending: markets.isPending || fiat.isPending,
    isError: markets.isError || fiat.isError,
    isFetching: markets.isFetching || fiat.isFetching,
    errorMessage: markets.error?.message ?? fiat.error?.message ?? "",
    refetch,
    crypto: {
      isError: markets.isError,
      isFetching: markets.isFetching,
      errorMessage: markets.error?.message ?? "",
      refetch: refetchCrypto,
    },
  };
}
