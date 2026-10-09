import type { ComponentProps } from "react";
import { Activity, Bitcoin, CircleDollarSign, type LucideIcon } from "lucide-react";
import { MARKET_STAT_KEYS, type MarketStat } from "@/application/panel/presentation/marketStats";
import { PANEL_TEXTS } from "@/application/panel/presentation/texts";
import { cn } from "@/lib/utils";
import { useMarketStats } from "@/hooks/panel/useMarketStats";
import { StatChart } from "@/ui/pages/panel/charts/stat-chart";
import { RollingFigure } from "@/ui/pages/panel/motion/rolling-figure";
import { StatCard, StatCardSkeleton, type StatCardProps } from "@/ui/pages/panel/stat-card";
import { TrendLabel } from "@/ui/pages/panel/trend-label";
import { ErrorState, LoadingRegion } from "@/ui/shared";

const GRID = "grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3";
/** La tercera tarjeta ocupa la fila entera mientras solo hay dos columnas. */
const LAST_WIDE = "sm:last:col-span-2 lg:last:col-span-1";

const LOOK: Record<MarketStat["key"], { icon: LucideIcon; tone: StatCardProps["tone"] }> = {
  cap: { icon: CircleDollarSign, tone: "violet" },
  volumen: { icon: Activity, tone: "blue" },
  dominancia: { icon: Bitcoin, tone: "amber" },
};

/** El error ocupa la misma celda que un esqueleto invisible: así el bloque no encoge y lo de abajo no salta. */
const STATE_CELL = "col-start-1 row-start-1 min-w-0";

function SkeletonGrid({ className, ...props }: ComponentProps<"div">) {
  return (
    <div className={cn(GRID, className)} {...props}>
      {MARKET_STAT_KEYS.map((key) => (
        <StatCardSkeleton key={key} className={LAST_WIDE} />
      ))}
    </div>
  );
}

/** Las 3 cifras del mercado (funciones 2 a 7). Se refrescan solas cada 5 minutos. */
export function MarketStatsSection() {
  const { status, stats, dominance, errorTitle, errorMessage, retry, isRetrying } = useMarketStats();

  return (
    <section aria-label={PANEL_TEXTS.stats.sectionLabel} data-slot="market-stats">
      {status === "error" ? (
        <div className="grid grid-cols-1">
          <SkeletonGrid aria-hidden="true" className={cn(STATE_CELL, "invisible")} />
          <ErrorState
            title={errorTitle}
            message={errorMessage}
            onRetry={retry}
            isRetrying={isRetrying}
            className={cn(STATE_CELL, "justify-center")}
          />
        </div>
      ) : status === "loading" ? (
        <LoadingRegion label={PANEL_TEXTS.stats.loading}>
          <SkeletonGrid />
        </LoadingRegion>
      ) : (
        <dl className={GRID}>
          {stats.map((stat, index) => (
            <StatCard
              key={stat.key}
              label={stat.label}
              index={index}
              value={<RollingFigure text={stat.value} value={stat.raw} />}
              icon={LOOK[stat.key].icon}
              tone={LOOK[stat.key].tone}
              detail={stat.change ? <TrendLabel text={stat.change.text} rising={stat.change.rising} /> : undefined}
              chart={<StatChart stat={stat} dominance={dominance} />}
              className={LAST_WIDE}
            />
          ))}
        </dl>
      )}
    </section>
  );
}
