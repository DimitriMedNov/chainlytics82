import type { Ref } from "react";
import { X } from "lucide-react";
import { AnimatePresence, motion, useIsPresent, useReducedMotion, type MotionValue } from "motion/react";
import { COMPARE_TEXTS } from "@/application/compare/presentation/texts";
import type { SelectedCoin } from "@/hooks/compare/useCompareScreen";
import { Button } from "@/ui/animate-ui/components/buttons/button";
import { Badge } from "@/ui/base/badge";
import { CHIP_SCALE, ENTER, EXIT, REORDER } from "@/ui/pages/compare/motion";
import { SeriesDot } from "@/ui/pages/compare/series-dot";
import { useGroupLean } from "@/ui/pages/compare/use-group-lean";

export interface CoinChipProps extends SelectedCoin {
  onRemove: (coinId: string) => void;
  /** Inclinación hacia el cursor, la misma para todos los chips del grupo. */
  leanX: MotionValue<number>;
  leanY: MotionValue<number>;
  /** Lo pone `AnimatePresence` para sacar del flujo al chip que se va. */
  ref?: Ref<HTMLLIElement>;
}

/**
 * Un chip. Entra y sale con fundido y una escala corta (confirma que la moneda se añadió
 * o se quitó); si un vecino se va, se desliza a su sitio nuevo. Mientras sale queda
 * `inert` (su X ya no se puede pulsar) y conserva el color que tenía: los que se quedan
 * no se vuelven a montar, solo cambian de color, así que nada parpadea.
 * La inclinación hacia el cursor va en un elemento de dentro: el `li` ya lleva la
 * transformación de entrada, salida y recolocación, y dos en el mismo se pelearían.
 */
function CoinChip({ coin, colorIndex, onRemove, leanX, leanY, ref }: CoinChipProps) {
  const isPresent = useIsPresent();
  /** Con «reducir movimiento» el chip solo se funde: sin esto, al salir saltaría de golpe a la escala pequeña. */
  const scale = useReducedMotion() ? 1 : CHIP_SCALE;
  return (
    <motion.li
      ref={ref}
      layout="position"
      inert={!isPresent}
      initial={{ opacity: 0, scale }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale, transition: EXIT }}
      transition={{ ...ENTER, layout: REORDER }}
      data-slot="coin-chip"
    >
      <motion.div style={{ x: leanX, y: leanY }} data-slot="coin-chip-skin">
        <Badge
          variant="outline"
          className="h-11 gap-2 overflow-visible bg-card py-0 pl-3 pr-0 text-sm transition-colors duration-200 hover:bg-accent"
        >
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
      </motion.div>
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
  const lean = useGroupLean<HTMLUListElement>();
  return (
    <ul
      ref={lean.ref}
      aria-labelledby={labelledBy}
      data-slot="coin-chips"
      className="relative flex flex-wrap items-center gap-2"
    >
      <AnimatePresence mode="popLayout" initial={animateInitial}>
        {selected.map(({ coin, colorIndex }) => (
          <CoinChip
            key={coin.id}
            coin={coin}
            colorIndex={colorIndex}
            onRemove={onRemove}
            leanX={lean.x}
            leanY={lean.y}
          />
        ))}
      </AnimatePresence>
    </ul>
  );
}
