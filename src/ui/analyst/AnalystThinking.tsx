import { motion, useReducedMotion } from "motion/react";
import { ANALYST_TEXTS } from "@/application/analyst/presentation/texts";
import { AnalystBubble } from "@/ui/analyst/AnalystBubble";
import { DOT_PULSE, dotTransition, RISE_HIDDEN, RISE_VISIBLE_AFTER } from "@/ui/analyst/analystMotion";

const DOTS = [0, 1, 2] as const;

/** Tres puntos que laten por turnos; quietos con «reducir movimiento». */
function ThinkingDots() {
  const reduced = useReducedMotion();

  return (
    <span aria-hidden="true" className="flex shrink-0 items-center gap-1">
      {DOTS.map((dot) =>
        reduced ? (
          <span key={dot} className="size-1.5 rounded-full bg-current opacity-70" />
        ) : (
          <motion.span
            key={dot}
            className="size-1.5 rounded-full bg-current"
            animate={DOT_PULSE}
            transition={dotTransition(dot)}
          />
        ),
      )}
    </span>
  );
}

/**
 * «Analizando...» hasta el primer trozo. Tiene la forma de una burbuja del
 * asistente y se quita de golpe (sin salida animada): la respuesta nace en su
 * mismo sitio y con su misma altura, así que nada salta.
 */
export function AnalystThinking() {
  return (
    <motion.div data-slot="analyst-thinking" initial={RISE_HIDDEN} animate={RISE_VISIBLE_AFTER}>
      <AnalystBubble role="assistant" className="text-muted-foreground">
        <span role="status" className="flex items-center gap-2">
          <ThinkingDots />
          {ANALYST_TEXTS.thinking}
        </span>
      </AnalystBubble>
    </motion.div>
  );
}
