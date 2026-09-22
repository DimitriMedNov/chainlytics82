import {
  CartesianGrid,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { TooltipProps } from "recharts";
import { formatPercent } from "@/lib/format";
import type { ComparisonRow } from "@/lib/compareMath";
import type { Coin } from "@/types/coin";

export interface ComparisonChartProps {
  rows: ComparisonRow[];
  coins: Coin[];
  colors: string[];
  axisColor: string;
  gridColor: string;
}

function ChartTooltip({
  active,
  payload,
  coins,
}: TooltipProps<number, string> & { coins: Coin[] }) {
  if (!active || !payload?.length) return null;
  const row = payload[0].payload as ComparisonRow;

  // De mejor a peor, que es como se lee un gráfico de comparación.
  const lineas = payload
    .filter((item) => typeof item.value === "number")
    .sort((a, b) => (b.value as number) - (a.value as number));

  return (
    <div className="rounded-lg border border-border bg-background px-3 py-2 text-sm shadow-lg">
      <p className="mb-1 text-muted-foreground">{row.fullDate}</p>
      <ul className="space-y-0.5">
        {lineas.map((item) => {
          const coin = coins.find((c) => c.id === item.dataKey);
          return (
            <li key={String(item.dataKey)} className="flex items-center gap-2">
              <span
                aria-hidden="true"
                className="h-2 w-2 rounded-full"
                style={{ backgroundColor: item.color }}
              />
              <span className="font-medium">{coin?.symbol ?? String(item.dataKey)}</span>
              <span className="ml-auto tabular-nums">{formatPercent(item.value as number)}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

/** Varias monedas en el mismo gráfico, todas arrancando en 0 %. */
export function ComparisonChart({
  rows,
  coins,
  colors,
  axisColor,
  gridColor,
}: ComparisonChartProps) {
  return (
    <div className="h-[320px] w-full sm:h-[420px]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={rows} margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
          <CartesianGrid stroke={gridColor} strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="date" stroke={axisColor} fontSize={11} minTickGap={32} />
          <YAxis
            stroke={axisColor}
            fontSize={11}
            width={56}
            tickFormatter={(value: number) => `${value.toFixed(0)} %`}
          />
          {/* El 0 % es la referencia: por encima gana, por debajo pierde. */}
          <ReferenceLine y={0} stroke={axisColor} strokeDasharray="4 4" />
          <Tooltip content={<ChartTooltip coins={coins} />} />
          {coins.map((coin, index) => (
            <Line
              key={coin.id}
              type="monotone"
              dataKey={coin.id}
              name={coin.symbol}
              stroke={colors[index % colors.length]}
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4 }}
              isAnimationActive={false}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default ComparisonChart;
