import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { TooltipProps } from "recharts";
import { TrendingUp } from "lucide-react";
import { RangeSelector, type RangeDays } from "@/components/charts/RangeSelector";
import { Skeleton } from "@/components/ui/skeleton";
import { ErrorState } from "@/components/states/ErrorState";
import { formatAxisPrice, formatCurrency } from "@/lib/format";
import { useChartColors } from "@/hooks/useChartColors";
import type { PricePoint } from "@/types/coin";

export interface CryptoPriceChartProps {
  days: RangeDays;
  onDaysChange: (days: RangeDays) => void;
  data: PricePoint[] | undefined;
  isPending: boolean;
  isError: boolean;
  errorMessage: string;
  isRetrying: boolean;
  onRetry: () => void;
}

function ChartTooltip({ active, payload }: TooltipProps<number, string>) {
  if (!active || !payload?.length) return null;
  const point = payload[0].payload as PricePoint;

  return (
    <div className="rounded-lg border border-border bg-background px-3 py-2 text-sm shadow-lg">
      <p className="text-muted-foreground">{point.fullDate}</p>
      <p className="font-semibold text-chart-1">{formatCurrency(point.price)}</p>
    </div>
  );
}

const CryptoPriceChart = ({
  days,
  onDaysChange,
  data,
  isPending,
  isError,
  errorMessage,
  isRetrying,
  onRetry,
}: CryptoPriceChartProps) => {
  const colors = useChartColors();

  return (
    <section className="rounded-xl border p-3 sm:p-6">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-chart-1" aria-hidden="true" />
          <h3 className="font-semibold sm:text-lg">Evolución del precio</h3>
        </div>
        <RangeSelector value={days} onChange={onDaysChange} label="Periodo del gráfico" />
      </div>

      {isError ? (
        <ErrorState
          title="No se pudo cargar el gráfico"
          message={errorMessage}
          onRetry={onRetry}
          isRetrying={isRetrying}
        />
      ) : isPending ? (
        <Skeleton className="h-[200px] w-full sm:h-[300px]" />
      ) : (
        <div className="h-[200px] w-full sm:h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <XAxis
                dataKey="date"
                stroke={colors.axis}
                fontSize={11}
                minTickGap={24}
              />
              <YAxis
                // Arrancar en cero aplasta la curva: ajustamos al rango real con holgura.
                domain={[(min: number) => min * 0.98, (max: number) => max * 1.02]}
                stroke={colors.axis}
                fontSize={11}
                width={56}
                tickFormatter={(value: number) => formatAxisPrice(value)}
              />
              <Tooltip content={<ChartTooltip />} />
              <Line
                type="monotone"
                dataKey="price"
                stroke={colors.series[0]}
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </section>
  );
};

export default CryptoPriceChart;
