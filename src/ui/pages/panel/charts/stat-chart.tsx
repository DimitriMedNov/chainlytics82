import { useMemo } from "react";
import { useReducedMotion } from "motion/react";
import { formatDominance, type MarketStat } from "@/application/panel/presentation/marketStats";
import { PANEL_TEXTS } from "@/application/panel/presentation/texts";
import type { DominanceRing } from "@/domain/panel/marketFigures";
import { Ring } from "@/ui/charts/ring";
import { RingChart } from "@/ui/charts/ring-chart";

export interface StatChartProps {
  /** La cifra de la tarjeta: `key` dice cuál es y `raw` trae el número sin formato. */
  stat: MarketStat;
  /** Dominancia de Bitcoin como proporción (`share` + `rest` = 1). Solo la usa la tarjeta `dominancia`. */
  dominance: DominanceRing | null;
}

/** Lado del anillo, en px (`size-16`): cabe en el alto que reserva la tarjeta. */
const RING_SIZE = 64;
const RING_STROKE = 7;
const RING_INNER_RADIUS = 17;
/** Ámbar, el mismo tono que el icono de la tarjeta de dominancia. */
const RING_COLOR = "var(--bklit-chart-3)";

/**
 * Mini-gráfica de una tarjeta de cifra. Solo la dominancia tiene: un anillo
 * de Bklit con la parte de Bitcoin sobre el total. Capitalización y volumen
 * llegan como una sola cifra (sin serie en el tiempo), así que no llevan
 * gráfica y la tarjeta no reserva hueco para ella.
 */
export function StatChart({ stat, dominance }: StatChartProps) {
  const reducedMotion = useReducedMotion();
  const data = useMemo(
    () => (dominance ? [{ label: PANEL_TEXTS.stats.dominanceRingLabel, value: dominance.share, maxValue: 1 }] : []),
    [dominance],
  );

  if (stat.key !== "dominancia" || !dominance) return null;

  return (
    <div
      role="img"
      aria-label={PANEL_TEXTS.stats.dominanceRingAlt(formatDominance(dominance.percent))}
      data-slot="dominance-ring"
      className="size-16 shrink-0"
    >
      <RingChart data={data} size={RING_SIZE} strokeWidth={RING_STROKE} baseInnerRadius={RING_INNER_RADIUS}>
        <Ring index={0} color={RING_COLOR} showGlow={false} animate={!reducedMotion} />
      </RingChart>
    </div>
  );
}
