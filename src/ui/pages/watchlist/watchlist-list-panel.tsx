import { motion } from "motion/react";
import type { WatchlistScreen } from "@/hooks/watchlist-screen/useWatchlistScreen";
import type { WatchlistRowHandlers } from "@/ui/pages/watchlist/use-watchlist-row-actions";
import { useWatchlistRowFeedback } from "@/ui/pages/watchlist/use-watchlist-row-feedback";
import { FADE, HIDDEN, VISIBLE, usePanelEntrance } from "@/ui/pages/watchlist/watchlist-motion";
import { WatchlistListBody } from "@/ui/pages/watchlist/watchlist-list-body";

export interface WatchlistListPanelProps {
  screen: Pick<WatchlistScreen, "state" | "search" | "sort" | "sections" | "hiddenCount">;
  handlers: WatchlistRowHandlers;
}

type StateKind = WatchlistScreen["state"]["kind"];

/**
 * Qué estados comparten bloque. Al pasar de un bloque a otro (esqueleto →
 * contenido) el nuevo entra con un fundido; dentro del mismo bloque no se
 * vuelve a montar nada, para que el campo de búsqueda no pierda el foco.
 */
const PHASE: Record<StateKind, string> = {
  "list-error": "error",
  "prices-error": "error",
  "list-loading": "loading",
  "prices-loading": "loading",
  empty: "empty",
  "outside-top": "content",
  "no-matches": "content",
  ready: "content",
};

/** La lista con su búsqueda y su orden, y sus estados: error, cargando, vacío y éxito. */
export function WatchlistListPanel({ screen, handlers }: WatchlistListPanelProps) {
  const feedback = useWatchlistRowFeedback(handlers, screen.sections, screen.state.kind);
  const entrance = usePanelEntrance();

  return (
    <motion.div
      ref={feedback.regionRef}
      data-slot="watchlist-list-region"
      className="flex min-w-0 flex-col"
      initial={entrance.initial}
      animate={entrance.animate}
      transition={entrance.transition(0)}
    >
      <motion.div
        key={PHASE[screen.state.kind]}
        className="flex min-w-0 flex-1 flex-col [&>*]:flex-1"
        initial={HIDDEN}
        animate={VISIBLE}
        transition={FADE}
      >
        <WatchlistListBody screen={screen} handlers={feedback.handlers} celebration={feedback.celebration} />
      </motion.div>
    </motion.div>
  );
}
