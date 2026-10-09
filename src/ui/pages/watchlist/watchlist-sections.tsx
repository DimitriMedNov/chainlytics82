import { useId, type Ref } from "react";
import { Star } from "lucide-react";
import { AnimatePresence, LayoutGroup, motion } from "motion/react";
import type { WatchlistCoin } from "@/domain/watchlist/entries";
import type { WatchlistScreen } from "@/hooks/watchlist-screen/useWatchlistScreen";
import type { WatchlistRowHandlers } from "@/ui/pages/watchlist/use-watchlist-row-actions";
import type { FavoriteCelebration } from "@/ui/pages/watchlist/use-watchlist-row-feedback";
import {
  HIDDEN,
  PlacementContext,
  VISIBLE,
  usePlacementHistory,
  useRowMotion,
  type SectionName,
} from "@/ui/pages/watchlist/watchlist-motion";
import { WatchlistRow } from "@/ui/pages/watchlist/watchlist-row";

export interface SectionProps {
  name: SectionName;
  title: string;
  items: WatchlistCoin[];
  handlers: WatchlistRowHandlers;
  celebration: FavoriteCelebration | null;
  /** Lo pone `AnimatePresence` para sacar la sección del flujo mientras sale. */
  ref?: Ref<HTMLElement>;
}

function Section({ name, title, items, handlers, celebration, ref }: SectionProps) {
  const titleId = useId();
  const rowMotion = useRowMotion();

  return (
    <section
      ref={ref}
      aria-labelledby={titleId}
      data-slot="watchlist-section"
      data-section={name}
      className="flex min-w-0 flex-col gap-3"
    >
      <motion.h2
        id={titleId}
        layout={rowMotion.travels ? "position" : false}
        initial={HIDDEN}
        animate={VISIBLE}
        exit={HIDDEN}
        transition={rowMotion.transition}
        className="type-eyebrow flex items-center gap-1.5 text-muted-foreground"
      >
        {name === "favorites" ? (
          <Star className="size-3.5 fill-current text-chart-3" aria-hidden="true" />
        ) : null}
        {title}
      </motion.h2>
      <ul className="relative flex min-w-0 flex-col gap-2">
        <AnimatePresence initial={false} mode="popLayout" propagate>
          {items.map((item) => (
            <WatchlistRow
              key={item.id}
              item={item}
              section={name}
              celebrate={celebration?.id === item.id && item.isFavorite}
              beat={celebration?.beat ?? 0}
              {...handlers}
            />
          ))}
        </AnimatePresence>
      </ul>
    </section>
  );
}

export interface WatchlistSectionsProps {
  sections: WatchlistScreen["sections"];
  handlers: WatchlistRowHandlers;
  celebration: FavoriteCelebration | null;
}

/**
 * «Favoritas (n)» arriba y «Todas (n)» debajo; cada una solo si tiene monedas.
 * Las dos comparten grupo de layout: una fila que cambia de sección viaja de
 * una a otra, y las demás se recolocan al ordenar, buscar o quitar.
 */
export function WatchlistSections({ sections, handlers, celebration }: WatchlistSectionsProps) {
  const { favorites, others } = sections;
  const placement = usePlacementHistory(sections);

  return (
    <PlacementContext value={placement}>
      <LayoutGroup>
        <div className="relative flex min-w-0 flex-col gap-6">
          <AnimatePresence initial={false} mode="popLayout">
            {favorites.items.length > 0 ? (
              <Section
                key="favorites"
                name="favorites"
                title={favorites.title}
                items={favorites.items}
                handlers={handlers}
                celebration={celebration}
              />
            ) : null}
            {others.items.length > 0 ? (
              <Section
                key="others"
                name="others"
                title={others.title}
                items={others.items}
                handlers={handlers}
                celebration={celebration}
              />
            ) : null}
          </AnimatePresence>
        </div>
      </LayoutGroup>
    </PlacementContext>
  );
}
