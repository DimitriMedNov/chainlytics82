import { memo, useState } from "react";
import { motion } from "motion/react";
import { ChevronRight } from "lucide-react";
import { MARKETS_TEXTS, viewDetailsSuffix } from "@/application/markets/presentation/texts";
import { formatCompact, formatCurrency } from "@/application/shared/presentation/format";
import type { Coin } from "@/domain/market/coin";
import type { EntranceProps } from "@/ui/pages/markets/motion/presets";
import { useRefreshPulse } from "@/ui/pages/markets/motion/use-refresh-pulse";
import { PressButton } from "@/ui/pages/markets/press-button";
import { CoinAvatar, PriceChange } from "@/ui/shared";

export interface MarketCoinRowProps {
  coin: Coin;
  /** Abre el modal de detalle de esta moneda. */
  onViewDetails: (coin: Coin) => void;
  /**
   * Entrada escalonada de la primera carga, o `null` si la fila aparece sin animar.
   * Solo se mira al montar: una fila que ya está no vuelve a entrar.
   */
  entrance: EntranceProps | null;
}

const ROW = "flex min-h-16 items-center gap-2 px-3 py-2 hover:bg-accent/60 sm:gap-4 sm:px-5";
const FIGURE = "type-num whitespace-nowrap text-sm font-medium text-foreground";
const FIGURE_LABEL = "text-2xs text-muted-foreground";

/**
 * Fila de una moneda (funciones 7 a 13). En móvil el puesto baja a la línea del
 * símbolo y el botón queda en icono, para que a 320 px quepa sin desbordar.
 * El color y la flecha del cambio los decide `PriceChange` (0 exacto = subida).
 *
 * Movimiento: solo las primeras filas de la primera carga son de Motion (entrada
 * escalonada); las demás son un `<li>` normal. Precio y cambio hacen un fundido
 * corto cuando se refrescan.
 */
function MarketCoinRowBase({ coin, onViewDetails, entrance }: MarketCoinRowProps) {
  // Se decide una vez: si cambiara después, React desmontaría la fila al cambiar de etiqueta.
  const [mountEntrance] = useState(entrance);
  const figuresRef = useRefreshPulse<HTMLDivElement>(`${coin.price}|${coin.change24h}`);
  const rank = `#${coin.rank}`;

  const cells = (
    <>
      <span className="type-num hidden w-9 shrink-0 text-xs text-muted-foreground sm:block">
        <span className="sr-only">{MARKETS_TEXTS.rankLabel} </span>
        {rank}
      </span>
      <CoinAvatar src={coin.image} symbol={coin.symbol} alt="" size="lg" />
      <div className="flex min-w-0 flex-1 flex-col">
        <span className="truncate text-sm font-medium text-foreground">{coin.name}</span>
        <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <span className="type-num sm:hidden">
            <span className="sr-only">{MARKETS_TEXTS.rankLabel} </span>
            {rank}
          </span>
          <span className="truncate uppercase">{coin.symbol}</span>
        </span>
      </div>
      <div ref={figuresRef} data-slot="market-coin-figures" className="flex shrink-0 flex-col items-end">
        <span className={FIGURE}>
          <span className="sr-only">{MARKETS_TEXTS.priceLabel} </span>
          {formatCurrency(coin.price)}
        </span>
        <PriceChange value={coin.change24h} period={MARKETS_TEXTS.changePeriod} />
      </div>
      <div className="hidden w-36 shrink-0 flex-col items-end sm:flex">
        <span className={FIGURE_LABEL}>{MARKETS_TEXTS.marketCapLabel}</span>
        <span className={FIGURE}>{formatCompact(coin.marketCap)}</span>
      </div>
      <div className="hidden w-36 shrink-0 flex-col items-end lg:flex">
        <span className={FIGURE_LABEL}>{MARKETS_TEXTS.volumeLabel}</span>
        <span className={FIGURE}>{formatCompact(coin.volume24h)}</span>
      </div>
      <PressButton
        type="button"
        variant="outline"
        className="min-h-11 min-w-11 shrink-0 px-0 md:px-3"
        onClick={() => onViewDetails(coin)}
      >
        <span className="sr-only md:not-sr-only">{MARKETS_TEXTS.viewDetails}</span>
        <span className="sr-only">{viewDetailsSuffix(coin.name)}</span>
        <ChevronRight aria-hidden="true" className="md:hidden" />
      </PressButton>
    </>
  );

  if (mountEntrance) {
    return (
      <motion.li data-slot="market-coin-row" className={ROW} {...mountEntrance}>
        {cells}
      </motion.li>
    );
  }

  return (
    <li data-slot="market-coin-row" className={ROW}>
      {cells}
    </li>
  );
}

/** Con `memo`: al teclear en el buscador solo se repintan las filas que cambian. */
export const MarketCoinRow = memo(MarketCoinRowBase);
