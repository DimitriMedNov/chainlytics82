import { useEffect } from "react";
import { useReducedMotion } from "motion/react";
import type { Coin } from "@/domain/market/coin";
import { MarketCoinRow } from "@/ui/pages/markets/market-coin-row";
import { STAGGER, entrance } from "@/ui/pages/markets/motion/presets";
import type { UseFirstRevealResult } from "@/ui/pages/markets/motion/use-first-reveal";

export interface MarketCoinListProps extends UseFirstRevealResult {
  /** Ya filtradas y ordenadas. */
  coins: readonly Coin[];
  onViewDetails: (coin: Coin) => void;
}

/**
 * Las filas de la lista (las 100 de golpe, sin paginar). En la primera carga las
 * primeras entran escalonadas; después, al filtrar u ordenar, aparecen sin animar.
 */
export function MarketCoinList({ coins, onViewDetails, enterIndexFor, markRevealed }: MarketCoinListProps) {
  const reducedMotion = useReducedMotion() === true;

  // Tras el primer pintado de la lista, ninguna fila nueva vuelve a escalonarse.
  useEffect(markRevealed, [markRevealed]);

  return (
    <ul data-slot="market-coin-list" className="divide-y border-t">
      {coins.map((coin, index) => {
        const enterIndex = enterIndexFor(index);
        return (
          <MarketCoinRow
            key={coin.id}
            coin={coin}
            onViewDetails={onViewDetails}
            entrance={enterIndex === null ? null : entrance(enterIndex, STAGGER.row, reducedMotion)}
          />
        );
      })}
    </ul>
  );
}
