import type { Ref } from "react";
import { motion, useIsPresent } from "motion/react";
import { formatCurrency, formatPercent } from "@/application/shared/presentation/format";
import { WATCHLIST_TEXTS } from "@/application/watchlist-screen/texts";
import type { WatchlistCoin } from "@/domain/watchlist/entries";
import { cn } from "@/lib/utils";
import { useRefreshFade } from "@/ui/pages/watchlist/use-refresh-fade";
import type { WatchlistRowHandlers } from "@/ui/pages/watchlist/use-watchlist-row-actions";
import {
  HIDDEN,
  VISIBLE,
  useRowMotion,
  useRowPlacement,
  type SectionName,
} from "@/ui/pages/watchlist/watchlist-motion";
import { WatchlistRowActions } from "@/ui/pages/watchlist/watchlist-row-actions";
import { CoinAvatar, PriceChange, Skeleton } from "@/ui/shared";

const ROW = "flex min-w-0 flex-col gap-2 rounded-lg border bg-elevated p-3 sm:flex-row sm:items-center sm:gap-4";
/** La copia vieja de una fila que ya está en la otra sección sale sin verse. */
const LEFTOVER_EXIT = { opacity: 0, transition: { duration: 0 } } as const;

export interface WatchlistRowProps extends WatchlistRowHandlers {
  item: WatchlistCoin;
  /** Sección en la que se pinta esta fila. */
  section: SectionName;
  /** El usuario acaba de marcarla como favorita. */
  celebrate: boolean;
  beat: number;
  /** Lo pone `AnimatePresence` para sacar la fila del flujo mientras sale. */
  ref?: Ref<HTMLLIElement>;
}

/**
 * Fila de una moneda seguida (tarjeta de Watermelon «Pin Item», adaptada):
 * imagen, nombre y símbolo; precio y cambio en 24 h; y sus cuatro botones.
 * En móvil los botones bajan a una segunda línea para caber a 320 px.
 *
 * Movimiento (Motion): la fila viaja a su nueva sección o posición con un
 * `layoutId` compartido (solo `transform`), se funde al entrar si no estaba a
 * la vista y sale con fundido al quitarla.
 */
export function WatchlistRow({ item, section, celebrate, beat, ref, ...handlers }: WatchlistRowProps) {
  const isPresent = useIsPresent();
  const rowMotion = useRowMotion();
  const { wasVisible, isLeftover } = useRowPlacement(item.id, section);
  const price = formatCurrency(item.price);
  const figuresRef = useRefreshFade<HTMLDivElement>(`${price}|${formatPercent(item.change24h)}`);

  return (
    <motion.li
      ref={ref}
      data-slot="watchlist-row"
      data-row-id={item.id}
      data-favorite={item.isFavorite}
      inert={!isPresent}
      layout={rowMotion.travels ? "position" : false}
      layoutId={rowMotion.travels ? `watchlist-row-${item.id}` : undefined}
      initial={wasVisible ? false : HIDDEN}
      animate={VISIBLE}
      exit={isLeftover ? LEFTOVER_EXIT : rowMotion.exit}
      transition={rowMotion.transition}
      className={cn(ROW, isLeftover && "invisible")}
    >
      <div className="flex min-w-0 flex-1 items-center gap-3">
        <CoinAvatar src={item.image} symbol={item.symbol} size="px48" />
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-foreground">{item.name}</p>
          <p className="truncate text-xs uppercase text-muted-foreground">{item.symbol}</p>
        </div>
        <div ref={figuresRef} data-slot="watchlist-row-figures" className="flex shrink-0 flex-col items-end gap-0.5">
          <span className="type-num text-sm font-semibold text-foreground">{price}</span>
          <PriceChange value={item.change24h} period={WATCHLIST_TEXTS.changePeriod} />
        </div>
      </div>

      <WatchlistRowActions item={item} celebrate={celebrate} beat={beat} removed={!isPresent} {...handlers} />
    </motion.li>
  );
}

/** Con la forma de `WatchlistRow`: imagen, dos líneas, precio y los cuatro botones. */
export function WatchlistRowSkeleton() {
  return (
    <li className={ROW}>
      <div className="flex min-w-0 flex-1 items-center gap-3">
        <Skeleton className="size-12 shrink-0 rounded-full" />
        <div className="flex min-w-0 flex-1 flex-col gap-2">
          <Skeleton className="h-4 w-28 max-w-full" />
          <Skeleton className="h-3 w-12" />
        </div>
        <div className="flex shrink-0 flex-col items-end gap-2">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-3 w-14" />
        </div>
      </div>
      <div className="flex shrink-0 items-center justify-end gap-1">
        <Skeleton className="size-11 rounded-md" />
        <Skeleton className="size-11 rounded-md" />
        <Skeleton className="size-11 rounded-md" />
        <Skeleton className="size-11 rounded-md" />
      </div>
    </li>
  );
}
