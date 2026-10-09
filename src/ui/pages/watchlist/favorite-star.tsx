import { Star } from "lucide-react";
import { motion, useReducedMotion, type Transition } from "motion/react";
import { cn } from "@/lib/utils";

export interface FavoriteStarProps {
  /** Si la moneda es favorita: estrella rellena. */
  active: boolean;
  /** `true` solo cuando el usuario acaba de marcarla: reproduce la confirmación. */
  celebrate: boolean;
  /** Pulsación actual; es la `key` del efecto, para que suene una vez por pulsación. */
  beat: number;
}

const EASE_OUT = [0.22, 1, 0.36, 1] as const;
const STAR_POP: Transition = { duration: 0.25, ease: EASE_OUT, delay: 0.08 };
const BLOOM: Transition = { duration: 0.35, ease: EASE_OUT };
const FADE: Transition = { duration: 0.2, ease: "easeOut" };

/**
 * Estrella del botón de favorita. Adaptación del bloque «Like» de Bencho
 * (efecto «Bloom»), como el corazón del modal de detalle: al marcar, la
 * estrella vuelve pasándose de tamaño y florece un anillo donde estaba.
 *
 * Cambios respecto al original: Motion en vez de su hoja de estilos, el anillo
 * se abre con `scale` + `opacity` (el original animaba `border-width`), color
 * del token `chart-3`, sin contador y sin confeti (hay una estrella por fila).
 * Con «reducir movimiento» solo queda un fundido.
 */
export function FavoriteStar({ active, celebrate, beat }: FavoriteStarProps) {
  const reduced = useReducedMotion();
  const pop = celebrate && !reduced;

  return (
    <span data-slot="favorite-star" className="relative inline-flex size-4 items-center justify-center">
      <motion.span
        key={celebrate ? `on${beat}` : "off"}
        className="inline-flex"
        initial={pop ? { scale: 0, opacity: 0 } : celebrate ? { opacity: 0 } : false}
        animate={pop ? { scale: [0, 1.3, 1], opacity: 1 } : { opacity: 1 }}
        transition={pop ? STAR_POP : FADE}
      >
        <Star className={cn("size-4", active && "fill-current")} aria-hidden="true" />
      </motion.span>

      {pop ? (
        <motion.span
          key={beat}
          data-slot="favorite-star-burst"
          aria-hidden="true"
          className="pointer-events-none absolute -inset-1.5 rounded-full border-2 border-chart-3"
          initial={{ scale: 0.2, opacity: 1 }}
          animate={{ scale: 1.15, opacity: 0 }}
          transition={BLOOM}
        />
      ) : null}
    </span>
  );
}
