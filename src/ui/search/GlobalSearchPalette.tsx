import { COIN_LOADING, SEARCH_TRIGGER_ARIA_LABEL, type CoinLoadErrorNotice } from "@/application/search/messages";
import { useGlobalSearch } from "@/hooks/search";
import { Dialog, DialogContent, DialogTitle } from "@/ui/animate-ui/components/radix/dialog";
import { CoinDetailDialog } from "@/ui/coin-detail";
import { SearchPalette } from "@/ui/search/SearchPalette";
import { PalettePresenceMarker, useDetailAfterPalette } from "@/ui/search/useDetailAfterPalette";
import { useRestoreSearchFocus } from "@/ui/search/useRestoreSearchFocus";
import { usePaletteEntrance } from "@/ui/search/useSearchMotion";
import { notify } from "@/ui/shared";

/** El hook no lanza avisos: lo hace quien lo llama. */
function showCoinLoadError({ title, description }: CoinLoadErrorNotice) {
  notify.error(title, { description });
}

/**
 * Paleta del buscador global + detalle de la moneda elegida. Es el único
 * sitio que llama a `useGlobalSearch()` (pide el top 100): se monta en la
 * primera apertura (`GlobalSearchMount`) y ya no se desmonta.
 * Export por defecto obligatorio: `src/ui/search/index.tsx` lo carga con `lazy()`.
 */
export default function GlobalSearchPalette() {
  const search = useGlobalSearch({ onCoinLoadError: showCoinLoadError });
  const { detail } = search;
  // Con la moneda aún en camino el detalle se abre ya, con su esqueleto.
  // Y espera a que la paleta haya salido: no se ven las dos a la vez.
  const { detailShown, onPalettePresenceChange } = useDetailAfterPalette(detail.isOpen || detail.isLoading);
  const entrance = usePaletteEntrance();
  const rememberOpener = useRestoreSearchFocus(detailShown);

  return (
    <>
      <Dialog open={search.isOpen} onOpenChange={search.setOpen}>
        <DialogContent
          showCloseButton={false}
          aria-describedby={undefined}
          onOpenAutoFocus={rememberOpener}
          data-slot="search-palette"
          {...entrance}
          className="top-4 flex translate-y-0 flex-col gap-0 overflow-hidden rounded-xl bg-popover p-0 shadow-overlay sm:top-24 sm:max-w-xl"
        >
          <DialogTitle className="sr-only">{SEARCH_TRIGGER_ARIA_LABEL}</DialogTitle>
          <PalettePresenceMarker onPresenceChange={onPalettePresenceChange} />
          <SearchPalette
            query={search.query}
            onQueryChange={search.setQuery}
            status={search.status}
            message={search.message}
            results={search.results}
            isFetching={search.isFetching}
            onRetry={search.refetch}
            onSelect={search.selectResult}
            onClose={() => search.setOpen(false)}
          />
        </DialogContent>
      </Dialog>

      <CoinDetailDialog coin={detail.coin} open={detailShown} onOpenChange={detail.setOpen} />
      <p role="status" className="sr-only">
        {detail.isLoading ? COIN_LOADING : ""}
      </p>
    </>
  );
}
