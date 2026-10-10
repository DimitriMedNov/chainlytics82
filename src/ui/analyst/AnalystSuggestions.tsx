import { useId } from "react";
import { motion, useReducedMotion } from "motion/react";
import { ANALYST_TEXTS } from "@/application/analyst/presentation/texts";
import { Button } from "@/ui/animate-ui/components/buttons/button";
import { SUGGESTION_LIST, useAnalystMotion } from "@/ui/analyst/analystMotion";

export interface AnalystSuggestionsProps {
  suggestions: readonly string[];
  /** Envía la pregunta tal cual. */
  onPick: (question: string) => void;
}

/** Botón a todo el ancho: crece lo justo para no salirse y se hunde al pulsar. */
const HOVER_SCALE = 1.015;
const TAP_SCALE = 0.97;

/**
 * Preguntas de ejemplo: cada botón la envía directamente. Entran una detrás de
 * otra y responden al pulsar (con «reducir movimiento», solo el fundido).
 */
export function AnalystSuggestions({ suggestions, onPick }: AnalystSuggestionsProps) {
  const labelId = useId();
  const reduced = useReducedMotion();
  const m = useAnalystMotion();

  return (
    <section aria-labelledby={labelId} className="flex flex-col gap-2">
      <p id={labelId} className="text-xs font-medium text-muted-foreground">
        {ANALYST_TEXTS.welcome.suggestionsLabel}
      </p>
      <motion.ul variants={SUGGESTION_LIST} initial="hidden" animate="visible" className="flex flex-col gap-2">
        {suggestions.map((question) => (
          <motion.li key={question} variants={m.suggestionItem}>
            <Button
              type="button"
              variant="outline"
              hoverScale={reduced ? 1 : HOVER_SCALE}
              tapScale={reduced ? 1 : TAP_SCALE}
              className="h-auto min-h-11 w-full justify-start whitespace-normal py-2 text-left"
              onClick={() => onPick(question)}
            >
              {question}
            </Button>
          </motion.li>
        ))}
      </motion.ul>
    </section>
  );
}
