import { Heart } from "lucide-react";
import { motion, useReducedMotion, type Transition } from "motion/react";
import { cn } from "@/lib/utils";

export interface FollowHeartProps {
  /** Si la moneda está seguida: corazón relleno. */
  active: boolean;
  /** `true` solo cuando el usuario acaba de pulsar «Seguir»: reproduce la confirmación. */
  celebrate: boolean;
  /** Pulsación actual; es la `key` de la capa del efecto, para que suene una vez por pulsación. */
  beat: number;
  className?: string;
}

/** Colores del confeti: las series del proyecto (en Bencho eran siete colores fijos). */
const CONFETTI = ["bg-chart-1", "bg-chart-2", "bg-chart-3", "bg-chart-4", "bg-chart-5"] as const;
const SPOKES = [0, 1, 2, 3, 4, 5, 6] as const;
/** Lo que vuela cada punto desde el anillo, en px (el «burst» de Bencho). */
const FLY = 14;
const EASE_OUT = [0.22, 1, 0.36, 1] as const;

const HEART_POP: Transition = { duration: 0.25, ease: EASE_OUT, delay: 0.1 };
const BLOOM: Transition = { duration: 0.35, ease: EASE_OUT };
const CONFETTI_FLY: Transition = { duration: 0.4, ease: EASE_OUT, delay: 0.08 };
const FADE: Transition = { duration: 0.2, ease: "easeOut" };

/**
 * Corazón del botón de seguimiento. Adaptación del bloque «Like» de Bencho,
 * efecto «Bloom»: al seguir, el corazón desaparece, florece un anillo donde
 * estaba, salen siete pares de puntos y el corazón vuelve pasándose de tamaño.
 *
 * Cambios respecto al original: Motion en vez de su hoja de estilos (mismo
 * motor que el resto del modal), el anillo se abre con `scale` + `opacity`
 * (el original animaba `border-width`), colores de los tokens y sin contador.
 * Con «reducir movimiento» solo queda un fundido del corazón.
 */
export function FollowHeart({ active, celebrate, beat, className }: FollowHeartProps) {
  const reduced = useReducedMotion();
  const pop = celebrate && !reduced;

  return (
    <span data-slot="follow-heart" className={cn("relative inline-flex size-4 items-center justify-center", className)}>
      <motion.span
        key={celebrate ? `on${beat}` : "off"}
        className="inline-flex"
        initial={pop ? { scale: 0, opacity: 0 } : celebrate ? { opacity: 0 } : false}
        animate={pop ? { scale: [0, 1.25, 1], opacity: 1 } : { opacity: 1 }}
        transition={pop ? HEART_POP : FADE}
      >
        <Heart className={cn("size-4", active && "fill-current text-chart-5")} aria-hidden="true" />
      </motion.span>

      {pop ? (
        <span
          key={beat}
          data-slot="follow-heart-burst"
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
        >
          <motion.span
            className="absolute -inset-1 rounded-full border-2 border-chart-5"
            initial={{ scale: 0.2, opacity: 1 }}
            animate={{ scale: 1.12, opacity: 0 }}
            transition={BLOOM}
          />
          {SPOKES.map((k) => (
            <motion.span
              key={k}
              className="absolute left-1/2 top-1/2 size-0"
              style={{ rotate: k * (360 / SPOKES.length) - 90 }}
            >
              <motion.i
                className={cn("absolute -left-1 -top-0.5 size-1 rounded-full", CONFETTI[k % CONFETTI.length])}
                initial={{ x: 8, opacity: 0, scale: 1 }}
                animate={{ x: 8 + FLY, opacity: [0, 1, 0], scale: [1, 1, 0.4] }}
                transition={CONFETTI_FLY}
              />
              <motion.i
                className={cn("absolute -left-1 top-0.5 size-1 rounded-full", CONFETTI[(k + 3) % CONFETTI.length])}
                initial={{ x: 8, opacity: 0, scale: 0.75 }}
                animate={{ x: 8 + FLY * 0.7, opacity: [0, 1, 0], scale: [0.75, 0.75, 0.3] }}
                transition={CONFETTI_FLY}
              />
            </motion.span>
          ))}
        </span>
      ) : null}
    </span>
  );
}
