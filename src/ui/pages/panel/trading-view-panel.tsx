import { useRef } from "react";
import { AnimatePresence, motion, useIsPresent } from "motion/react";
import { PANEL_TEXTS } from "@/application/panel/presentation/texts";
import { useTradingViewWidget } from "@/hooks/panel/useTradingViewWidget";
import { useTheme } from "@/hooks/theme/useTheme";
import { cn } from "@/lib/utils";
import { DURATION, STATE_SWAP } from "@/ui/pages/panel/motion/presets";
import { RevealPanel } from "@/ui/pages/panel/motion/reveal-panel";
import { ErrorState, LoadingRegion, Panel, Skeleton } from "@/ui/shared";

const TITLE_ID = "panel-tradingview-titulo";

/**
 * Capa de carga sobre el widget. Aparece de golpe (tapa el hueco vacío) y, cuando el
 * widget está listo, se funde para dejarlo ver. Mientras se va no intercepta los clics.
 */
function LoadingLayer() {
  const isPresent = useIsPresent();

  return (
    <motion.div
      className={cn("absolute inset-0 bg-card", !isPresent && "pointer-events-none")}
      exit={{ opacity: 0, transition: { duration: DURATION.overlay, ease: "easeOut" } }}
    >
      <LoadingRegion label={PANEL_TEXTS.tradingView.loading}>
        <div className="flex h-100 flex-col gap-3 p-3">
          <div className="flex items-center gap-2">
            <Skeleton className="h-6 w-28" />
            <Skeleton className="h-6 w-10" />
            <Skeleton className="h-6 w-10" />
          </div>
          <Skeleton className="w-full flex-1 rounded-md" />
          <Skeleton className="h-4 w-full" />
        </div>
      </LoadingRegion>
    </motion.div>
  );
}

/**
 * Widget de TradingView «Precio de Bitcoin», 400 px de alto (funciones 8 y 9).
 * El elemento donde se monta está siempre en el árbol y no se anima (es un iframe
 * de terceros); la carga y el error se pintan encima y son lo único que se funde.
 * Al cambiar el tema, el hook lo vuelve a montar.
 */
export function TradingViewPanel() {
  const hostRef = useRef<HTMLDivElement>(null);
  const { resolvedTheme } = useTheme();
  const { status, retry } = useTradingViewWidget(hostRef, { theme: resolvedTheme });

  return (
    <RevealPanel aria-labelledby={TITLE_ID} data-slot="tradingview-panel">
      <Panel.Header>
        <Panel.Title id={TITLE_ID}>{PANEL_TEXTS.tradingView.title}</Panel.Title>
      </Panel.Header>
      <Panel.Body>
        <div className="relative h-100 overflow-hidden rounded-md border bg-elevated">
          <div ref={hostRef} className="h-full w-full" />
          <AnimatePresence initial={false}>
            {status === "error" ? (
              <motion.div
                key="error"
                className="absolute inset-0 flex items-center justify-center overflow-y-auto bg-card p-3"
                initial={STATE_SWAP.initial}
                animate={STATE_SWAP.animate}
              >
                <ErrorState
                  title={PANEL_TEXTS.tradingView.errorTitle}
                  message={PANEL_TEXTS.tradingView.errorMessage}
                  onRetry={retry}
                  retryLabel={PANEL_TEXTS.retry}
                  className="w-full"
                />
              </motion.div>
            ) : status === "loading" ? (
              <LoadingLayer key="loading" />
            ) : null}
          </AnimatePresence>
        </div>
      </Panel.Body>
    </RevealPanel>
  );
}
