import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { TooltipProps } from "recharts";
import { useState } from "react";
import { usePriceHistory } from "@/hooks/useMarketData";
import { RangeSelector, type RangeDays } from "@/components/charts/RangeSelector";
import { useChartColors } from "@/hooks/useChartColors";
import { formatAxisPrice, formatCurrency } from "@/lib/format";
import { Skeleton } from "@/components/ui/skeleton";
import { ErrorState } from "@/components/states/ErrorState";
import type { PricePoint } from "@/types/coin";

const RANGO_POR_DEFECTO: RangeDays = 90;

function ChartTooltip({ active, payload }: TooltipProps<number, string>) {
  if (!active || !payload?.length) return null;
  const point = payload[0].payload as PricePoint;

  return (
    <div className="rounded-xl border border-border bg-background/95 p-4 shadow-2xl backdrop-blur-md">
      <p className="mb-2 text-sm font-medium text-foreground">{point.fullDate}</p>
      <p className="text-lg font-bold text-chart-1">{formatCurrency(point.price)}</p>
    </div>
  );
}

/** Evolución real del precio de Bitcoin en los últimos 6 meses. */
const PortfolioCard = () => {
  const colors = useChartColors();
  const [days, setDays] = useState<RangeDays>(RANGO_POR_DEFECTO);
  const { data, isPending, isError, error, refetch, isFetching } = usePriceHistory("bitcoin", days);

  return (
    <section className="glass-card mb-8 animate-fade-in rounded-lg border border-border/20 p-6">
      <div className="mb-6 space-y-3">
        <h2 className="text-xl font-semibold">Bitcoin</h2>
        <RangeSelector
          value={days}
          onChange={setDays}
          label="Periodo del gráfico de Bitcoin"
          className="-mx-1"
        />
      </div>

      {isError ? (
        <ErrorState
          title="No se pudo cargar el histórico"
          message={error.message}
          onRetry={() => void refetch()}
          isRetrying={isFetching}
        />
      ) : isPending ? (
        <div className="h-[200px] w-full space-y-3" aria-busy="true">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-[164px] w-full" />
        </div>
      ) : (
        <div className="h-[200px] w-full overflow-hidden rounded-lg">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <XAxis
                dataKey="date"
                stroke={colors.axis}
                fontSize={12}
                minTickGap={40}
              />
              <YAxis
                // Arrancar en cero aplasta la curva: ajustamos al rango real con holgura.
                domain={[(min: number) => min * 0.98, (max: number) => max * 1.02]}
                stroke={colors.axis}
                fontSize={12}
                width={60}
                tickFormatter={(value: number) => formatAxisPrice(value)}
              />
              <Tooltip
                content={<ChartTooltip />}
                cursor={{ stroke: colors.series[0], strokeWidth: 2, strokeDasharray: "4 4" }}
              />
              <Line
                type="monotone"
                dataKey="price"
                stroke={colors.series[0]}
                strokeWidth={3}
                dot={false}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </section>
  );
};

export default PortfolioCard;
