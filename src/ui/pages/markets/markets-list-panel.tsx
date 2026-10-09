import { AnimatePresence, motion } from "motion/react";
import { Coins, SearchX } from "lucide-react";
import { MARKETS_TEXTS } from "@/application/markets/presentation/texts";
import type { Coin } from "@/domain/market/coin";
import type { MarketListStatus } from "@/domain/markets/listing";
import { MarketCoinList } from "@/ui/pages/markets/market-coin-list";
import { MarketListSkeleton } from "@/ui/pages/markets/market-list-skeleton";
import { STATE_SWAP } from "@/ui/pages/markets/motion/presets";
import { RollingFigure } from "@/ui/pages/markets/motion/rolling-figure";
import { useFirstReveal } from "@/ui/pages/markets/motion/use-first-reveal";
import { PressButton } from "@/ui/pages/markets/press-button";
import { EmptyState, ErrorState, LoadingRegion, Panel } from "@/ui/shared";

export interface MarketsListPanelProps {
  status: MarketListStatus;
  /** «{n} criptomonedas» o «Criptomonedas»: se pinta tal cual. */
  title: string;
  coins: readonly Coin[];
  errorMessage: string;
  isFetching: boolean;
  onRetry: () => void;
  onClearFilters: () => void;
  onViewDetails: (coin: Coin) => void;
}

const TITLE_ID = "markets-list-titulo";
/** El cuerpo del `Panel` compartido como componente de Motion, para fundir un estado con el siguiente. */
const MotionBody = motion.create(Panel.Body);

/**
 * Lista de monedas con sus 4 estados (funciones 6 a 17). Al cambiar de estado
 * (esqueleto → lista, vacío, error) lo anterior se funde y luego aparece lo nuevo;
 * el contador del título rueda al filtrar.
 */
export function MarketsListPanel({
  status,
  title,
  coins,
  errorMessage,
  isFetching,
  onRetry,
  onClearFilters,
  onViewDetails,
}: MarketsListPanelProps) {
  const firstReveal = useFirstReveal();
  const flush = status === "loading" || status === "ready";

  return (
    <Panel aria-labelledby={TITLE_ID} aria-busy={status === "loading"} data-slot="markets-list" data-status={status}>
      <Panel.Header>
        <Panel.Title id={TITLE_ID} aria-live="polite">
          <RollingFigure text={title} value={coins.length} />
        </Panel.Title>
      </Panel.Header>
      <AnimatePresence mode="wait">
        <MotionBody key={status} padding={flush ? "flush" : "default"} {...STATE_SWAP}>
          {status === "error" ? (
            <ErrorState
              title={MARKETS_TEXTS.errorTitle}
              message={errorMessage}
              onRetry={onRetry}
              isRetrying={isFetching}
            />
          ) : status === "loading" ? (
            <LoadingRegion label={MARKETS_TEXTS.loadingList}>
              <MarketListSkeleton />
            </LoadingRegion>
          ) : status === "empty-filters" ? (
            <EmptyState
              icon={SearchX}
              headingLevel="h3"
              title={MARKETS_TEXTS.emptyTitle}
              description={MARKETS_TEXTS.emptyDescription}
              action={
                <PressButton type="button" variant="outline" className="min-h-11" onClick={onClearFilters}>
                  {MARKETS_TEXTS.clearFilters}
                </PressButton>
              }
            />
          ) : status === "empty-api" ? (
            <EmptyState
              icon={Coins}
              headingLevel="h3"
              title={MARKETS_TEXTS.emptyApiTitle}
              description={MARKETS_TEXTS.emptyApiDescription}
              action={
                <PressButton
                  type="button"
                  variant="outline"
                  className="min-h-11"
                  onClick={onRetry}
                  disabled={isFetching}
                >
                  {MARKETS_TEXTS.emptyApiAction}
                </PressButton>
              }
            />
          ) : (
            <MarketCoinList coins={coins} onViewDetails={onViewDetails} {...firstReveal} />
          )}
        </MotionBody>
      </AnimatePresence>
    </Panel>
  );
}
