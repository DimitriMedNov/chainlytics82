import { LoaderCircle } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { SEARCH_RESULTS_HEADING, SEARCH_SEARCHING } from "@/application/search/messages";
import type { CoinSearchResult } from "@/domain/market/coin";
import { CommandGroup } from "@/ui/base/command";
import { SearchResultItem } from "@/ui/search/SearchResultItem";
import { FADE_HIDDEN, FADE_TRANSITION, FADE_VISIBLE, useHighlightTransition } from "@/ui/search/useSearchMotion";

export interface SearchResultsProps {
  results: CoinSearchResult[];
  /** Recarga en curso con resultados ya en pantalla. */
  isFetching: boolean;
  /** Posición de la fila seleccionada (`useSelectionHighlight`); `null` si no hay. */
  highlightOffset: number | null;
  onSelect: (result: CoinSearchResult) => void;
}

/**
 * Grupo «Resultados»: encabezado con el indicador «Buscando…», el resalte que
 * se desliza hasta la fila seleccionada y las filas.
 */
export function SearchResults({ results, isFetching, highlightOffset, onSelect }: SearchResultsProps) {
  const highlightTransition = useHighlightTransition();

  return (
    <CommandGroup
      className="p-0 [&_[cmdk-group-heading]]:px-3 [&_[cmdk-group-items]]:relative [&_[cmdk-group-items]]:isolate"
      heading={
        <span className="flex items-center justify-between gap-2">
          {SEARCH_RESULTS_HEADING}
          <AnimatePresence>
            {isFetching ? (
              <motion.span
                key="fetching"
                data-slot="search-fetching"
                className="flex items-center gap-1.5 font-normal"
                initial={FADE_HIDDEN}
                animate={FADE_VISIBLE}
                exit={FADE_HIDDEN}
                transition={FADE_TRANSITION}
              >
                <LoaderCircle className="size-3.5 animate-spin motion-reduce:animate-none" aria-hidden="true" />
                {SEARCH_SEARCHING}
              </motion.span>
            ) : null}
          </AnimatePresence>
        </span>
      }
    >
      {results.map((result, index) => (
        <SearchResultItem key={result.id} result={result} index={index} onSelect={onSelect} />
      ))}
      {/*
        Un solo resalte para toda la lista; las filas (min-h-11, una línea) miden lo mismo.
        Va detrás de las filas (-z-10) y al final: cmdk mira si la fila seleccionada es el
        primer hijo del grupo para volver a enseñar el encabezado.
      */}
      <motion.div
        aria-hidden="true"
        data-slot="search-highlight"
        className="pointer-events-none absolute -z-10 inset-x-0 top-0 h-11 rounded-md bg-accent"
        initial={false}
        animate={{ y: highlightOffset ?? 0, opacity: highlightOffset === null ? 0 : 1 }}
        transition={highlightTransition}
      >
        {/*
          Pista de selección que no depende del fondo tenue: barra con el token `link`
          (≥ 3:1 contra `accent` y `popover` en claro y oscuro). Viaja dentro del resalte,
          así que se mueve con su mismo `transform`; no ocupa sitio en la fila.
        */}
        <span data-slot="search-highlight-bar" className="absolute inset-y-2 left-0 w-1 rounded-full bg-link" />
      </motion.div>
    </CommandGroup>
  );
}
