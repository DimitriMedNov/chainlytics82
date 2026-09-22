import { useState } from "react";
import { Scale } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { RangeSelector, type RangeDays } from "@/components/charts/RangeSelector";
import CoinPicker from "@/components/compare/CoinPicker";
import ComparisonChart from "@/components/compare/ComparisonChart";
import ComparisonRanking from "@/components/compare/ComparisonRanking";
import { ErrorState } from "@/components/states/ErrorState";
import { EmptyState } from "@/components/states/EmptyState";
import { useMarkets } from "@/hooks/useMarketData";
import { useComparison, MAX_MONEDAS } from "@/hooks/useComparison";
import { useCompareSelection } from "@/hooks/useCompareSelection";
import { useChartColors } from "@/hooks/useChartColors";

const Compare = () => {
  const [days, setDays] = useState<RangeDays>(30);
  const { series: chartColors, axis, grid } = useChartColors();

  const markets = useMarkets();
  const { selected, add, remove } = useCompareSelection(markets.data);
  const comparison = useComparison(selected, days);

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
              onAdd={add}
              onRemove={remove}
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
        <ComparisonRanking results={comparison.results} coins={selected} colors={chartColors} />
      )}
    </div>
  );
};

export default Compare;
