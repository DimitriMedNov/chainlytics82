import { Coins } from "lucide-react";
import { motion } from "motion/react";
import { CONVERTER_TEXTS } from "@/application/converter/presentation/texts";
import { formatCurrency } from "@/application/shared/presentation/format";
import type { Converter } from "@/hooks/converter/useConverter";
import { BlockStates } from "@/ui/pages/converter/block-states";
import { RateBarsSkeleton } from "@/ui/pages/converter/converter-skeletons";
import { useRowStagger } from "@/ui/pages/converter/converter-motion";
import { RATE_CHART_TITLE, RateChartBlock } from "@/ui/pages/converter/rate-chart-block";
import { CoinAvatar, ListSkeleton, Panel, PriceChange, Skeleton } from "@/ui/shared";
import { cn } from "@/lib/utils";

const TITLE_ID = "converter-rates-title";
const CHART_BLOCK = "border-t px-4 py-4 sm:px-5";

export interface RatesPanelProps {
  rates: Converter["rates"];
}

/** Lateral «Tasas actuales»: las 4 primeras criptos y, debajo, las barras de su cambio en 24 h. */
export function RatesPanel({ rates }: RatesPanelProps) {
  const texts = CONVERTER_TEXTS.rates;
  const stagger = useRowStagger();

  return (
    <Panel aria-labelledby={TITLE_ID} data-slot="converter-rates">
      <Panel.Header>
        <Panel.Title id={TITLE_ID}>{texts.title}</Panel.Title>
      </Panel.Header>
      <Panel.Body padding="flush">
        <BlockStates
          block={rates}
          texts={texts}
          emptyIcon={Coins}
          skeleton={
            <>
              <ListSkeleton rows={4} columns={1} />
              <div className={CHART_BLOCK}>
                <Skeleton className={cn(RATE_CHART_TITLE, "h-4 w-24")} />
                <RateBarsSkeleton />
              </div>
            </>
          }
        >
          <motion.ul className="divide-y" variants={stagger.list} initial="hidden" animate="visible">
            {rates.rows.map((rate) => (
              <motion.li
                key={rate.code}
                variants={stagger.row}
                className="flex min-h-14 items-center gap-3 px-4 py-2 sm:px-5"
              >
                <CoinAvatar src={rate.image} symbol={rate.code} />
                <div className="flex min-w-0 flex-1 flex-col">
                  <span className="text-sm font-medium text-foreground">{rate.code}</span>
                  <span className="truncate text-xs text-muted-foreground">{rate.name}</span>
                </div>
                <div className="flex shrink-0 flex-col items-end">
                  <span className="type-num text-sm font-medium text-foreground">{formatCurrency(rate.usdPrice)}</span>
                  {rate.change24h === null ? null : <PriceChange value={rate.change24h} />}
                </div>
              </motion.li>
            ))}
          </motion.ul>
          <div className={CHART_BLOCK}>
            <RateChartBlock bars={rates.chart} />
          </div>
        </BlockStates>
      </Panel.Body>
    </Panel>
  );
}
