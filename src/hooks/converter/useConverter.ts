import { useMemo } from "react";
import { blockStatus, formStatus, type BlockStatus, type FormStatus } from "@/domain/converter/blocks";
import type { Convertible } from "@/domain/converter/convertible";
import {
  quickConversions,
  quickRates,
  rateChangeSeries,
  type QuickConversion,
  type RateChangeBar,
} from "@/domain/converter/quick";
import { useConverterForm, type ConverterForm } from "@/hooks/converter/useConverterForm";
import { useConvertibles } from "@/hooks/converter/useConvertibles";

/** Estados de un bloque lateral. Solo uno de los cuatro de `status` a la vez. */
export interface ConverterBlock<Row> {
  rows: Row[];
  status: BlockStatus;
  isPending: boolean;
  isError: boolean;
  isEmpty: boolean;
  isRetrying: boolean;
  errorMessage: string;
  refetch: () => void;
}

export interface Converter {
  /** Opciones de los dos selectores: 30 criptos y después las fiat. */
  options: Convertible[];
  /** `"error"` manda sobre `"loading"`. */
  status: FormStatus;
  isPending: boolean;
  isError: boolean;
  isRetrying: boolean;
  errorMessage: string;
  /** Reintenta las dos lecturas (mercados y tasas fiat). */
  refetch: () => void;
  form: ConverterForm;
  /** "Tasas actuales": las 4 primeras criptos, más la serie de la gráfica. */
  rates: ConverterBlock<Convertible> & { chart: RateChangeBar[] };
  /** "Conversiones rápidas": 1 BTC, 1 ETH, 10 SOL y 1000 ADA en dólares. */
  quick: ConverterBlock<QuickConversion>;
}

/** Contenedor de la pantalla `/converter`: datos, formulario y estados por bloque. */
export function useConverter(): Converter {
  const source = useConvertibles();
  const { convertibles, isPending, isError, crypto } = source;
  const form = useConverterForm(convertibles);

  const rateRows = useMemo(() => quickRates(convertibles), [convertibles]);
  const chart = useMemo(() => rateChangeSeries(rateRows), [rateRows]);
  const quickRows = useMemo(() => quickConversions(convertibles), [convertibles]);

  // Conservado: los bloques laterales esperan a las dos lecturas (criptos y
  // fiat) para dejar de cargar, aunque solo pintan criptos.
  const block = <Row,>(rows: Row[]): ConverterBlock<Row> => {
    const status = blockStatus({ isPending, isError: crypto.isError, rows: rows.length });
    return {
      rows,
      status,
      isPending: status === "loading",
      isError: status === "error",
      isEmpty: status === "empty",
      isRetrying: crypto.isFetching,
      errorMessage: crypto.errorMessage,
      refetch: crypto.refetch,
    };
  };

  return {
    options: convertibles,
    status: formStatus(isPending, isError),
    isPending,
    isError,
    isRetrying: source.isFetching,
    errorMessage: source.errorMessage,
    refetch: source.refetch,
    form,
    rates: { ...block(rateRows), chart },
    quick: block(quickRows),
  };
}
