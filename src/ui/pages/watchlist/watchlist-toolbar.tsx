import { useId, useRef, type KeyboardEvent } from "react";
import { Search, X } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { WATCHLIST_TEXTS } from "@/application/watchlist-screen/texts";
import type { WatchlistScreen } from "@/hooks/watchlist-screen/useWatchlistScreen";
import { Button } from "@/ui/animate-ui/components/buttons/button";
import { Input } from "@/ui/base/input";
import { Label } from "@/ui/base/label";
import { SortButton } from "@/ui/pages/watchlist/sort-button";
import { Skeleton } from "@/ui/shared";

const CLEAR_IN = { duration: 0.15, ease: "easeOut" } as const;

export interface WatchlistToolbarProps {
  search: WatchlistScreen["search"];
  sort: WatchlistScreen["sort"];
  /** «Precio» y «Cambio» no tienen sentido cuando no hay ninguna fila con precio. */
  showSort: boolean;
}

/**
 * Búsqueda por nombre o símbolo y orden por precio o cambio (vale para las dos secciones).
 * Del bloque «Search» de Bencho: Escape vacía el campo. El botón de limpiar
 * aparece y se va con fundido y escala, y al limpiar el foco vuelve al campo.
 */
export function WatchlistToolbar({ search, sort, showSort }: WatchlistToolbarProps) {
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const reduced = useReducedMotion();
  const hidden = reduced ? { opacity: 0 } : { opacity: 0, scale: 0.6 };

  const clear = () => {
    search.clear();
    inputRef.current?.focus();
  };

  const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key !== "Escape" || !search.term) return;
    event.preventDefault();
    search.clear();
  };

  return (
    <div data-slot="watchlist-toolbar" className="flex min-w-0 flex-col gap-3 sm:flex-row sm:items-end">
      <div className="flex min-w-0 flex-1 flex-col gap-2">
        <Label htmlFor={inputId}>{WATCHLIST_TEXTS.searchLabel}</Label>
        <div className="relative">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden="true"
          />
          <Input
            ref={inputRef}
            id={inputId}
            type="text"
            role="searchbox"
            enterKeyHint="search"
            autoComplete="off"
            value={search.term}
            onChange={(event) => search.setTerm(event.target.value)}
            onKeyDown={onKeyDown}
            placeholder={WATCHLIST_TEXTS.searchPlaceholder}
            className="h-11 pl-9 pr-11"
          />
          <AnimatePresence initial={false}>
            {search.term ? (
              <motion.span
                key="clear"
                className="absolute right-0 top-0"
                initial={hidden}
                animate={{ opacity: 1, scale: 1 }}
                exit={hidden}
                transition={CLEAR_IN}
              >
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  aria-label={WATCHLIST_TEXTS.noMatchesAction}
                  onClick={clear}
                  className="size-11 text-muted-foreground"
                >
                  <X aria-hidden="true" />
                </Button>
              </motion.span>
            ) : null}
          </AnimatePresence>
        </div>
      </div>
      {showSort ? (
        <div role="group" aria-label={WATCHLIST_TEXTS.sortGroupLabel} className="flex shrink-0 gap-2">
          <SortButton
            label={WATCHLIST_TEXTS.sortByPrice}
            active={sort.isActive("price")}
            sort={sort}
            onClick={sort.sortByPrice}
          />
          <SortButton
            label={WATCHLIST_TEXTS.sortByChange}
            active={sort.isActive("change")}
            sort={sort}
            onClick={sort.sortByChange}
          />
        </div>
      ) : null}
    </div>
  );
}

/** Con la forma de `WatchlistToolbar`: etiqueta, campo y los dos botones de orden. */
export function WatchlistToolbarSkeleton() {
  return (
    <div className="flex min-w-0 flex-col gap-3 sm:flex-row sm:items-end">
      <div className="flex min-w-0 flex-1 flex-col gap-2">
        <Skeleton className="h-3.5 w-40" />
        <Skeleton className="h-11 w-full rounded-md" />
      </div>
      <div className="flex shrink-0 gap-2">
        <Skeleton className="h-11 w-24 rounded-md" />
        <Skeleton className="h-11 w-24 rounded-md" />
      </div>
    </div>
  );
}
