import { useCallback, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Scale, Trophy } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { RangeSelector, type RangeDays } from "@/components/charts/RangeSelector";
import CoinPicker from "@/components/compare/CoinPicker";
import ComparisonChart from "@/components/compare/ComparisonChart";
import { ErrorState } from "@/components/states/ErrorState";
import { EmptyState } from "@/components/states/EmptyState";
import { useMarkets } from "@/hooks/useMarketData";
import { useComparison, MAX_MONEDAS } from "@/hooks/useComparison";
import { useChartColors } from "@/hooks/useChartColors";
import { formatCurrency, formatPercent } from "@/lib/format";
import { cn } from "@/lib/utils";

const POR_DEFECTO = ["bitcoin", "ethereum"];
const PARAMETRO = "monedas";

const Compare = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [days, setDays] = useState<RangeDays>(30);
  const { series: chartColors, axis, grid } = useChartColors();

  const markets = useMarkets();

  // La selección vive en la URL para poder compartir la comparación.
  const selectedIds = useMemo(() => {
    const crudo = searchParams.get(PARAMETRO);
    const ids = crudo === null ? POR_DEFECTO : crudo.split(",").filter(Boolean);
    return ids.slice(0, MAX_MONEDAS);
  }, [searchParams]);

  const selected = useMemo(
    () =>
      selectedIds.flatMap((id) => {
        const coin = markets.data?.find((item) => item.id === id);
        return coin ? [coin] : [];
      }),
    [selectedIds, markets.data],
  );

  const setSelectedIds = useCallback(
    (ids: string[]) => {
      setSearchParams(
        ids.length === 0 ? {} : { [PARAMETRO]: ids.join(",") },
        { replace: true },
      );
    },
    [setSearchParams],
  );

  const comparison = useComparison(selected, days);

  const añadir = (coinId: string) => {
    if (coinId === "" || selectedIds.includes(coinId)) return;
    setSelectedIds([...selectedIds, coinId].slice(0, MAX_MONEDAS));
  };

  const quitar = (coinId: string) => {
    setSelectedIds(selectedIds.filter((id) => id !== coinId));
  };

  const cargandoMonedas = markets.isPending;

  return (
    <div className="mx-auto max-w-7xl space-y-6 p-4 sm:p-6 lg:space-y-8 lg:p-8">
      <header>
        <h1 className="mb-2 text-2xl font-bold sm:text-3xl">Comparar</h1>
        <p className="text-sm text-muted-foreground sm:text-base">
          Varias monedas en el mismo gráfico, todas partiendo de cero, para ver cuál lo ha
          hecho mejor
        </p>
      </header>

      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
            <Scale className="h-5 w-5" aria-hidden="true" />
            Qué comparar
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {markets.isError ? (
            <ErrorState
              title="No se pudo cargar la lista de monedas"
              message={markets.error.message}
              onRetry={() => void markets.refetch()}
              isRetrying={markets.isFetching}
            />
          ) : cargandoMonedas ? (
            <div className="space-y-3" aria-busy="true">
              <Skeleton className="h-8 w-48" />
              <Skeleton className="h-11 w-full sm:w-[280px]" />
            </div>
          ) : (
            <CoinPicker
              options={markets.data}
              selected={selected}
              colors={chartColors}
              max={MAX_MONEDAS}
              onAdd={añadir}
              onRemove={quitar}
            />
          )}

          <div className="space-y-2">
            <p className="text-sm font-medium">Periodo</p>
            <RangeSelector value={days} onChange={setDays} label="Periodo de la comparación" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-lg sm:text-xl">Variación desde el inicio del periodo</CardTitle>
        </CardHeader>
        <CardContent>
          {selected.length === 0 ? (
            <EmptyState
              icon={Scale}
              title="Elige al menos una moneda"
              description="Añade monedas arriba y verás sus curvas superpuestas, cada una partiendo de cero."
            />
          ) : comparison.isError ? (
            <ErrorState
              title="No se pudo cargar el histórico"
              message={comparison.errorMessage}
              onRetry={comparison.refetch}
              isRetrying={comparison.isFetching}
            />
          ) : comparison.isPending ? (
            <Skeleton className="h-[320px] w-full sm:h-[420px]" aria-busy="true" />
          ) : comparison.rows.length === 0 ? (
            <EmptyState
              icon={Scale}
              title="Sin datos en común"
              description="Estas monedas no tienen histórico coincidente en el periodo elegido. Prueba con un periodo más amplio."
            />
          ) : (
            <ComparisonChart
              rows={comparison.rows}
              coins={selected}
              colors={chartColors}
              axisColor={axis}
              gridColor={grid}
            />
          )}
        </CardContent>
      </Card>

      {comparison.results.length > 0 && (
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
              <Trophy className="h-5 w-5" aria-hidden="true" />
              Quién lo ha hecho mejor
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ol className="space-y-3">
              {comparison.results.map((result, index) => {
                const coin = selected.find((c) => c.id === result.coinId);
                const sube = result.changePct >= 0;
                const colorIndex = selected.findIndex((c) => c.id === result.coinId);
                return (
                  <li
                    key={result.coinId}
                    className="flex flex-col gap-3 rounded-lg border p-4 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <span className="w-6 flex-shrink-0 text-sm font-semibold text-muted-foreground">
                        {index + 1}.
                      </span>
                      <span
                        aria-hidden="true"
                        className="h-3 w-3 flex-shrink-0 rounded-full"
                        style={{
                          backgroundColor: chartColors[colorIndex % chartColors.length],
                        }}
                      />
                      {coin && (
                        <img
                          src={coin.image}
                          alt=""
                          width={32}
                          height={32}
                          loading="lazy"
                          className="h-8 w-8 flex-shrink-0 rounded-full"
                        />
                      )}
                      <div className="min-w-0">
                        <p className="truncate font-semibold">{coin?.name ?? result.symbol}</p>
                        <p className="text-sm text-muted-foreground">
                          {formatCurrency(result.firstPrice)} → {formatCurrency(result.lastPrice)}
                        </p>
                      </div>
                    </div>
                    <p
                      className={cn(
                        "text-lg font-bold sm:text-xl",
                        sube ? "text-success" : "text-warning",
                      )}
                    >
                      {formatPercent(result.changePct)}
                    </p>
                  </li>
                );
              })}
            </ol>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Compare;
