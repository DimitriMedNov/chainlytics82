import { motion } from "motion/react";
import { WATCHLIST_TEXTS } from "@/application/watchlist-screen/texts";
import { useWatchlistScreen } from "@/hooks/watchlist-screen/useWatchlistScreen";
import { CoinDetailDialog } from "@/ui/coin-detail";
import { ChangeBarsPanel } from "@/ui/pages/watchlist/change-bars-panel";
import { useWatchlistRowActions } from "@/ui/pages/watchlist/use-watchlist-row-actions";
import { WatchlistListPanel } from "@/ui/pages/watchlist/watchlist-list-panel";
import { SortButton } from "@/ui/pages/watchlist/sort-button";
import { usePanelEntrance } from "@/ui/pages/watchlist/watchlist-motion";
import { PageContainer, PageGrid, PageHeader, SaveStatus, StorageBadge } from "@/ui/shared";

/** Pantalla /watchlist: las monedas que sigues, con precios en vivo y su cambio en 24 h. */
export default function WatchlistPage() {
  const screen = useWatchlistScreen();
  const handlers = useWatchlistRowActions(screen.actions);
  const { header, sort, detail } = screen;
  const entrance = usePanelEntrance();

  return (
    <PageContainer data-slot="watchlist-page">
      <PageHeader
        title={header.title}
        description={header.countLabel}
        actions={
          header.showSortByName ? (
            <SortButton
              label={WATCHLIST_TEXTS.sortByName}
              active={sort.isActive("name")}
              sort={sort}
              onClick={sort.sortByName}
            />
          ) : null
        }
      >
        <StorageBadge isSynced={header.isSynced} />
        <SaveStatus
          isSaving={screen.isSaving}
          errorMessage={screen.saveErrorMessage}
          onDismissError={screen.clearSaveError}
        />
      </PageHeader>

      <PageGrid layout="main">
        <WatchlistListPanel screen={screen} handlers={handlers} />
        {/*
          La entrada de la tarjeta (la gráfica de dentro trae la suya, Bklit) y su
          recolocación: cuando la lista de arriba cambia de alto, la tarjeta se
          desliza a su sitio con `transform` en vez de saltar. Con «reducir
          movimiento» no hay `layout`: Motion no llega a ponerle ningún `transform`.
        */}
        <motion.div
          layout={entrance.slides ? "position" : false}
          className="flex min-w-0 flex-col [&>*]:flex-1"
          initial={entrance.initial}
          animate={entrance.animate}
          transition={entrance.transition(1)}
        >
          <ChangeBarsPanel state={screen.state} series={screen.chartSeries} />
        </motion.div>
      </PageGrid>

      <CoinDetailDialog coin={detail.coin} open={detail.isOpen} onOpenChange={detail.setOpen} />
    </PageContainer>
  );
}
