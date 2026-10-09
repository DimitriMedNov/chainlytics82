import { motion, useReducedMotion, type Transition } from "motion/react";
import { WATCHLIST_TEXTS } from "@/application/watchlist-screen/texts";
import type { WatchlistScreen } from "@/hooks/watchlist-screen/useWatchlistScreen";
import { Button } from "@/ui/animate-ui/components/buttons/button";

export interface SortButtonProps {
  label: string;
  active: boolean;
  sort: Pick<WatchlistScreen["sort"], "arrow" | "order">;
  onClick: () => void;
}

/** El muelle del botón de invertir de «Asset swap» (Bencho), acortado a 250 ms. */
const FLIP: Transition = { type: "spring", duration: 0.25, bounce: 0.25 };
const FADE: Transition = { duration: 0.15, ease: "easeOut" };

/**
 * Botón de orden: el activo enseña la flecha del sentido; repetirlo lo invierte.
 * La flecha gira media vuelta al cambiar de sentido (como la del botón de
 * invertir de «Asset swap»); con «reducir movimiento» solo se funde. Su hueco
 * está siempre reservado, así el botón no cambia de ancho al activarse.
 */
export function SortButton({ label, active, sort, onClick }: SortButtonProps) {
  const reduced = useReducedMotion();

  return (
    <Button type="button" variant="outline" aria-pressed={active} onClick={onClick} className="min-h-11">
      {label}
      <span data-slot="sort-arrow" className="inline-flex w-3.5 justify-center">
        {active ? (
          <motion.span
            key={sort.arrow}
            aria-hidden="true"
            className="inline-block"
            initial={reduced ? { opacity: 0 } : { opacity: 0.4, rotate: -180 }}
            animate={reduced ? { opacity: 1 } : { opacity: 1, rotate: 0 }}
            transition={reduced ? FADE : FLIP}
          >
            {sort.arrow}
          </motion.span>
        ) : null}
      </span>
      {active ? (
        <span className="sr-only">
          {sort.order === "asc" ? WATCHLIST_TEXTS.ascending : WATCHLIST_TEXTS.descending}
        </span>
      ) : null}
    </Button>
  );
}
