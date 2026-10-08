import { useCallback, useMemo } from "react";
import type { Notice } from "@/application/portfolio-screen/messages";
import type { PortfolioActionsPort } from "@/application/portfolio-screen/ports";
import { useDeps } from "@/app/deps";
import type { Coin } from "@/domain/market/coin";
import { summaryFigures } from "@/domain/portfolio-screen/gain";
import { canRegisterTransaction, resolveScreenState } from "@/domain/portfolio-screen/screenState";
import { distributionSeries, gainSeries } from "@/domain/portfolio-screen/series";
import { buildTransactionRows } from "@/domain/portfolio-screen/transactionRows";
import { buildPositions } from "@/domain/portfolio/positions";
import { summarize } from "@/domain/portfolio/summary";
import type { NewTransaction, Position } from "@/domain/portfolio/types";
import { useMarkets } from "@/hooks/market/useMarketData";
import { usePortfolio } from "@/hooks/portfolio/usePortfolio";

const NO_COINS: Coin[] = [];

/**
 * Todo lo que pinta la pantalla Portfolio: une los movimientos
 * (`usePortfolio`) con los precios (`useMarkets`) y entrega el estado de la
 * vista, las cifras ya calculadas, las series de las gráficas y las acciones.
 * No hace peticiones propias.
 */
export function usePortfolioScreen() {
  const { portfolioScreen } = useDeps();
  const portfolio = usePortfolio();
  const markets = useMarkets();
  const { transactions, addTransaction, removeTransaction, setMissingCost } = portfolio;

  const positions = useMemo(
    () => buildPositions(transactions, markets.data),
    [transactions, markets.data],
  );
  const summary = useMemo(() => summarize(positions, transactions), [positions, transactions]);
  const figures = useMemo(() => summaryFigures(summary), [summary]);
  const rows = useMemo(() => buildTransactionRows(transactions), [transactions]);
  const distribution = useMemo(
    () => distributionSeries(positions, summary.value),
    [positions, summary.value],
  );
  const gains = useMemo(() => gainSeries(positions), [positions]);

  const state = resolveScreenState({
    transactionsError: portfolio.isError,
    transactionsPending: portfolio.isPending,
    pricesError: markets.isError,
    pricesPending: markets.isPending,
    transactionCount: transactions.length,
  });

  const actions: PortfolioActionsPort = useMemo(
    () => ({ addTransaction, removeTransaction, setMissingCost }),
    [addTransaction, removeTransaction, setMissingCost],
  );

  /** Registra un movimiento ya validado. No hay aviso: devuelve `null`. */
  const registerTransaction = useCallback(
    (tx: NewTransaction): null => portfolioScreen.registerTransaction(actions, tx),
    [portfolioScreen, actions],
  );
  /** Borra sin confirmación y devuelve el aviso a lanzar. */
  const removeTransactionById = useCallback(
    (id: string): Notice => portfolioScreen.removeTransaction(actions, id),
    [portfolioScreen, actions],
  );
  /** Fija el coste de una posición y devuelve el aviso a lanzar. */
  const setPositionCost = useCallback(
    (position: Pick<Position, "coinId" | "name">, unitPrice: number): Notice =>
      portfolioScreen.setPositionCost(actions, position, unitPrice),
    [portfolioScreen, actions],
  );

  const { refetch: refetchPrices } = markets;
  const retryPrices = useCallback(() => void refetchPrices(), [refetchPrices]);

  return {
    /** "transactions-error" | "prices-error" | "loading" | "empty" | "ready". */
    state,
    /** Texto del fallo que toca enseñar según `state`; "" si no hay fallo. */
    errorMessage:
      state === "transactions-error"
        ? portfolio.errorMessage
        : state === "prices-error"
          ? (markets.error?.message ?? "")
          : "",
    /** Reintenta la lectura que falló según `state`. */
    retry: state === "transactions-error" ? portfolio.refetch : retryPrices,
    isRetrying: state === "transactions-error" ? portfolio.isRefetching : markets.isFetching,

    /** Monedas para el select del formulario (top 100); vacío mientras no hay precios. */
    coins: markets.data ?? NO_COINS,
    /** false mientras los precios cargan o han fallado: deshabilita el botón de cabecera. */
    canRegister: canRegisterTransaction(markets.isPending, markets.isError),

    transactions,
    positions,
    /** Distribución y "Mis posiciones" solo se pintan si hay alguna posición. */
    hasPositions: positions.length > 0,
    summary,
    figures,
    rows,
    distribution,
    gains,

    registerTransaction,
    removeTransaction: removeTransactionById,
    setPositionCost,

    isSynced: portfolio.isSynced,
    isSaving: portfolio.isSaving,
    saveErrorMessage: portfolio.saveErrorMessage,
    clearSaveError: portfolio.clearSaveError,
  };
}

export type PortfolioScreen = ReturnType<typeof usePortfolioScreen>;
