import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import type { TooltipProps } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency, formatPercentShare } from "@/lib/format";
import type { Position } from "@/types/portfolio";

export interface PortfolioDistributionProps {
  positions: Position[];
  totalValue: number;
  colors: string[];
}

function SliceTooltip({ active, payload }: TooltipProps<number, string>) {
  if (!active || !payload?.length) return null;
  const slice = payload[0].payload as Position;

  return (
    <div className="rounded-lg border border-border bg-background px-3 py-2 text-sm shadow-lg">
      <p className="font-medium">{slice.name}</p>
      <p className="text-muted-foreground">{formatCurrency(slice.value)}</p>
    </div>
  );
}

/** Tarta de distribución y barras con el peso de cada moneda. */
export default function PortfolioDistribution({
  positions,
  totalValue,
  colors,
}: PortfolioDistributionProps) {
  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-8">
      <Card>
        <CardHeader>
          <CardTitle>Distribución</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={positions}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  dataKey="value"
                  nameKey="symbol"
                  isAnimationActive={false}
                >
                  {positions.map((slice, index) => (
                    <Cell key={slice.coinId} fill={colors[index % colors.length]} />
                  ))}
                </Pie>
                <Tooltip content={<SliceTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Peso de cada moneda</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-4">
            {positions.map((position, index) => {
              const peso = totalValue > 0 ? (position.value / totalValue) * 100 : 0;
              return (
                <li key={position.coinId} className="space-y-1">
                  <div className="flex items-center justify-between gap-4 text-sm">
                    <span className="font-medium">{position.symbol}</span>
                    <span className="text-muted-foreground">{formatPercentShare(peso)}</span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${peso}%`,
                        backgroundColor: colors[index % colors.length],
                      }}
                    />
                  </div>
                </li>
              );
            })}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
