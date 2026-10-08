import { LineChart } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { PANEL_TEXTS } from "@/application/panel/presentation/texts";
import { useBitcoinHistory } from "@/hooks/panel/useBitcoinHistory";
import { Button } from "@/ui/animate-ui/components/buttons/button";
import { BitcoinAreaChart } from "@/ui/pages/panel/charts/bitcoin-area-chart";
import { STATE_SWAP } from "@/ui/pages/panel/motion/presets";
import { RevealPanel } from "@/ui/pages/panel/motion/reveal-panel";
import { ChartSkeleton, EmptyState, ErrorState, LoadingRegion, Panel, RangeSelector } from "@/ui/shared";

const TITLE_ID = "panel-bitcoin-titulo";
/** Todos los estados ocupan la misma celda: al cambiar, el que sale y el que entra se funden uno sobre otro. */
const STATE_CELL = "col-start-1 row-start-1 min-w-0";

/**
 * Histórico del precio de Bitcoin con selector de rango (funciones 10 a 12).
 * El título y el selector se ven en los 4 estados; solo cambia la zona de la gráfica,
 * con un fundido entre estados (el alto está reservado: no salta). La gráfica trae su
 * propia entrada (Bklit), así que a ella no se le añade otra.
 */
export function BitcoinHistoryPanel() {
  const { status, days, setDays, points, yDomain, errorTitle, errorMessage, retry, isRetrying } =
    useBitcoinHistory();

  return (
    <RevealPanel aria-labelledby={TITLE_ID} data-slot="bitcoin-history-panel">
      <Panel.Header className="items-center">
        <Panel.Title id={TITLE_ID}>{PANEL_TEXTS.bitcoin.title}</Panel.Title>
        <Panel.Actions>
          <RangeSelector value={days} onChange={setDays} label={PANEL_TEXTS.bitcoin.rangeLabel} />
        </Panel.Actions>
      </Panel.Header>
      <Panel.Body>
        <div data-slot="bitcoin-chart-zone" className="grid min-h-100 grid-cols-1 items-center">
          <AnimatePresence initial={false}>
            <motion.div
              key={status}
              className={STATE_CELL}
              {...STATE_SWAP}
              initial={status === "success" ? false : STATE_SWAP.initial}
            >
              {status === "error" ? (
                <ErrorState title={errorTitle} message={errorMessage} onRetry={retry} isRetrying={isRetrying} />
              ) : status === "loading" ? (
                <LoadingRegion label={PANEL_TEXTS.bitcoin.loading}>
                  <ChartSkeleton height="lg" />
                </LoadingRegion>
              ) : status === "empty" ? (
                <EmptyState
                  icon={LineChart}
                  headingLevel="h3"
                  title={PANEL_TEXTS.bitcoin.emptyTitle}
                  description={PANEL_TEXTS.bitcoin.emptyDescription}
                  action={
                    <Button type="button" variant="outline" className="min-h-11" onClick={retry} disabled={isRetrying}>
                      {PANEL_TEXTS.bitcoin.emptyAction}
                    </Button>
                  }
                />
              ) : (
                <BitcoinAreaChart points={points} yDomain={yDomain} />
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </Panel.Body>
    </RevealPanel>
  );
}
