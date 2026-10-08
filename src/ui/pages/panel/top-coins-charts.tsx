import { PANEL_TEXTS } from "@/application/panel/presentation/texts";
import type { TopCoinBar, TopCoinChangeBar } from "@/domain/panel/topCoins";
import { TopChangeBarsChart, TopVolumeBarsChart } from "@/ui/pages/panel/charts/top-bars-chart";
import { Skeleton } from "@/ui/shared";

export interface TopCoinsChartsProps {
  changeBars: readonly TopCoinChangeBar[];
  volumeBars: readonly TopCoinBar[];
}

const ASIDE = "flex min-w-0 flex-col gap-5 border-t p-4 sm:flex-row sm:p-5 lg:flex-col";
const TITLE = "type-eyebrow text-muted-foreground";

/** Las dos gráficas de barras del top 5, al lado de la tabla (debajo en móvil). */
export function TopCoinsCharts({ changeBars, volumeBars }: TopCoinsChartsProps) {
  const { columns } = PANEL_TEXTS.top;

  return (
    <div data-slot="top-coins-charts" className={ASIDE}>
      <figure className="flex min-w-0 flex-1 flex-col gap-2">
        <figcaption className={TITLE}>{columns.change}</figcaption>
        <TopChangeBarsChart bars={changeBars} />
      </figure>
      <figure className="flex min-w-0 flex-1 flex-col gap-2">
        <figcaption className={TITLE}>{columns.volume}</figcaption>
        <TopVolumeBarsChart bars={volumeBars} />
      </figure>
    </div>
  );
}

/** Con la forma de `TopCoinsCharts`: dos títulos y dos bloques de barras. */
export function TopCoinsChartsSkeleton() {
  return (
    <div className={ASIDE}>
      <div className="flex flex-1 flex-col gap-2">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-40 w-full rounded-md" />
      </div>
      <div className="flex flex-1 flex-col gap-2">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-40 w-full rounded-md" />
      </div>
    </div>
  );
}
