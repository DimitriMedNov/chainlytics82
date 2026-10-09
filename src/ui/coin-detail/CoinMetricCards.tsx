import { ChartPie, Coins, Info } from "lucide-react";
import { motion } from "motion/react";
import type { CoinDetailView } from "@/application/coin-detail/presentation/coinDetailView";
import { COIN_DETAIL_TEXTS as T } from "@/application/coin-detail/presentation/texts";
import type { CoinDetailFigures } from "@/domain/coin-detail/figures";
import { MetricCard } from "@/ui/coin-detail/MetricCard";
import { RatioBarSlot } from "@/ui/coin-detail/RatioBarSlot";
import { useCardStagger } from "@/ui/coin-detail/useCoinDetailMotion";

export interface CoinMetricCardsProps {
  marketCap: CoinDetailView["marketCap"];
  volume: CoinDetailView["volume"];
  additional: CoinDetailView["additional"];
  figures: Pick<CoinDetailFigures, "marketCapVsFdv" | "supply">;
}

/**
 * Las tres tarjetas de cifras: capitalización (con FDV y ranking), volumen y
 * oferta, e información adicional. Una barra solo sale si el dominio da su
 * proporción; con `null` queda el texto («No disponible»). Entran escalonadas
 * (Motion): este contenedor reparte el retraso y cada `MetricCard` se anima.
 */
export function CoinMetricCards({ marketCap, volume, additional, figures }: CoinMetricCardsProps) {
  const capRatio = figures.marketCapVsFdv.ratio;
  const supplyRatio = figures.supply.ratio;
  const stagger = useCardStagger();

  return (
    <motion.div
      data-slot="coin-metric-cards"
      variants={stagger.list}
      initial="hidden"
      animate="visible"
      className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
    >
      <MetricCard
        icon={ChartPie}
        accent="violet"
        title={marketCap.title}
        value={marketCap.value}
        rows={marketCap.rows}
        bar={
          capRatio !== null ? (
            <RatioBarSlot ratio={capRatio} label={T.marketCapBarLabel} />
          ) : null
        }
      />
      <MetricCard
        icon={Coins}
        accent="blue"
        title={volume.title}
        value={volume.value}
        rows={volume.rows}
        bar={
          supplyRatio !== null ? (
            <RatioBarSlot ratio={supplyRatio} label={T.supplyBarLabel} />
          ) : null
        }
      />
      <MetricCard
        icon={Info}
        accent="teal"
        title={additional.title}
        rows={additional.rows}
        className="sm:col-span-2 lg:col-span-1"
      />
    </motion.div>
  );
}
