import type { Ref } from "react";
import { X } from "lucide-react";
import { AnimatePresence, motion, useIsPresent } from "motion/react";
import { COMPARE_TEXTS } from "@/application/compare/presentation/texts";
import type { SelectedCoin } from "@/hooks/compare/useCompareScreen";
import { Button } from "@/ui/animate-ui/components/buttons/button";
import { Badge } from "@/ui/base/badge";
import { CHIP_SCALE, ENTER, EXIT, REORDER } from "@/ui/pages/compare/motion";
import { SeriesDot } from "@/ui/pages/compare/series-dot";

export interface CoinChipProps extends SelectedCoin {
  onRemove: (coinId: string) => void;
  /** Lo pone `AnimatePresence` para sacar del flujo al chip que se va. */
  ref?: Ref<HTMLLIElement>;
}

/**
 * Un chip. Entra y sale con fundido y una escala corta (confirma que la moneda se añadió
 * o se quitó); si un vecino se va, se desliza a su sitio nuevo. Mientras sale queda
 * `inert` (su X ya no se puede pulsar) y conserva el color que tenía: los que se quedan
 * no se vuelven a montar, solo cambian de color, así que nada parpadea.
 */
function CoinChip({ coin, colorIndex, onRemove, ref }: CoinChipProps) {
  const isPresent = useIsPresent();
  return (
    <motion.li
      ref={ref}
      layout="position"
      inert={!isPresent}
      initial={{ opacity: 0, scale: CHIP_SCALE }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: CHIP_SCALE, transition: EXIT }}
      transition={{ ...ENTER, layout: REORDER }}
      data-slot="coin-chip"
    >
      <Badge variant="outline" className="h-11 gap-2 overflow-visible bg-card py-0 pl-3 pr-0 text-sm">
        <SeriesDot colorIndex={colorIndex} />
        <span className="font-medium">{coin.symbol}</span>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="size-11 rounded-full text-muted-foreground hover:text-foreground"
          aria-label={COMPARE_TEXTS.picker.removeLabel(coin.name)}
          onClick={() => onRemove(coin.id)}
        >
          <X aria-hidden="true" />
        </Button>
      </Badge>
    </motion.li>
  );
}

export interface CoinChipsProps {
  selected: SelectedCoin[];
  onRemove: (coinId: string) => void;
  /** Id del título que nombra la lista. */
  labelledBy: string;
  /** `true` si los chips presentes al montar la lista también deben entrar animados. */
  animateInitial?: boolean;
}

/** Monedas elegidas: punto del color de su línea, símbolo y botón para quitarla. */
export function CoinChips({ selected, onRemove, labelledBy, animateInitial = false }: CoinChipsProps) {
  return (
    <ul
      aria-labelledby={labelledBy}
      data-slot="coin-chips"
      className="relative flex flex-wrap items-center gap-2"
    >
      <AnimatePresence mode="popLayout" initial={animateInitial}>
        {selected.map(({ coin, colorIndex }) => (
          <CoinChip key={coin.id} coin={coin} colorIndex={colorIndex} onRemove={onRemove} />
        ))}
      </AnimatePresence>
    </ul>
  );
}
