import { useRef } from "react";
import { X } from "lucide-react";
import { motion } from "motion/react";
import { SEARCH_CLOSE_LABEL, SEARCH_PLACEHOLDER, SEARCH_TRIGGER_ARIA_LABEL } from "@/application/search/messages";
import type { CoinSearchResult } from "@/domain/market/coin";
import type { SearchStatus } from "@/domain/search/rules";
import { cn } from "@/lib/utils";
import { Button } from "@/ui/animate-ui/components/buttons/button";
import { Command, CommandInput, CommandList } from "@/ui/base/command";
import { SearchPaletteFooter } from "@/ui/search/SearchPaletteFooter";
import { SearchResults } from "@/ui/search/SearchResults";
import { SearchEmpty, SearchError, SearchLoading, SearchTooShort } from "@/ui/search/SearchStatusViews";
import { keepEnterForButton } from "@/ui/search/keepEnterForButton";
import { FADE_HIDDEN, FADE_TRANSITION, FADE_VISIBLE } from "@/ui/search/useSearchMotion";
import { useSelectionHighlight } from "@/ui/search/useSelectionHighlight";

export interface SearchPaletteProps {
  query: string;
  onQueryChange: (query: string) => void;
  status: SearchStatus;
  /** Texto del estado; "" cuando hay resultados. */
  message: string;
  results: CoinSearchResult[];
  /** Petición en curso (también recargas con resultados ya en pantalla). */
  isFetching: boolean;
  onRetry: () => void;
  onSelect: (result: CoinSearchResult) => void;
  onClose: () => void;
}

/** Alto fijo de la zona de resultados y estados: la paleta no salta al cambiar de estado. */
const BODY_HEIGHT = "h-72 max-h-72 sm:h-80 sm:max-h-80";

/**
 * Cuerpo de la paleta: caja de búsqueda, lista (cmdk: flechas y Enter) y los
 * estados sin resultados. Solo pinta: todo le llega por props.
 */
export function SearchPalette(props: SearchPaletteProps) {
  const { query, onQueryChange, status, message, results, isFetching, onRetry, onSelect, onClose } = props;
  const inputRef = useRef<HTMLInputElement>(null);
  const hasResults = status === "results";
  const highlight = useSelectionHighlight();

  const clearQuery = () => {
    onQueryChange("");
    inputRef.current?.focus();
  };

  return (
    <>
      {/* El servidor ya filtra: cmdk solo pone el teclado. */}
      <Command
        shouldFilter={false}
        label={SEARCH_TRIGGER_ARIA_LABEL}
        className="h-auto rounded-none bg-transparent **:data-[slot=command-input-wrapper]:h-14 **:data-[slot=command-input-wrapper]:min-w-0 **:data-[slot=command-input-wrapper]:flex-1 **:data-[slot=command-input-wrapper]:border-b-0 **:data-[slot=command-input-wrapper]:gap-1 **:data-[slot=command-input-wrapper]:pr-1 **:data-[slot=command-input-wrapper]:pl-4"
      >
        <div className="flex items-center border-b pr-1.5">
          <CommandInput
            ref={inputRef}
            value={query}
            onValueChange={onQueryChange}
            placeholder={SEARCH_PLACEHOLDER}
            className="h-11 px-2 text-base sm:text-sm"
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="size-11 text-muted-foreground"
            aria-label={SEARCH_CLOSE_LABEL}
            onClick={onClose}
            onKeyDown={keepEnterForButton}
          >
            <X aria-hidden="true" />
          </Button>
        </div>
        <CommandList
          ref={highlight.listRef}
          className={cn(BODY_HEIGHT, "overscroll-contain p-1", !hasResults && "hidden")}
        >
          {hasResults ? (
            <SearchResults
              results={results}
              isFetching={isFetching}
              highlightOffset={highlight.offset}
              onSelect={onSelect}
            />
          ) : null}
        </CommandList>
      </Command>
      {hasResults ? null : (
        <div
          data-slot="search-status"
          data-status={status}
          aria-live="polite"
          className={cn(BODY_HEIGHT, "overflow-y-auto overscroll-contain")}
        >
          {/* Cada estado entra con un fundido; la región viva no se remonta. */}
          <motion.div
            key={status}
            className={cn("flex min-h-full flex-col", status !== "searching" && "justify-center")}
            initial={FADE_HIDDEN}
            animate={FADE_VISIBLE}
            transition={FADE_TRANSITION}
          >
            {status === "searching" ? <SearchLoading /> : null}
            {status === "too-short" ? <SearchTooShort message={message} /> : null}
            {status === "empty" ? <SearchEmpty message={message} onClear={clearQuery} /> : null}
            {status === "error" ? <SearchError message={message} onRetry={onRetry} isRetrying={isFetching} /> : null}
          </motion.div>
        </div>
      )}
      <SearchPaletteFooter />
    </>
  );
}
